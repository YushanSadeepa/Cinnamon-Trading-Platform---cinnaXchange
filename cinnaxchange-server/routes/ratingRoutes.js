import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { rateSeller } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/", protect, rateSeller);

export default router;