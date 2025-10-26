import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { DollarSign, Package, Truck, ShoppingCart } from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number; // Total paid (products + shipping)
  status: "pending" | "confirmed" | "in_warehouse" | "shipped" | "out_for_delivery" | "delivered" | "canceled";
  createdAt: string;
  shipping: { fullName: string };
  shippingCharge?: number;
}

interface DailyData {
  date: string;
  revenue: number;
  orders: number;
}

// --- Charts ---
const RevenueLineChart: React.FC<{ data: DailyData[] }> = ({ data }) => (
  <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Revenue Trend (Last 7 Days)</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" stroke="#6b7280" />
        <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} stroke="#6b7280" />
        <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]} />
        <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ stroke: '#10B981', strokeWidth: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const OrdersBarChart: React.FC<{ data: DailyData[] }> = ({ data }) => (
  <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">Orders Per Day (Last 7 Days)</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis dataKey="date" stroke="#6b7280" />
        <YAxis allowDecimals={false} stroke="#6b7280" />
        <Tooltip formatter={(value: number) => [value.toLocaleString(), "Orders"]} />
        <Legend />
        <Bar dataKey="orders" fill="#3B82F6" name="Total Orders" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// --- Revenue Page ---
export default function Revenue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsRevenue, setProductsRevenue] = useState(0);
  const [shippingRevenue, setShippingRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);

  const token = localStorage.getItem("ADMIN_TOKEN");

  const fetchData = async () => {
    if (!token) return setLoading(false);
    setLoading(true);

    try {
      const res = await fetch("/api/orders/admin/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const deliveredOrders: Order[] = (data.orders || []).filter(o => o.status === "delivered");
      setOrders(deliveredOrders);

      // --- Revenue Calculation ---
      let productsRev = 0;
      let shippingRev = 0;
      let totalRev = 0;

      deliveredOrders.forEach(order => {
        const itemsTotal = order.items.reduce((sum, it) => sum + it.price * it.qty, 0);
        const shipping = order.shippingCharge ?? (order.total - itemsTotal);
        productsRev += itemsTotal;
        shippingRev += shipping;
        totalRev += order.total;
      });

      setProductsRevenue(productsRev);
      setShippingRevenue(shippingRev);
      setTotalRevenue(totalRev);

      // --- Last 7 Days Data ---
      const dataByDate: Record<string, { revenue: number; orders: number }> = {};
      deliveredOrders.forEach(order => {
        const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (!dataByDate[dateStr]) dataByDate[dateStr] = { revenue: 0, orders: 0 };
        dataByDate[dateStr].revenue += order.total;
        dataByDate[dateStr].orders += 1;
      });

      const last7Days: DailyData[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        last7Days.push({ 
          date: dateStr, 
          revenue: dataByDate[dateStr]?.revenue || 0, 
          orders: dataByDate[dateStr]?.orders || 0 
        });
      }
      setDailyData(last7Days);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const RevenueCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between transition hover:shadow-xl">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{typeof value === "number" ? `₹${value.toLocaleString()}` : value}</p>
      </div>
      <div className={`p-3 rounded-full bg-${color.replace("text-", "").replace("-600","-100")}`}>
        {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${color}` })}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-12 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-3">Revenue Dashboard 📊</h1>

      {loading ? (
        <p className="text-center text-xl p-10 text-gray-500">Loading revenue data...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <RevenueCard title="Total Revenue" value={totalRevenue} icon={<DollarSign />} color="text-green-600" />
            <RevenueCard title="Product Sales" value={productsRevenue} icon={<Package />} color="text-indigo-600" />
            <RevenueCard title="Shipping Income" value={shippingRevenue} icon={<Truck />} color="text-blue-600" />
            <RevenueCard title="Delivered Orders" value={orders.length} icon={<ShoppingCart />} color="text-pink-600" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueLineChart data={dailyData} />
            <OrdersBarChart data={dailyData} />
          </div>

          {/* Orders Table */}
          <div className="pt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Delivered Orders Log</h2>
            <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order #</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Products Rev.</th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Shipping Rev.</th>
                    <th className="p-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">TOTAL PAID</th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map(order => {
                    const itemsTotal = order.items.reduce((sum, it) => sum + it.price * it.qty, 0);
                    const shipping = order.shippingCharge ?? (order.total - itemsTotal);
                    return (
                      <tr key={order._id} className="hover:bg-indigo-50/50 transition duration-150">
                        <td className="p-4 font-semibold text-blue-600">{order.orderNumber}</td>
                        <td className="p-4 text-gray-700">{order.shipping.fullName}</td>
                        <td className="p-4 text-right text-gray-700">₹{itemsTotal.toLocaleString()}</td>
                        <td className="p-4 text-right text-gray-700">₹{shipping.toLocaleString()}</td>
                        <td className="p-4 text-right font-bold text-green-600">₹{order.total.toLocaleString()}</td>
                        <td className="p-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    )
                  })}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-6 text-gray-500 italic">
                        No delivered orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
