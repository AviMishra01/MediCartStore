import mongoose, { Schema, InferSchemaType } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
  },
  { _id: false },
);

const ShippingSchema = new Schema(
  {
    fullName: { type: String },
    name: { type: String },
    phone: { type: String },
    addressLine: { type: String },
    address1: { type: String },
    address2: { type: String },
    province: { type: String },
    city: { type: String },
    municipality: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "Nepal" },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderNumber: { type: String, unique: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_warehouse",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    estimatedDelivery: { type: Date },
    shipping: { type: ShippingSchema },
    trackingInfo: { type: String },
  },
  { timestamps: true },
);

// Generate sequential 6-digit order number
OrderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastOrder = await (mongoose.models.Order as any)
      .findOne({}, {}, { sort: { createdAt: -1 } })
      .lean();

    let nextNumber = 1;
    if (lastOrder && lastOrder.orderNumber) {
      nextNumber = parseInt(lastOrder.orderNumber, 10) + 1;
    }
    this.orderNumber = String(nextNumber).padStart(6, "0");
  }
  next();
});

export type Order = InferSchemaType<typeof OrderSchema> & { _id: string };

export const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
