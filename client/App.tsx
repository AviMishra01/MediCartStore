import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import MyProfile from "./pages/MyProfile";

const queryClient = new QueryClient();

import Layout from "@/components/site/Layout";
import Products from "@/pages/Products";
import Placeholder from "@/components/site/Placeholder";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import RequireAdmin from "@/components/site/requireAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import Revenue from "./pages/Revenue";
import { CartProvider } from "@/context/CartContext";
import ProductDetail from "@/pages/ProductDetail";
import ProductManagement from "@/pages/ProductManagement";
import CartPage from "@/pages/Cart";
import Analytics from "@/pages/Analytics";
import CheckoutPage from "@/pages/Checkout";
import { AuthProvider } from "@/context/AuthContext";
import AdminReviews from "@/pages/AdminReviews";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                <Route path="/admin/users" element={<RequireAdmin><Users /></RequireAdmin>} />
                <Route path="/admin/products" element={<RequireAdmin><ProductManagement /></RequireAdmin>} />
                <Route path="/admin/reviews" element={<RequireAdmin><AdminReviews /></RequireAdmin>} />
                <Route path="/admin/analytics" element={<RequireAdmin><Analytics /></RequireAdmin>} />
                <Route path="/admin/revenue" element={<RequireAdmin><Revenue /></RequireAdmin>} />
                <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
                <Route path="/help" element={<Help />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/about" element={<About />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
