import mongoose, { Schema, InferSchemaType } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    text: { type: String, required: true },
    replies: [
      {
        userId: String,
        userName: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export type Review = InferSchemaType<typeof ReviewSchema> & { _id: string };

export const ReviewModel = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
