import React, { useEffect, useState } from "react";
import { MapPin, Package, Truck, CheckCircle, Clock, Edit2, Save, X } from "lucide-react";

export default function AdminOrders() {
  const token = localStorage.getItem("ADMIN_TOKEN");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [estimatedDate, setEstimatedDate] = useState("");

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/orders/admin/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (id: string, status: string, estimatedDelivery?: string) => {
    if (!token) return;
    try {
      const body: any = { status };
      if (estimatedDelivery) body.estimatedDelivery = new Date(estimatedDelivery);
      const res = await fetch(`/api/orders/admin/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        fetchOrders();
        setEditingId(null);
        setEstimatedDate("");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-gray-500" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "in_warehouse":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "out_for_delivery":
        return <Truck className="w-5 h-5 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-gray-600" },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-600" },
    { value: "in_warehouse", label: "In Warehouse", color: "bg-yellow-600" },
    { value: "shipped", label: "Shipped", color: "bg-blue-700" },
    { value: "out_for_delivery", label: "Out for Delivery", color: "bg-orange-600" },
    { value: "delivered", label: "Delivered", color: "bg-green-600" },
  ];

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
        <p className="text-gray-600 mt-1">Total Orders: {orders.length}</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <div className="text-gray-600">No orders yet.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === o._id ? null : o._id)}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(o.status)}
                      <div>
                        <div className="font-bold text-lg text-gray-900">Order #{o.orderNumber}</div>
                        <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      o.status === "delivered" ? "bg-green-600" :
                      o.status === "shipped" ? "bg-blue-600" :
                      o.status === "out_for_delivery" ? "bg-orange-600" :
                      o.status === "in_warehouse" ? "bg-yellow-600" :
                      o.status === "confirmed" ? "bg-blue-500" :
                      "bg-gray-500"
                    }`}>
                      {o.status.replaceAll("_", " ").toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === o._id && (
                <div className="p-6 space-y-6">
                  {/* Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      {o.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{it.name}</div>
                            <div className="text-sm text-gray-600">Qty: {it.qty}</div>
                          </div>
                          <div className="font-semibold text-gray-900">₹{(it.price * it.qty).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-2xl font-bold text-gray-900">₹{o.total.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {o.shipping && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Shipping Address
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-1">
                        <div className="font-semibold">{o.shipping.fullName} • {o.shipping.phone}</div>
                        {o.shipping.addressLine && <div>{o.shipping.addressLine}</div>}
                        <div>{o.shipping.municipality}, {o.shipping.city}</div>
                        <div>{o.shipping.province}, {o.shipping.postalCode}</div>
                      </div>
                    </div>
                  )}

                  {/* Status Update */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                    {editingId === o._id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {statusOptions.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateStatus(o._id, opt.value, estimatedDate)}
                              className={`px-3 py-2 rounded text-sm font-medium text-white transition ${opt.color} hover:opacity-90`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={estimatedDate}
                            onChange={(e) => setEstimatedDate(e.target.value)}
                            placeholder="Estimated Delivery"
                            className="flex-1 px-3 py-2 border rounded text-sm"
                          />
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-2 bg-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingId(o._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Status
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
