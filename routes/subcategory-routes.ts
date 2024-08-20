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

// Get All sub-categories
router.get("/get_all/", async (req: Request, res: Response) => {
    try {
        const allSubCategories = await prisma.subCategory.findMany({
            orderBy: {
                sort: 'asc',
            },
            include: {
                category: true,
            },
        });
        console.log(allSubCategories);
        const successResponse = ApiResponse.success(allSubCategories);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Add product sub-category
router.post("/add/", checkToken, (req: CustomRequest, res: Response) => {
    const { name, description, categoryId } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const newSubCategory = await prisma.subCategory.create({
                    data: {
                        name,
                        description,
                        categoryId,
                    },
                });
                console.log(newSubCategory);
                const successResponse = ApiResponse.success(newSubCategory);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

// Update product category
router.post("/update/", checkToken, async (req: CustomRequest, res: Response) => {
    const { id, name, description, categoryId, sort } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const updatedSubCategory = await prisma.subCategory.update({
                    where: { id: Number(id) },
                    data: {
                        name,
                        description,
                        sort,
                        categoryId,
                    },
                });
                console.log(updatedSubCategory);
                const successResponse = ApiResponse.success(updatedSubCategory);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

// Delete product category
router.post("/delete/", checkToken, (req: CustomRequest, res: Response) => {
    const { id } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const deletedSubCategory = await prisma.subCategory.delete({
                    where: {
                        id: Number(id),
                    },
                });
                console.log(deletedSubCategory);
                const successResponse = ApiResponse.success(deletedSubCategory);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

export default router; // Export the router
