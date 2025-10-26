import { Router } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import { promisify } from "util";
import { requireAdmin, signAdminToken } from "../middleware/auth";
import { UserModel } from "../models/User";

const scrypt = promisify(crypto.scrypt);

async function verifyPassword(stored: string, password: string): Promise<boolean> {
  try {
    const [salt, key] = stored.split(":");
    const derived = (await scrypt(password, salt, 64)) as Buffer;
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), derived);
  } catch (err) {
    return false;
  }
}

export const adminAuthRouter = Router();

// ADMIN LOGIN
adminAuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const inEmail = String(email).toLowerCase().trim();
  const inPassword = String(password).trim();

  // ENV admin quick login
  const envEmail = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const envPass = String(process.env.ADMIN_PASSWORD || '');
  if (envEmail && inEmail === envEmail && inPassword === envPass) {
    return res.json({ requiresCode: true });
  }

  // DB admin login
  try {
    if (mongoose.connection?.readyState === 1) {
      const user = await UserModel.findOne({ email: inEmail, role: "admin" }).lean();
      if (user && user.passwordHash) {
        const ok = await verifyPassword(user.passwordHash, inPassword);
        if (ok) return res.json({ requiresCode: true });
      }
    }
  } catch (err) {
    console.error("admin-login error:", err);
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// ADMIN VERIFY 2FA CODE
adminAuthRouter.post("/verify", (req, res) => {
  const { email, code } = req.body as { email?: string; code?: string };
  if (email === process.env.ADMIN_EMAIL && code === process.env.ADMIN_CODE) {
    const token = signAdminToken(email!);
    return res.json({ token });
  }
  return res.status(401).json({ message: "Invalid code" });
});

// GET ADMIN INFO
adminAuthRouter.get("/me", requireAdmin, (req, res) => {
  res.json({ email: (req as any).admin.sub, role: "admin" });
});

// LIST USERS WITH PHONE
adminAuthRouter.get("/users", requireAdmin, async (_req, res) => {
  try {
    if (mongoose.connection?.readyState === 1) {
      const users = await UserModel.find().lean();
      const sanitized = users.map((u) => {
        const { passwordHash, __v, ...rest } = u;
        return rest; // now includes phone if present in DB
      });
      return res.json({ users: sanitized });
    }
    return res.json({ users: [] });
  } catch (err) {
    console.error("admin/users error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Note: product CRUD routes are handled by server/routes/products.ts and mounted at
// /api/admin/products in server/index.ts. Avoid duplicating those routes here.
