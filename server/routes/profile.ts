import express from "express";
import { UserModel } from "../models/User";
import { authMiddleware } from "../middleware/auth"; // your existing auth middleware

const router = express.Router();

// Get current user profile
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const user = await UserModel.findById(userId).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update user profile (name, phone)
router.put("/", authMiddleware, async (req, res) => {
  const { name, phone } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    req.userId,
    { name, phone },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
});

// Add new address
router.post("/address", authMiddleware, async (req, res) => {
  const { label, line1, line2, city, state, zip, country } = req.body;
  const user = await UserModel.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.addresses.push({ label, line1, line2, city, state, zip, country });
  await user.save();
  res.json(user.addresses);
});

// Update an existing address
router.put("/address/:index", authMiddleware, async (req, res) => {
  const index = Number(req.params.index);
  const { label, line1, line2, city, state, zip, country } = req.body;

  const user = await UserModel.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.addresses[index]) return res.status(400).json({ message: "Address not found" });

  user.addresses[index] = { label, line1, line2, city, state, zip, country };
  await user.save();
  res.json(user.addresses);
});

export default router;
