import ApiResponse from "../models/apiResponse";
import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import checkToken, { CustomRequest } from '../middleware';
dotenv.config(); // Load environment variables

const prisma = new PrismaClient();
const router = Router(); // Initialize Express Router
const jwtKey = process.env.JWT_KEY;

// Get All Products
router.get("/get_all/", async (req: Request, res: Response) => {
    try {
        const allProducts = await prisma.product.findMany();
        console.log(allProducts);
        const successResponse = ApiResponse.success(allProducts);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get All Products
router.post("/get_by_cat/", async (req: Request, res: Response) => {
    const { selectedCat, selectedSubCat, searchText } = req.body;
    try {
        const whereClause: any = {};

        if (selectedCat) {
            whereClause.category = { name: { equals: selectedCat } };
        }

        if (selectedSubCat) {
            whereClause.subcategory = { name: { equals: selectedSubCat } };
        }

        if (searchText) {
            whereClause.OR = [
                { name: { contains: searchText } },
                { description: { contains: searchText } }
            ];
        }

        const allProducts = await prisma.product.findMany({
            where: whereClause,
        });

        console.log(allProducts);
        const successResponse = ApiResponse.success(allProducts);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Products
router.post("/get_byId/", async (req: Request, res: Response) => {
    const { id } = req.body;
    console.log(id);
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
        });

        if (product) {
            const successResponse = ApiResponse.success(product);
            res.json(successResponse);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Add Product
router.post("/add/", checkToken, (req: CustomRequest, res: Response) => {
    const { name, description, price, categoryId, subcategoryId } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const newProduct = await prisma.product.create({
                    data: {
                        name,
                        description,
                        price: Number(price),
                        categoryId,
                        subcategoryId,
                    },
                });
                console.log(newProduct);
                const successResponse = ApiResponse.success(newProduct);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

// Update Product
router.post("/update/", checkToken, async (req: CustomRequest, res: Response) => {
    const { id, name, description, price, categoryId, subcategoryId } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const updatedProduct = await prisma.product.update({
                    where: { id: Number(id) },
                    data: {
                        name,
                        description,
                        price,
                        categoryId,
                        subcategoryId
                    },
                });
                console.log(updatedProduct);
                const successResponse = ApiResponse.success(updatedProduct);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

// Delete Product
router.post("/delete/", checkToken, (req: CustomRequest, res: Response) => {
    const { id } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const deletedProduct = await prisma.product.delete({
                    where: {
                        id: Number(id),
                    },
                });
                console.log(deletedProduct);
                const successResponse = ApiResponse.success(deletedProduct);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

export default router; // Export the router
