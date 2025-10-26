import { Router } from "express";
import crypto from "crypto";
import { promisify } from "util";
import mongoose from "mongoose";
import { UserModel, User } from "../models/User";
import { signUserToken, requireUser } from "../middleware/auth";

const scrypt = promisify(crypto.scrypt);

const authRouter = Router();
export { authRouter };

let memoryUsers: (User & { _id: string })[] = [];
let nextUserId = 1;

function isMongo(): boolean {
  return mongoose.connection?.readyState === 1;
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

async function verifyPassword(stored: string, password: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), derived);
}

// ----------------- SIGNUP -----------------
authRouter.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  };

  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const normalizedEmail = String(email).toLowerCase();
  const passwordHash = await hashPassword(password);

  if (isMongo()) {
    const exists = await UserModel.findOne({ email: normalizedEmail }).lean();
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const doc = await UserModel.create({
      name,
      email: normalizedEmail,
      passwordHash,
      phone, // <--- added
      role: "user",
    });
    const user = doc.toObject() as User & { _id: string };
    const token = signUserToken(String(user._id));
    return res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  }

  // Memory fallback
  if (memoryUsers.some((u) => u.email === normalizedEmail))
    return res.status(409).json({ message: "Email already registered" });

  const user: User & { _id: string } = {
    _id: String(nextUserId++),
    name,
    email: normalizedEmail,
    passwordHash,
    phone, // <--- added
    role: "user",
    createdAt: new Date() as any,
    updatedAt: new Date() as any,
  } as any;
  memoryUsers.push(user);
  const token = signUserToken(user._id);
  return res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
});

// ----------------- LOGIN -----------------
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const normalizedEmail = String(email).toLowerCase();

  if (isMongo()) {
    const user = (await UserModel.findOne({ email: normalizedEmail }).lean()) as
      | (User & { _id: string })
      | null;
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await verifyPassword(user.passwordHash, password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signUserToken(String(user._id));
    return res.json({
      token,
      user: { _id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  }

  const user = memoryUsers.find((u) => u.email === normalizedEmail);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await verifyPassword(user.passwordHash, password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signUserToken(user._id);
  return res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
});

// ----------------- GET CURRENT USER -----------------
authRouter.get("/me", requireUser, async (req, res) => {
  const userId = (req as any).user.sub as string;

  if (isMongo()) {
    const user = (await UserModel.findById(userId).lean()) as (User & { _id: string }) | null;
    if (!user) return res.status(404).json({ message: "Not found" });

    return res.json({
      _id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone, // <--- added
      role: user.role,
    });
  }

  const user = memoryUsers.find((u) => u._id === userId);
  if (!user) return res.status(404).json({ message: "Not found" });

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone, // <--- added
    role: user.role,
  });
});
