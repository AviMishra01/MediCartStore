import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UsersIcon,
  CubeIcon,
  StarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const links = [
  { name: "Users", path: "/admin/users", icon: <UsersIcon className="h-5 w-5" /> },
  { name: "Products", path: "/admin/products", icon: <CubeIcon className="h-5 w-5" /> },
  { name: "Reviews", path: "/admin/reviews", icon: <StarIcon className="h-5 w-5" /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCartIcon className="h-5 w-5" /> },
  { name: "Revenue", path: "/admin/revenue", icon: <CurrencyDollarIcon className="h-5 w-5" /> },
  { name: "Analytics", path: "/admin/analytics", icon: <ChartBarIcon className="h-5 w-5" /> },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("ADMIN_TOKEN");
    localStorage.removeItem("adminData");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between min-h-screen">
      {/* Logo */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-indigo-600">Admin Panel</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 p-2 rounded-lg transition ${
                active
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-4 flex items-center justify-center gap-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Logout
      </button>
    </aside>
  );
}
