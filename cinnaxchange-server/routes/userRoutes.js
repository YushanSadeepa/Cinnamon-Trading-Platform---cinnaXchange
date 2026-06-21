import express from "express";
import { getMe, updateMe, getTrustScore, getSellerProfile, submitVerification } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { handleKycUpload } from "../middleware/upload.js";

const router = express.Router();
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.get("/trust/:userId", getTrustScore);
router.get("/seller/:id", getSellerProfile);
router.post("/submit-verification", authMiddleware, handleKycUpload, submitVerification);
export default router;
