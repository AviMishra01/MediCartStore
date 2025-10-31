import { Router } from "express";
import crypto from "crypto";
import { promisify } from "util";
import mongoose from "mongoose";
import { UserModel, User } from "../models/User";
import { signUserToken, requireUser } from "../middleware/auth";
import { OAuth2Client } from "google-auth-library";

const scrypt = promisify(crypto.scrypt);
export const authRouter = Router();

// ----------------- HELPERS -----------------
const isMongo = () => mongoose.connection?.readyState === 1;

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

// ----------------- GOOGLE LOGIN -----------------
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

authRouter.post("/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Missing token" });

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) return res.status(400).json({ message: "Invalid Google token" });

    const email = payload.email.toLowerCase();
    const name = payload.name || "No Name";

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({ email, name, role: "user" });
    }

    const jwt = signUserToken(user._id);
    res.json({ token: jwt, user });
  } catch (err: any) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Google login failed." });
  }
});

// ----------------- FACEBOOK LOGIN -----------------
authRouter.post("/facebook", async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    if (!accessToken || !userID) return res.status(400).json({ message: "Missing Facebook credentials" });

    // Verify Facebook token via Graph API
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`
    );
    const data = await response.json();
    if (!data || data.error) return res.status(400).json({ message: "Invalid Facebook token" });

    const email = data.email?.toLowerCase();
    const name = data.name || "No Name";

    if (!email) return res.status(400).json({ message: "Facebook account has no email" });

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({ email, name, role: "user" });
    }

    const jwt = signUserToken(user._id);
    res.json({ token: jwt, user });
  } catch (err: any) {
    console.error("Facebook Login Error:", err);
    res.status(500).json({ message: "Facebook login failed." });
  }
});

// ----------------- SIGNUP -----------------
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Please fill all required fields." });

    const normalizedEmail = email.toLowerCase();
    const passwordHash = await hashPassword(password);

    if (isMongo()) {
      const existingUser = await UserModel.findOne({ email: normalizedEmail }).lean();
      if (existingUser) return res.status(409).json({ message: "Email already registered" });

      const newUser = await UserModel.create({ name, email: normalizedEmail, passwordHash, phone, role: "user" });
      const token = signUserToken(String(newUser._id));

      return res.status(201).json({
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      });
    } else {
      return res.status(503).json({ message: "Database not connected" });
    }
  } catch (err: any) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// ----------------- LOGIN -----------------
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password." });

    const normalizedEmail = email.toLowerCase();

    if (isMongo()) {
      const user = await UserModel.findOne({ email: normalizedEmail }).lean();
      if (!user) return res.status(401).json({ message: "Invalid credentials." });

      const isValid = await verifyPassword(user.passwordHash, password);
      if (!isValid) return res.status(401).json({ message: "Invalid credentials." });

      const token = signUserToken(String(user._id));
      return res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      return res.status(503).json({ message: "Database not connected" });
    }
  } catch (err: any) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

// ----------------- CURRENT USER -----------------
authRouter.get("/me", requireUser, async (req, res) => {
  try {
    const userId = (req as any).user.sub;
    if (!userId) return res.status(400).json({ message: "Invalid token." });

    if (isMongo()) {
      const user = await UserModel.findById(userId).lean();
      if (!user) return res.status(404).json({ message: "User not found." });

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } else {
      return res.status(503).json({ message: "Database not connected" });
    }
  } catch (err: any) {
    console.error("Get Me Error:", err);
    res.status(500).json({ message: "Failed to fetch user info." });
  }
});
