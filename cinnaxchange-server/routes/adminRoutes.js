import express from "express";
import {
  getAllUsers, deleteUser,
  getAllListings, deleteListingAdmin,
  getAllAuctions,
  getAllComplaints, resolveComplaint, fileComplaint,
  getVerificationRequests, approveVerification, rejectVerification,
} from "../controllers/adminController.js";
import { authMiddleware, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();
const admin = [authMiddleware, requireRole("admin")];
const auth = [authMiddleware];

// Users
router.get("/users", ...admin, getAllUsers);
router.delete("/users/:id", ...admin, deleteUser);

// Listings
router.get("/listings", ...admin, getAllListings);
router.delete("/listings/:id", ...admin, deleteListingAdmin);

// Auctions
router.get("/auctions", ...admin, getAllAuctions);

// Complaints
router.get("/complaints", ...admin, getAllComplaints);
router.put("/complaints/:id/resolve", ...admin, resolveComplaint);
router.post("/complaints", ...auth, fileComplaint);   // any logged-in user

// Verifications
router.get("/verifications", ...admin, getVerificationRequests);
router.put("/verifications/:id/approve", ...admin, approveVerification);
router.put("/verifications/:id/reject", ...admin, rejectVerification);

export default router;