import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/site/AdminSidebar";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface RevenueData { date: string; revenue: number; }
interface OrdersData { date: string; orders: number; }
interface UserData { status: string; count: number; }

export default function AdminDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersData[]>([]);
  const [userStatusData, setUserStatusData] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch real API data
  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("ADMIN_TOKEN");
      if (!token) return;

      try {
        // Fetch orders
        const ordersRes = await fetch("/api/orders/admin/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();
        const orders = ordersData.orders || [];

        // Calculate metrics from actual orders
        let totalRev = 0;
        const revByDate: Record<string, number> = {};
        const ordersByDate: Record<string, number> = {};

        orders.forEach((order: any) => {
          totalRev += order.total || 0;
          const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          revByDate[dateStr] = (revByDate[dateStr] || 0) + (order.total || 0);
          ordersByDate[dateStr] = (ordersByDate[dateStr] || 0) + 1;
        });

        // Convert to chart data (last 7 days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          last7Days.push({
            date: dateStr,
            revenue: revByDate[dateStr] || 0,
            orders: ordersByDate[dateStr] || 0,
          });
        }

        setRevenueData(last7Days);
        setOrdersData(last7Days);
        setTotalOrders(orders.length);
        setTotalRevenue(totalRev);
        setTotalProducts(80); // Keep static if no product endpoint
        setUserStatusData([
          { status: "Active", count: 120 },
          { status: "Inactive", count: 30 },
        ]);
        setTotalUsers(150);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    };

    fetchMetrics();
  }, []);

  const COLORS = ["#10b981", "#f87171"]; // Active: green, Inactive: red

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 bg-gray-50 space-y-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center hover:scale-105 transform transition">
              <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{totalUsers}</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center hover:scale-105 transform transition">
              <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">{totalProducts}</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center hover:scale-105 transform transition">
              <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{totalOrders}</p>
            </div>
            <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center hover:scale-105 transform transition">
              <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Line Chart */}
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Revenue (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Bar Chart */}
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Orders (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Users Status Pie Chart */}
            <div className="p-6 bg-white shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Users Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {userStatusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Nested Admin Pages */}
          <div className="bg-white shadow rounded p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
