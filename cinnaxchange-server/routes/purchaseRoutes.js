import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { buyNow } from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/buy", protect, buyNow);

export default router;