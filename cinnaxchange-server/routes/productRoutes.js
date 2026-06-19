import express from "express";

import {
  createProduct,
  getProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProduct);

router.get("/", getProducts);

router.get("/my-products", protect, getMyProducts);

router.put("/:id", protect, updateProduct);

router.delete("/:id", protect, deleteProduct);

export default router;