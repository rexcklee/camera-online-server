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

// Get All productAttributes
router.get("/get_all/", async (req: Request, res: Response) => {
    try {
        const allProductAttribute = await prisma.productAttribute.findMany();
        console.log(allProductAttribute);
        const successResponse = ApiResponse.success(allProductAttribute);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get All Attributes by product ID
router.post("/get_byId/", async (req: Request, res: Response) => {
    const { productId } = req.body;

    try {
        const productAttributes = await prisma.productAttribute.findMany({
            where: { productId: Number(productId) },
            orderBy: [
                {
                    sort: 'asc',
                },
            ],
            include: {
                attribute: true,
            },
        });

        if (productAttributes) {
            const successResponse = ApiResponse.success(productAttributes);
            res.json(successResponse);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Add productAttribute
router.post("/add/", checkToken, (req: CustomRequest, res: Response) => {
    const { attributeId, productId, value } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const newProductAttribute = await prisma.productAttribute.create({
                    data: {
                        attributeId: Number(attributeId),
                        productId: Number(productId),
                        value: value,
                    },
                });
                console.log(newProductAttribute);
                const successResponse = ApiResponse.success(newProductAttribute);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

// Update productAttribute
router.post("/update/", checkToken, async (req: CustomRequest, res: Response) => {
    const { id, attributeId, productId, sort, value } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const updatedProductAttribute = await prisma.productAttribute.update({
                    where: { id: Number(id) },
                    data: {
                        attributeId,
                        productId,
                        sort,
                        value,
                    },
                });
                console.log(updatedProductAttribute);
                const successResponse = ApiResponse.success(updatedProductAttribute);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

// Delete productAttribute
router.post("/delete/", checkToken, (req: CustomRequest, res: Response) => {
    const { id } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const deletedProductAttribute = await prisma.productAttribute.delete({
                    where: {
                        id: Number(id),
                    },
                });
                console.log(deletedProductAttribute);
                const successResponse = ApiResponse.success(deletedProductAttribute);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

export default router; // Export the router
