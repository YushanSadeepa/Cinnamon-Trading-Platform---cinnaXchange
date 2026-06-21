import express from "express";
import { getProducts, getProductById, getMyProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";
import { handleProductUpload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/my-products", authMiddleware, requireRole("seller"), getMyProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, requireRole("seller"), handleProductUpload, createProduct);
router.put("/:id", authMiddleware, requireRole("seller"), handleProductUpload, updateProduct);
router.delete("/:id", authMiddleware, requireRole("seller"), deleteProduct);

export default router;
