import ApiResponse from "../models/apiResponse";
import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const prisma = new PrismaClient();
const router = Router(); // Initialize Express Router

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
router.post("/add/", async (req, res) => {
    const { name, description } = req.body;
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
});
// router.post("/add/", checkToken, (req, res) => {
//   jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
//     if (err) {
//       //If error send Forbidden (403)
//       console.log("ERROR: Could not connect to the protected route");
//       res.sendStatus(403);
//     } else {
//       pool.query(
//         "INSERT INTO `product_categories` (`category_name`) VALUES (?)",
//         [req.body.category_name],
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

// Update product category
router.post("/update/", async (req, res) => {
    const { id, name, description, sort } = req.body;
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
});
// router.post("/update_product_category/", checkToken, (req, res) => {
//   const { body } = req;
//   const { category_name, category_sort, category_id } = body;
//   jwt.verify(req.token, process.env.PRIVATE_KEY, (err, authorizedData) => {
//     if (err) {
//       //If error send Forbidden (403)
//       console.log("ERROR: Could not connect to the protected route");
//       res.sendStatus(403);
//     } else {
//       pool.query(
//         "UPDATE `product_categories` SET `category_name` = ?, `category_sort` = ? WHERE `category_id` = ?",
//         //[req.body.category_name, req.body.category_sort, req.body.category_id],
//         [category_name, category_sort, category_id],
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

// Delete product category
router.post("/delete/", async (req, res) => {
    const { id } = req.body;
    try {
        const deletedUser = await prisma.category.delete({
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
