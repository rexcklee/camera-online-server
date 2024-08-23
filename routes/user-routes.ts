import ApiResponse from "../models/apiResponse";
import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config(); // Load environment variables

const prisma = new PrismaClient();
const router = Router(); // Initialize Express Router
const jwtKey = process.env.JWT_KEY;
const saltRounds = 10;

//Login admin user
router.post("/login/", async (req, res) => {
    let token_expire_sec = 1800; // in second

    const { email, password } = req.body;

    console.log(email, password);
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        console.log(user);
        if (user?.isAdmin) {
            bcrypt
                .compare(password, user!.password)
                .then((bcryptres) => {
                    if (bcryptres) {
                        jwt.sign(
                            { user },
                            process.env.JWT_KEY!,
                            { expiresIn: token_expire_sec },
                            (err, token) => {
                                if (err) {
                                    console.log(err);
                                }
                                const successResponse = ApiResponse.success({
                                    token: token,
                                    expire_in: token_expire_sec,
                                    currentUser: user,
                                });
                                res.send(successResponse);
                            }
                        );
                    } else {
                        const errorResponse = ApiResponse.error(
                            401,
                            "ERROR: Could not log in"
                        );
                        res.send(errorResponse);
                    }
                })
        } else {
            const errorResponse = ApiResponse.error(
                401,
                "ERROR: Could not log in as admin"
            );
            res.send(errorResponse);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get All user
router.get("/get_all/", async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany();
        console.log(allUsers);
        const successResponse = ApiResponse.success(allUsers);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Register user
router.post("/register_user/", async (req, res) => {
    const { name, email, isAdmin, password } = req.body;

    console.log(name, email, isAdmin, password);

    bcrypt.hash(password, saltRounds).then(async (hash) => {


        try {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hash,
                    name,
                    isAdmin,
                },
            });
            console.log(newUser);
            const successResponse = ApiResponse.success(newUser);
            res.json(successResponse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

// Update user
router.post("/update/", async (req, res) => {
    const { id, name, email, isAdmin } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name,
                email,
                isAdmin,
            },
        });
        console.log(updatedUser);
        const successResponse = ApiResponse.success(updatedUser);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete user
router.post("/delete/", async (req, res) => {
    const { id } = req.body;
    try {
        const deletedUser = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });
        console.log(deletedUser);
        const successResponse = ApiResponse.success(deletedUser);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router; // Export the router
