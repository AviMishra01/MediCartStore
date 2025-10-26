import mongoose, { Schema, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    phone: { type: String }, // <- new field
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof UserSchema> & { _id: string };

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
