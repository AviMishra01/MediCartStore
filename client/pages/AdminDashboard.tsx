import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
// Assuming AdminSidebar path is correct, Restoring the sidebar import
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
// Importing icons for the stats cards
import { Users, Package, ShoppingCart, DollarSign, Activity, AlertCircle } from "lucide-react";

// --- INTERFACES & COMPONENTS ---

interface RevenueData { date: string; revenue: number; }
interface OrdersData { date: string; orders: number; }
interface UserData { status: string; count: number; }

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="p-5 bg-white shadow-lg rounded-xl flex items-center justify-between transition duration-300 hover:ring-2 hover:ring-offset-2" style={{ borderColor: color.split('-')[1], ringColor: color }}>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {/* Updated to display '₹' symbol directly */}
      <p className={`mt-1 text-4xl font-extrabold ${color}`}>{value}</p>
    </div>
    <div className={`p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: color.replace('text-', '').replace('600', '100') }}>
      {/* Keeping DollarSign icon for generic currency representation, as lucide-react doesn't widely support Rupee yet. The value string handles the correct symbol. */}
      {React.cloneElement(icon as React.ReactElement, { className: `w-8 h-8 ${color}` })}
    </div>
  </div>
);

// --- MAIN COMPONENT: AdminDashboard ---

export default function AdminDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersData[]>([]);
  const [userStatusData, setUserStatusData] = useState<UserData[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("ADMIN_TOKEN");
      if (!token) return setIsLoading(false);

      try {
        // --- Fetch Orders (and calculate revenue) ---
        const ordersRes = await fetch("/api/orders/admin/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersDataJson = await ordersRes.json();
        const orders = ordersDataJson.orders || [];

        let totalRev = 0;
        const revByDate: Record<string, number> = {};
        const ordersByDate: Record<string, number> = {};

        orders.forEach((order: any) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

          ordersByDate[dateStr] = (ordersByDate[dateStr] || 0) + 1;

          if (order.status === "delivered") {
            totalRev += order.total || 0;
            revByDate[dateStr] = (revByDate[dateStr] || 0) + (order.total || 0);
          }
        });

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

        // --- Fetch Users ---
        const usersRes = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersDataJson = await usersRes.json();
        const users = usersDataJson.users || [];
        setTotalUsers(users.length);

        const activeCount = users.filter((u: any) => u.lastLogin).length;
        const inactiveCount = users.length - activeCount;

        setUserStatusData([
          { status: "Active", count: activeCount },
          { status: "Inactive", count: inactiveCount },
        ]);

        // --- Fetch Products ---
        const productsRes = await fetch("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productsData = await productsRes.json();
        const products = productsData.items || [];
        setTotalProducts(products.length);

      } catch (err) {
        console.error("Error fetching metrics:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const PIE_COLORS = ["#10b981", "#ef4444"]; // Active: green-500, Inactive: red-500

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="text-xl font-medium text-gray-600 animate-pulse">Loading Dashboard Metrics...</div>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* RESTORED: AdminSidebar is now included */}
        <AdminSidebar /> 

        <main className="flex-1 p-6 md:p-10 bg-gray-50 space-y-10">
          <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-2">Business Overview 🚀</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue (Delivered)"
              // Updated to use the Rupee symbol '₹'
              value={`₹${totalRevenue.toLocaleString()}`}
              icon={<DollarSign />}
              color="text-green-600"
            />
            <StatCard
              title="Total Orders (All Status)"
              value={totalOrders}
              icon={<ShoppingCart />}
              color="text-indigo-600"
            />
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={<Users />}
              color="text-blue-600"
            />
            <StatCard
              title="Total Products"
              value={totalProducts}
              icon={<Package />}
              color="text-purple-600"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Chart */}
            <div className="lg:col-span-2 p-6 bg-white shadow-xl rounded-xl border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Revenue Trend (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  {/* Updated YAxis formatter to show in '₹k' */}
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} stroke="#6b7280" />
                  <Tooltip 
                    // Updated Tooltip formatter to use the Rupee symbol '₹'
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]} 
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ stroke: '#22c55e', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User Status Pie Chart */}
            <div className="p-6 bg-white shadow-xl rounded-xl border border-gray-100 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">User Activity Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStatusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {userStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string, props) => [value, props.payload.status]} />
                  <Legend verticalAlign="bottom" align="center" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Orders Chart */}
            <div className="p-6 bg-white shadow-xl rounded-xl border border-gray-100 lg:col-span-3">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Orders Volume (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis allowDecimals={false} stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), "Total Orders"]} 
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#3b82f6" name="Orders Placed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Router Outlet for nested routes (e.g., individual order details) */}
          <div className="bg-white shadow-xl rounded-xl p-4 md:p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Area</h2>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}