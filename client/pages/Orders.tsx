import React, { useEffect, useState } from "react";
import { MapPin, Package, Truck, CheckCircle, Clock, XCircle, Box, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

// Helper function to format status string
const formatStatus = (status: string) => status.replaceAll("_", " ").toUpperCase();

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("auth_token");

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
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

  // --- Status Mapping Logic ---
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "in_warehouse":
        return <Package className="w-5 h-5" />;
      case "shipped":
      case "out_for_delivery":
        return <Truck className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "delivered":
        return { container: "bg-green-50 border-green-300", iconText: "text-green-800 bg-green-200" };
      case "out_for_delivery":
        return { container: "bg-indigo-50 border-indigo-300", iconText: "text-indigo-800 bg-indigo-200" };
      case "shipped":
        return { container: "bg-blue-50 border-blue-300", iconText: "text-blue-800 bg-blue-200" };
      case "confirmed":
      case "in_warehouse":
        return { container: "bg-yellow-50 border-yellow-300", iconText: "text-yellow-800 bg-yellow-200" };
      case "cancelled":
        return { container: "bg-red-50 border-red-300", iconText: "text-red-800 bg-red-200" };
      default:
        return { container: "bg-gray-50 border-gray-300", iconText: "text-gray-800 bg-gray-200" };
    }
  };
  // --- End Status Mapping Logic ---

  return (
    <div className="container py-16 min-h-[70vh]">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-4xl font-extrabold text-indigo-900 border-b pb-4">Order History</h2>

        {loading ? (
          <div className="text-center py-20 text-indigo-500">
            <Clock className="w-8 h-8 mx-auto mb-3 animate-spin" />
            <p className="text-lg">Loading your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-lg">
            <Box className="w-16 h-16 mx-auto text-indigo-400 mb-5" />
            <div className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</div>
            <p className="text-gray-500 max-w-sm mx-auto">
              Looks like you haven't placed any orders yet. Start shopping now!
            </p>
            <Link to="/products" className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-700 transition shadow-md">
              Explore Medicines 💊
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((o) => {
              const { container, iconText } = getStatusStyles(o.status);
              return (
                <div key={o._id} className={`border rounded-xl p-6 shadow-xl transition duration-300 ${container}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-200/50 pb-4">

                    {/* Order ID & Date */}
                    <div>
                      <div className="font-extrabold text-xl text-indigo-900 mb-1">
                        Order <span className="text-indigo-600">#{o.orderNumber}</span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        Placed on: {new Date(o.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 mt-3 sm:mt-0 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-md ${iconText}`}>
                      {getStatusIcon(o.status)}
                      {formatStatus(o.status)}
                    </div>
                  </div>

                  {/* Item List and Shipping Address Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Item List */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-lg p-4 shadow-inner border border-gray-100">
                        <div className="text-base font-bold text-gray-800 mb-3 border-b pb-2">Items Purchased:</div>
                        <div className="space-y-2">
                          {o.items.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-700 truncate max-w-[70%]">{it.name} <span className="font-medium text-gray-500">× {it.qty}</span></span>
                              <span className="font-bold text-gray-900">₹{(it.price * it.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {o.shipping && (
                      <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-4 shadow-inner border border-gray-100 h-full">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                            <div className="text-sm">
                              <div className="font-bold text-gray-800 mb-1">Delivery Address:</div>
                              <div className="text-gray-600 leading-snug space-y-0.5">
                                <div><strong>{o.shipping.fullName}</strong></div>
                                <div>{o.shipping.addressLine}</div>
                                <div>{o.shipping.municipality}, {o.shipping.province}</div>
                                <div className="text-xs text-gray-500 mt-1">Phone: {o.shipping.phone}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Total and Action Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200/50 mt-4">
                    <div>
                      <div className="text-base text-gray-600 font-medium">Order Total</div>
                      <div className="text-2xl font-extrabold text-indigo-700">₹{o.total.toFixed(2)}</div>
                    </div>

                    <div className="text-right">
                      {o.estimatedDelivery && o.status !== 'delivered' && (
                        <div className="mb-2">
                          <div className="text-xs font-medium text-gray-600">Expected Delivery Date</div>
                          <div className="text-lg font-bold text-gray-900">
                            {new Date(o.estimatedDelivery).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      <button className="bg-indigo-600 text-white text-sm font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition shadow-md">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
