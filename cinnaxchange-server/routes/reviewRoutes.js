import express from "express";
import { getSellerReviews, getMyReviews, createReview } from "../controllers/reviewController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/seller/:sellerId", getSellerReviews);                       // public
router.get("/my-reviews", authMiddleware, requireRole("buyer"), getMyReviews);
router.post("/", authMiddleware, requireRole("buyer"), createReview);
export default router;