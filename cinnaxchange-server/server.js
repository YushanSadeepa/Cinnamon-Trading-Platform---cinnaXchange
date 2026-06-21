import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import noCache from "./middleware/noCache.js";
import registerAuctionHandlers from "./socket/auctionHandler.js";
import { startAuctionScheduler } from "./utils/auctionScheduler.js";

dotenv.config();

const app = express();

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * MIDDLEWARE
 */
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(noCache);

// Serve uploaded files as static assets
// e.g. http://localhost:5000/uploads/products/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * HTTP SERVER + SOCKET.IO
 */
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true },
});

/**
 * DATABASE
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    startAuctionScheduler();
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

/**
 * API ROUTES
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("CinnaXchange API Running"));

/**
 * SOCKET.IO
 * Each user joins their personal room (user_<id>) on connect
 * so targeted notifications can be pushed in real time.
 */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // User joins their personal notification room
  socket.on("join_user_room", (userId) => {
    socket.join(`user_${userId}`);
  });

  // Register auction-specific handlers
  registerAuctionHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

/**
 * SERVER START
 */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
