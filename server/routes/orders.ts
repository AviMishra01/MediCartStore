import { Router } from "express";
import mongoose from "mongoose";
import { OrderModel } from "../models/Order";
import { requireUser, requireAdmin } from "../middleware/auth";

export const ordersRouter = Router();

let inMemoryOrders: any[] = [];
let nextOrderId = 1;

function isMongoConnected(): boolean {
  return mongoose.connection?.readyState === 1;
}

// Create an order (authenticated user)
ordersRouter.post("/", requireUser, async (req, res) => {
  try {
    const userId = (req as any).user.sub as string;
    const { items, total, shipping, shippingAddress, tax, subtotal } = req.body as any;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const orderData = {
      userId,
      items: items.map((it: any) => ({
        productId: it.productId || String(Math.random()),
        name: it.name || "Product",
        price: it.price || 0,
        qty: it.qty || 1
      })),
      total: total || subtotal || 0,
      shipping: shippingAddress || shipping,
      status: "pending"
    };

    if (isMongoConnected()) {
      const doc = await (OrderModel as any).create(orderData);
      return res.json(doc);
    } else {
      // In-memory fallback
      const doc = {
        _id: String(nextOrderId++),
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryOrders.push(doc);
      return res.json(doc);
    }
  } catch (err: any) {
    console.error('create order error:', err?.message || err);
    return res.status(500).json({
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'production' ? undefined : (err?.message || String(err))
    });
  }
});

// Get orders for current user
ordersRouter.get("/", requireUser, async (req, res) => {
  try {
    const userId = (req as any).user.sub as string;

    if (isMongoConnected()) {
      const orders = await (OrderModel as any).find({ userId }).sort({ createdAt: -1 }).lean();
      return res.json({ orders });
    } else {
      // In-memory fallback
      const orders = inMemoryOrders
        .filter((o: any) => o.userId === userId)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return res.json({ orders });
    }
  } catch (err) {
    console.error('list user orders error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: list all orders
ordersRouter.get("/admin/list", requireAdmin, async (_req, res) => {
  try {
    if (isMongoConnected()) {
      const orders = await (OrderModel as any).find().sort({ createdAt: -1 }).lean();
      return res.json({ orders });
    } else {
      // In-memory fallback
      const orders = [...inMemoryOrders].sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return res.json({ orders });
    }
  } catch (err) {
    console.error('admin list orders error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: update order status
ordersRouter.patch("/admin/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status, trackingInfo, estimatedDelivery } = req.body as any;
    const orderId = req.params.id;

    if (isMongoConnected()) {
      const update: any = {};
      if (status) update.status = status;
      if (trackingInfo) update.trackingInfo = trackingInfo;
      if (estimatedDelivery) update.estimatedDelivery = new Date(estimatedDelivery);
      const order = await (OrderModel as any).findByIdAndUpdate(orderId, update, { new: true }).lean();
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.json(order);
    } else {
      // In-memory fallback
      const orderIdx = inMemoryOrders.findIndex((o: any) => o._id === orderId);
      if (orderIdx === -1) return res.status(404).json({ message: 'Order not found' });

      if (status) inMemoryOrders[orderIdx].status = status;
      if (trackingInfo) inMemoryOrders[orderIdx].trackingInfo = trackingInfo;
      if (estimatedDelivery) inMemoryOrders[orderIdx].estimatedDelivery = new Date(estimatedDelivery);
      inMemoryOrders[orderIdx].updatedAt = new Date();

      return res.json(inMemoryOrders[orderIdx]);
    }
  } catch (err) {
    console.error('admin update order status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default ordersRouter;
