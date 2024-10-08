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

// Get All product categories
router.get("/get_all/", async (req: Request, res: Response) => {
    try {
        const allCategories = await prisma.category.findMany({
            orderBy: {
                sort: 'asc',
            },
        });
        console.log(allCategories);
        const successResponse = ApiResponse.success(allCategories);
        res.json(successResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Add product category
router.post("/add/", checkToken, (req: CustomRequest, res: Response) => {
    const { name, description } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const newCategory = await prisma.category.create({
                    data: {
                        name,
                        description,
                    },
                });
                console.log(newCategory);
                const successResponse = ApiResponse.success(newCategory);
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
    const { id, name, description, sort } = req.body;
    jwt.verify(req.token!, jwtKey!, async (err, authorizedData) => {
        if (err) {
            console.log("ERROR: Could not connect to the protected route");
            res.status(403).json({ message: "Forbidden: No token provided" });
        } else {
            try {
                const updatedCategory = await prisma.category.update({
                    where: { id: Number(id) },
                    data: {
                        name,
                        description,
                        sort,
                    },
                });
                console.log(updatedCategory);
                const successResponse = ApiResponse.success(updatedCategory);
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
                const deletedCategory = await prisma.category.delete({
                    where: {
                        id: Number(id),
                    },
                });
                console.log(deletedCategory);
                const successResponse = ApiResponse.success(deletedCategory);
                res.json(successResponse);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    });
});
// router.post("/delete_product_category/", checkToken, (req, res) => {
//   jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
//     if (err) {
//       //If error send Forbidden (403)
//       console.log("ERROR: Could not connect to the protected route");
//       res.sendStatus(403);
//     } else {
//       pool.query(
//         "DELETE FROM `product_categories` WHERE `category_id` = ?",
//         [req.body.category_id],
//         function (err, results) {
//           if (err) {
//             console.error(err);
//             const errorResponse = ApiResponse.error(
//               500,
//               "Internal Server Error"
//             );
//             res.send(errorResponse);
//           } else {
//             const successResponse = ApiResponse.success(results);
//             res.json(successResponse);
//           }
//         }
//       );
//     }
//   });
// });

export default router; // Export the router
