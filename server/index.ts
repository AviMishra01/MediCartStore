// server.ts
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

import express from "express";
import cors from "cors";

import { handleDemo } from "./routes/demo";
import { connectMongo } from "./config/db";
import { productsRouter } from "./routes/products";
import { adminAuthRouter } from "./routes/admin-auth";
import { authRouter } from "./routes/auth";
import { seedRouter } from "./routes/seed";
import { reviewsRouter } from "./routes/reviews";
import ordersRouter from "./routes/orders";

import { ensureSeed } from "./services/productService";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health & demo endpoints
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);

  // API routes
  app.use("/api/products", productsRouter);           // Public products
  app.use("/api/admin", adminAuthRouter);            // Admin login, verify, me
  app.use("/api/admin/products", productsRouter);    // Admin products CRUD
  app.use("/api/auth", authRouter);                  // User auth
  app.use("/api/reviews", reviewsRouter);            // Reviews
  app.use("/api/orders", ordersRouter);              // Orders
  app.use("/api/seed", seedRouter);                  // Seed data

  // Initialize DB connection and seed if needed
  ensureSeed();
  connectMongo()
    .then((connected) => {
      if (!connected) {
        console.warn("MongoDB not connected. Using in-memory fallback for products.");
      } else {
        console.log("MongoDB connected.");
      }
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err instanceof Error ? err.message : err);
    });

  return app;
}
