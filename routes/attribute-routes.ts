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

// Get All attribute categories
router.get("/get_all/", async (req: Request, res: Response) => {
    try {
        const allAttributes = await prisma.attribute.findMany();
        console.log(allAttributes);
        const successResponse = ApiResponse.success(allAttributes);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Add attribute
router.post("/add/", checkToken, (req: CustomRequest, res: Response) => {
    const { name } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const newAttribute = await prisma.attribute.create({
                    data: {
                        name,
                    },
                });
                console.log(newAttribute);
                const successResponse = ApiResponse.success(newAttribute);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

// Update attribute
router.post("/update/", checkToken, async (req: CustomRequest, res: Response) => {
    const { id, name } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const updatedAttribute = await prisma.attribute.update({
                    where: { id: Number(id) },
                    data: {
                        name,
                    },
                });
                console.log(updatedAttribute);
                const successResponse = ApiResponse.success(updatedAttribute);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});

// Delete attribute
router.post("/delete/", checkToken, (req: CustomRequest, res: Response) => {
    const { id } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const deletedAttribute = await prisma.attribute.delete({
                    where: {
                        id: Number(id),
                    },
                });
                console.log(deletedAttribute);
                const successResponse = ApiResponse.success(deletedAttribute);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});


export default router; // Export the router
