import express from "express";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, getNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.put("/mark-all-read", authMiddleware, markAllAsRead);
router.put("/:id/read", authMiddleware, markAsRead);
export default router;
