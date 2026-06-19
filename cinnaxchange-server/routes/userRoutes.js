import express from "express";
import { getMe, updateMe, getTrustScore, getSellerProfile, submitVerification } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.get("/trust/:userId", getTrustScore);                    // public
router.get("/seller/:id", getSellerProfile);                    // public
router.post("/submit-verification", authMiddleware, submitVerification);
export default router;