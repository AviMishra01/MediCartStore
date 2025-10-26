import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search, Heart, Pill, Zap, HelpCircle, User as UserIcon, LogIn, LayoutDashboard, Menu, X
} from 'lucide-react';
import SearchSuggestions from "./SearchSuggestions";

export default function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("search") ?? "");
  const [showHeaderSuggestions, setShowHeaderSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerSearchRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();
  const isAuthenticated = !!user;
  const isAdmin = false;

  useEffect(() => {
    setQ(params.get("search") ?? "");
  }, [params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usp = new URLSearchParams(window.location.search);
    if (q) usp.set("search", q); else usp.delete("search");
    navigate(`/products?${usp.toString()}`);
  };

  // Close suggestions on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = headerSearchRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setShowHeaderSuggestions(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="w-full">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
        <div className="container flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-max">
            <div className="h-9 w-9 rounded-md bg-green-100 grid place-items-center">
              <span className="text-green-600 text-xl font-black">✚</span>
            </div>
            <span className="text-lg font-extrabold text-gray-900">Medizo</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/products" className={cn("hover:text-green-600 transition")}>Shop</Link>
            <Link to="/orders" className={cn("hover:text-green-600 transition")}>Orders</Link>
            <Link to="/about" className={cn("hover:text-green-600 transition")}>About Us</Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold transition">
                <LayoutDashboard size={16} /> Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <HelpButton />
            <CartButton count={useCart().count} />

            {isAuthenticated ? (
              <Link
                to="/profile"
                aria-label="Profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-green-50 transition"
              >
                <UserIcon size={18} />
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-green-50 transition gap-2">
                <LogIn size={18} /> Sign In
              </Link>
            )}

            {/* Hamburger for Mobile */}
            <button
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-200 bg-white hover:bg-green-50 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-md">
            <nav className="flex flex-col p-4 gap-4 text-gray-700">
              <Link to="/products" className="hover:text-green-600 transition">Shop</Link>
              <Link to="/orders" className="hover:text-green-600 transition">Orders</Link>
              <Link to="/about" className="hover:text-green-600 transition">About Us</Link>
              {isAdmin && <Link to="/admin" className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold transition"><LayoutDashboard size={16} /> Admin</Link>}
              {!isAuthenticated && <Link to="/login" className="flex items-center gap-2 hover:text-green-600 transition"><LogIn size={16} /> Sign In</Link>}
            </nav>
          </div>
        )}
      </header>

      {/* Search & Quick Links */}
      <section className="w-full bg-green-50 text-gray-900 flex flex-col justify-center items-center py-12 md:py-16 border-b relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.05),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(5,150,105,0.05),transparent_60%)]" />

        <div className="container flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-center text-green-800">Find Your Medicine Quickly</h2>
          <p className="text-lg text-green-700/80 mb-6 text-center max-w-2xl">
            Search thousands of products with doorstep delivery and exclusive offers.
          </p>

          <form onSubmit={onSubmit} className="flex w-full max-w-4xl shadow-lg rounded-xl overflow-hidden">
            <div className="relative flex-1" ref={headerSearchRef}>
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for product names, brands, or symptoms..."
                className="h-14 w-full border-none bg-white pl-12 pr-4 text-base text-gray-900 outline-none focus-visible:ring-4 focus-visible:ring-green-200 rounded-xl"
                onFocus={() => setShowHeaderSuggestions(true)}
              />
              {showHeaderSuggestions && (
                <SearchSuggestions
                  query={q}
                  visible={showHeaderSuggestions}
                  onPick={(s) => {
                    const usp = new URLSearchParams(window.location.search);
                    if (s) usp.set("search", s); else usp.delete("search");
                    navigate(`/products?${usp.toString()}`);
                    setShowHeaderSuggestions(false);
                    try {
                      const RECENT_KEY = "recent_searches";
                      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
                      const next = [s, ...(Array.isArray(prev) ? prev.filter((r: string) => r !== s) : [])].slice(0,8);
                      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
                    } catch {}
                  }}
                />
              )}
            </div>
            <button type="submit" className="h-14 bg-green-600 px-8 text-base font-bold text-white hover:bg-green-700 transition flex items-center gap-2">
              <Search size={20} /> Search
            </button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mt-6">
            <FeatureLink icon={Pill} text="Prescription Refill" className="bg-green-100 text-green-700 hover:bg-green-200" to="/products?category=prescription" />
            <FeatureLink icon={Zap} text="Super Fast Shipping" className="bg-green-100 text-green-700 hover:bg-green-200" to="/about#delivery" />
            <FeatureLink icon={Heart} text="Health & Wellness" className="bg-green-100 text-green-700 hover:bg-green-200" to="/products?category=vitamins" />
            <FeatureLink icon={HelpCircle} text="Support Center" className="bg-green-100 text-green-700 hover:bg-green-200" to="/help" />
          </div>
        </div>
      </section>
    </div>
  );
}

// Quick link component
function FeatureLink({ icon: Icon, text, className, to }) {
  return (
    <Link
      to={to}
      className={cn("p-3 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all duration-200", className)}
    >
      <Icon size={24} className="mb-1" />
      {text}
    </Link>
  );
}

// Cart button
function CartButton({ count }) {
  return (
    <Link to="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-green-50 transition">
      <span role="img" aria-label="shopping cart" className="text-xl">🛒</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

// Help button
function HelpButton() {
  return (
    <Link to="/help" aria-label="Help Center" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-green-50 transition">
      <HelpCircle size={20} />
    </Link>
  );
}
