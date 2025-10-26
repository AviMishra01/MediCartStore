import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  user: string;
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function Revenue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const token = localStorage.getItem("ADMIN_TOKEN");

  const fetchRevenueData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch orders
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);

      // Calculate total revenue
      const revenue = (data.orders || []).reduce(
        (acc: number, order: Order) =>
          order.status === "completed" ? acc + order.totalAmount : acc,
        0
      );
      setTotalRevenue(revenue);

      // Fetch users
      const usersRes = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersRes.json();
      setUsers(usersData.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Revenue Dashboard</h2>

      {loading ? (
        <p className="text-gray-500">Loading revenue data...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-100 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-sm font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-sm font-semibold text-gray-700">Total Orders</h3>
              <p className="text-2xl font-bold text-blue-700">{orders.length}</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-sm font-semibold text-gray-700">Total Users</h3>
              <p className="text-2xl font-bold text-yellow-700">{users.length}</p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-gray-100 text-left text-gray-700">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{order._id.slice(-6)}</td>
                    <td className="p-4 text-gray-600">{order.user}</td>
                    <td className="p-4 text-gray-600">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === "completed"
                            ? "bg-green-500 text-white"
                            : order.status === "pending"
                            ? "bg-yellow-400 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-6 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
