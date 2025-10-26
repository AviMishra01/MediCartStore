import { Router } from "express";
import mongoose from "mongoose";
import { ProductModel } from "../models/Product";
import { sampleProducts } from "../data/sample-products";
import { UserModel } from "../models/User";
import crypto from "crypto";
import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);

export const seedRouter = Router();

function isMongo(): boolean {
  return mongoose.connection?.readyState === 1;
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

seedRouter.post("/all", async (_req, res) => {
  if (!isMongo()) return res.status(500).json({ message: "MongoDB not connected" });
  const result: Record<string, any> = {};

  // Seed products if empty
  const pCount = await ProductModel.countDocuments();
  if (pCount === 0) {
    await ProductModel.insertMany(sampleProducts);
    result.productsInserted = sampleProducts.length;
  } else {
    result.productsExisting = pCount;
  }

  // Seed a demo user if none
  const uCount = await UserModel.countDocuments();
  if (uCount === 0) {
    const passwordHash = await hashPassword("password123");
    const user = await (UserModel as any).create({
      name: "Demo User",
      email: "demo@example.com",
      passwordHash,
      role: "user",
    });
    result.userInserted = { _id: user._id, email: user.email };
  } else {
    result.usersExisting = uCount;
  }

  return res.json({ ok: true, ...result });
});

seedRouter.post("/products", async (_req, res) => {
  if (!isMongo()) return res.status(500).json({ message: "MongoDB not connected" });
  const pCount = await ProductModel.countDocuments();
  if (pCount === 0) {
    await ProductModel.insertMany(sampleProducts);
    return res.json({ ok: true, inserted: sampleProducts.length });
  }
  return res.json({ ok: true, message: "Products already exist", count: pCount });
});

seedRouter.post("/user", async (req, res) => {
  if (!isMongo()) return res.status(500).json({ message: "MongoDB not connected" });
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
  const exists = await (UserModel as any).findOne({ email: String(email).toLowerCase() }).lean();
  if (exists) return res.status(409).json({ message: "Email already exists" });
  const passwordHash = await hashPassword(password);
  const user = await (UserModel as any).create({ name, email: String(email).toLowerCase(), passwordHash, role: "user" });
  return res.json({ ok: true, user: { _id: user._id, email: user.email } });
});

// Convenience GET endpoint to seed quickly from browser
seedRouter.get("/all", async (req, res) => {
  (seedRouter as any).handle({ ...req, method: "POST", url: "/all" }, res);
});
