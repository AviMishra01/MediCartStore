import { Router } from "express";
import { ReviewModel } from "../models/Review";
import { requireUser } from "../middleware/auth";

export const reviewsRouter = Router();

// GET reviews for a product
reviewsRouter.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewModel.find({ productId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reviews, total: reviews.length });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all reviews (admin)
reviewsRouter.get("/", async (req, res) => {
  try {
    const reviews = await ReviewModel.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json({ reviews, total: reviews.length });
  } catch (err) {
    console.error("Error fetching all reviews:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST new review (user)
reviewsRouter.post("/", requireUser, async (req, res) => {
  try {
    const { productId, rating, title, text } = req.body;
    const userId = (req as any).user.sub;

    if (!productId || !rating || !title || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Get user name from request (frontend should send it)
    const userName = (req.body.userName || "Anonymous") as string;

    const review = await ReviewModel.create({
      productId,
      userId,
      userName,
      rating,
      title,
      text,
      replies: [],
    });

    res.json(review);
  } catch (err: any) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// POST reply to review (admin/user)
reviewsRouter.post("/:reviewId/reply", requireUser, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text } = req.body;
    const userId = (req as any).user.sub;
    const userName = (req.body.userName || "Anonymous") as string;

    if (!text) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const review = await ReviewModel.findByIdAndUpdate(
      reviewId,
      {
        $push: {
          replies: {
            userId,
            userName,
            text,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (err: any) {
    console.error("Error adding reply:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// DELETE review (admin only)
reviewsRouter.delete("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deleted = await ReviewModel.findByIdAndDelete(reviewId);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ ok: true });
  } catch (err: any) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});
