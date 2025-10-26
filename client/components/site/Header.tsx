import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  Search, Heart, Pill, Zap, HelpCircle, User as UserIcon, LogIn, LayoutDashboard, Menu, X, Info
} from 'lucide-react';
import SearchSuggestions from "./SearchSuggestions";

// --- START: Main Header Component ---
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
  const cartCount = useCart().count;

  useEffect(() => {
    setQ(params.get("search") ?? "");
  }, [params]);

  const RECENT_KEY = "recent_searches";

  const handleSearchSubmit = (searchText: string) => {
    if (!searchText.trim()) return;
    const usp = new URLSearchParams();
    usp.set("search", searchText.trim());
    navigate(`/products?${usp.toString()}`);
    setShowHeaderSuggestions(false);

    // Update recent searches
    try {
      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const next = [searchText, ...(Array.isArray(prev) ? prev.filter((r: string) => r !== searchText) : [])].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch { }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(q);
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
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur shadow-lg">
        <div className="container flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-max">
            <div className="h-8 w-8 rounded-md bg-primary/10 grid place-items-center">
              <span className="text-primary text-lg font-black">✚</span>
            </div>
            <span className="text-base font-extrabold tracking-tight text-gray-900">
              Medizo
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link to="/products" className={cn("hover:text-indigo-600 transition flex items-center gap-1")}>
              <Pill size={16} /> Shop
            </Link>
            <Link to="/orders" className={cn("hover:text-indigo-600 transition")}>Orders</Link>
            <Link to="/about" className={cn("hover:text-indigo-600 transition")}>About Us</Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold transition">
                <LayoutDashboard size={16} /> Admin Panel
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">

            {/* Mobile Search */}
            <button
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition"
              onClick={() => navigate('/products')}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Help & Cart Buttons */}
            <HelpButton />
            <CartButton count={cartCount} />

            {isAuthenticated ? (
              <Link
                to="/profile"
                aria-label="Profile"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition shadow-inner"
              >
                <UserIcon size={18} />
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 transition shadow-md gap-2">
                <LogIn size={18} /> Sign In
              </Link>
            )}

            {/* Hamburger for Mobile */}
            <button
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full">
            <nav className="flex flex-col p-4 gap-3 text-gray-700">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition">
                <Pill size={18} /> Shop
              </Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition">
                <Heart size={18} /> Orders
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition">
                <Info size={18} /> About Us
              </Link>
              <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition">
                <HelpCircle size={18} /> Support
              </Link>
              {isAdmin && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition font-semibold"><LayoutDashboard size={18} /> Admin Panel</Link>}
              {!isAuthenticated && <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-2 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition font-semibold"><LogIn size={18} /> Sign In / Register</Link>}
            </nav>
          </div>
        )}
      </header>

      <hr className="h-px bg-gray-200 border-0" />

      {/* Search & Quick Links Section */}
      <section className="w-full bg-indigo-50/70 text-gray-900 flex flex-col justify-center items-center py-12 md:py-16 border-b relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.1),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_60%)]" />

        <div className="container flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-center text-indigo-800">Your Health, Delivered.</h2>
          <p className="text-lg text-indigo-700/80 mb-8 text-center max-w-2xl">
            Find everything you need from a trusted online pharmacy.
          </p>

          {/* Search Form */}
          <form onSubmit={onSubmit} className="flex w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden">
            <div className="relative flex-1" ref={headerSearchRef}>
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for product names, brands, or symptoms..."
                className="h-16 w-full border-none bg-white pl-12 pr-4 text-base text-gray-900 outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 rounded-l-xl transition"
                onFocus={() => setShowHeaderSuggestions(true)}
              />
              {showHeaderSuggestions && (
                <SearchSuggestions
                  query={q}
                  visible={showHeaderSuggestions}
                  onPick={(s) => handleSearchSubmit(s)}
                />
              )}
            </div>
            <button type="submit" className="h-16 bg-indigo-600 px-8 text-base font-bold text-white hover:bg-indigo-700 transition flex items-center gap-2 rounded-r-xl">
              <Search size={20} /> Search
            </button>
          </form>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mt-8">
            <FeatureLink icon={Pill} text="Prescription Refill" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200" to="/products?category=prescription" />
            <FeatureLink icon={Zap} text="Exclusive Offers" className="bg-green-100 text-green-700 hover:bg-green-200" to="/products?deals=true" />
            <FeatureLink icon={Heart} text="Health & Wellness" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200" to="/products?category=vitamins" />
            <FeatureLink icon={HelpCircle} text="Support Center" className="bg-gray-200 text-gray-700 hover:bg-gray-300" to="/help" />
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Helper Components ---
function FeatureLink({ icon: Icon, text, className, to }: { icon: any, text: string, className: string, to: string }) {
  return (
    <Link
      to={to}
      className={cn("p-3 rounded-xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-200 shadow-md", className)}
    >
      <Icon size={26} className="mb-1.5" />
      {text}
    </Link>
  );
}

function CartButton({ count }: { count: number }) {
  return (
    <Link
      to="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-indigo-50 transition"
    >
      <span role="img" aria-label="shopping cart" className="text-xl">🛒</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-lg">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

function HelpButton() {
  return (
    <Link to="/help" aria-label="Help Center" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-indigo-50 transition">
      <HelpCircle size={20} />
    </Link>
  );
}
