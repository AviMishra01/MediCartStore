import mongoose, { Schema, InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
      // Keep legacy single image for compatibility, but prefer `images` array in new data
      image: { type: String },
      images: { type: [String], default: [] },
    stock: { type: Number, default: 0 },
    category: { type: String, index: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type Product = InferSchemaType<typeof ProductSchema> & { _id: string };

export const ProductModel =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
