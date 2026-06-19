import express from "express";
import { getProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);                                   // public
router.get("/my-products", authMiddleware, requireRole("seller"), getMyProducts);
router.get("/:id", getProductById);                             // public
router.post("/", authMiddleware, requireRole("seller"), createProduct);
router.put("/:id", authMiddleware, requireRole("seller"), updateProduct);
router.delete("/:id", authMiddleware, requireRole("seller"), deleteProduct);

export default router;