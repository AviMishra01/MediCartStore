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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("ADMIN_TOKEN");

  useEffect(() => {
    const fetchJSON = async (url: string) => {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const contentType = res.headers.get("content-type");
      if (!res.ok) throw new Error(`${url} returned status ${res.status}`);
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`${url} did not return JSON. Got ${contentType}`);
      }
      return res.json();
    };

    const fetchAnalytics = async () => {
      if (!token) {
        setError("No admin token found!");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Replace with correct backend URL if needed
        const baseUrl = "http://localhost:5000";

        const [productsData, ordersData] = await Promise.all([
          fetchJSON(`${baseUrl}/api/admin/products`),
          fetchJSON(`${baseUrl}/api/admin/orders`),
        ]);

        const totalProducts = productsData.total ?? productsData.items?.length ?? 0;
        const totalOrders = ordersData.total ?? ordersData.items?.length ?? 0;

        const totalRevenue =
          ordersData.items?.reduce(
            (sum: number, order: any) => (order.status === "completed" ? sum + order.total : sum),
            0
          ) ?? 0;

        const productsByCategory: Record<string, number> = {};
        (productsData.items ?? []).forEach((p: any) => {
          const cat = p.category ?? "Uncategorized";
          productsByCategory[cat] = (productsByCategory[cat] ?? 0) + 1;
        });

        const ordersByMonth: Record<string, number> = {};
        (ordersData.items ?? []).forEach((order: any) => {
          const month = new Date(order.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
          ordersByMonth[month] = (ordersByMonth[month] ?? 0) + 1;
        });

        setData({ totalProducts, totalOrders, totalRevenue, productsByCategory, ordersByMonth });
      } catch (err: any) {
        console.error("Analytics fetch error:", err);
        setError(err.message || "Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">
        <div className="inline-block h-12 w-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4">Loading analytics...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        <p className="text-lg font-semibold">Error: {error}</p>
        <p>Please check your backend URL or API token.</p>
      </div>
    );

  if (!data) return null;

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
