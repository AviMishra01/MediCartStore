import React, { useEffect, useState } from "react";
import { MapPin, Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("auth_token");

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/orders", {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 border-green-200";
      case "shipped":
        return "bg-blue-50 border-blue-200";
      case "out_for_delivery":
        return "bg-orange-50 border-orange-200";
      case "in_warehouse":
        return "bg-yellow-50 border-yellow-200";
      case "confirmed":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">Your Orders</h2>

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
              <div key={o._id} className={`border rounded-lg p-6 shadow-sm ${getStatusColor(o.status)}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(o.status)}
                      <div>
                        <div className="font-semibold text-lg text-gray-900">
                          Order #{o.orderNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(o.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">Status</div>
                    <div className={`text-sm font-bold ${
                      o.status === "delivered"
                        ? "text-green-600"
                        : o.status === "shipped"
                        ? "text-blue-600"
                        : o.status === "out_for_delivery"
                        ? "text-orange-600"
                        : o.status === "in_warehouse"
                        ? "text-yellow-600"
                        : o.status === "confirmed"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}>
                      {o.status.replaceAll("_", " ").toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded p-3 mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Items:</div>
                  <div className="space-y-2">
                    {o.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{it.name} × {it.qty}</span>
                        <span className="font-semibold text-gray-900">₹{(it.price * it.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {o.shipping && (
                  <div className="bg-white rounded p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-semibold text-gray-700 mb-1">Shipping Address:</div>
                        <div className="text-gray-600 space-y-0.5">
                          <div>{o.shipping.fullName} • {o.shipping.phone}</div>
                          {o.shipping.addressLine && <div>{o.shipping.addressLine}</div>}
                          <div>{o.shipping.municipality}, {o.shipping.city}, {o.shipping.province}</div>
                          {o.shipping.postalCode && <div>Postal Code: {o.shipping.postalCode}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total and Delivery */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-xl font-bold text-gray-900">₹{o.total.toFixed(2)}</div>
                  </div>
                  {o.estimatedDelivery && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Estimated Delivery</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(o.estimatedDelivery).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
