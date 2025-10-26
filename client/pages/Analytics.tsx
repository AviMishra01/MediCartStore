// pages/Analytics.tsx
import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  productsByCategory: Record<string, number>;
  ordersByMonth: Record<string, number>;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("ADMIN_TOKEN");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return alert("No admin token found!");
      setLoading(true);

      try {
        const baseUrl = "http://localhost:5000"; // replace with your backend URL
        const [productsRes, ordersRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/products`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        // Check for non-JSON response
        if (!productsRes.ok || !ordersRes.ok) {
          throw new Error("Failed to fetch analytics data. Check your API or token.");
        }

        const contentType1 = productsRes.headers.get("content-type");
        const contentType2 = ordersRes.headers.get("content-type");

        if (!contentType1?.includes("application/json") || !contentType2?.includes("application/json")) {
          throw new Error("API returned non-JSON data. Probably hitting frontend route.");
        }

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        const totalProducts = productsData.total || productsData.items?.length || 0;
        const totalOrders = ordersData.total || ordersData.items?.length || 0;
        const totalRevenue =
          ordersData.items?.reduce((sum: number, order: any) => (order.status === "completed" ? sum + order.totalAmount : sum), 0) || 0;

        // Products by category
        const productsByCategory: Record<string, number> = {};
        (productsData.items || []).forEach((p: any) => {
          const cat = p.category || "Uncategorized";
          productsByCategory[cat] = (productsByCategory[cat] || 0) + 1;
        });

        // Orders by month
        const ordersByMonth: Record<string, number> = {};
        (ordersData.items || []).forEach((order: any) => {
          const month = new Date(order.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
          ordersByMonth[month] = (ordersByMonth[month] || 0) + 1;
        });

        setData({ totalProducts, totalOrders, totalRevenue, productsByCategory, ordersByMonth });
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Error fetching analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading || !data)
    return (
      <div className="p-6 text-center text-gray-600">
        <div className="inline-block h-12 w-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4">Loading analytics...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Analytics Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center hover:scale-105 transform transition">
          <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{data.totalProducts}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center hover:scale-105 transform transition">
          <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{data.totalOrders}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg flex flex-col items-center hover:scale-105 transform transition">
          <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">₹{data.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products by Category */}
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
          <Pie
            data={{
              labels: Object.keys(data.productsByCategory),
              datasets: [
                {
                  data: Object.values(data.productsByCategory),
                  backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#f43f5e"],
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
          />
        </div>

        {/* Orders by Month */}
        <div className="p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Orders by Month</h3>
          <Bar
            data={{
              labels: Object.keys(data.ordersByMonth),
              datasets: [
                {
                  label: "Orders",
                  data: Object.values(data.ordersByMonth),
                  backgroundColor: "#3b82f6",
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
