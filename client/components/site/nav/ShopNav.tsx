import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Search, ShoppingCart, User } from "lucide-react"; // Added User icon
import { useCart } from "@/context/CartContext";
import SearchSuggestions from "@/components/site/SearchSuggestions";

export default function ShopNav() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("search") ?? "");

  useEffect(() => setQ(params.get("search") ?? ""), [params]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const RECENT_KEY = "recent_searches";

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (searchRef.current && e.target instanceof Node && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;

    const query = q.trim();
    const usp = new URLSearchParams();
    usp.set("search", query);
    navigate(`/products?${usp.toString()}`);
    setShowSuggestions(false);

    try {
      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const next = [query, ...(Array.isArray(prev) ? prev.filter((r: string) => r !== query) : [])].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch (error) {
      console.error("Failed to update recent searches:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur shadow-md h-16">
      <div className="container flex items-center justify-between h-full px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 min-w-max">
          <div className="h-8 w-8 rounded-md bg-primary/10 grid place-items-center">
            <span className="text-primary text-lg font-black">✚</span>
          </div>
          <span className="text-base font-extrabold tracking-tight text-gray-900">Medizo</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-2xl relative mx-8" ref={searchRef}>
          <form onSubmit={onSubmit} className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for health products or symptoms..."
              className="h-10 w-full pl-10 pr-10 text-sm text-gray-800 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 shadow-sm"
              onFocus={() => setShowSuggestions(true)}
              type="search"
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-10 flex items-center justify-center text-indigo-600 hover:text-indigo-800 focus:outline-none"
            >
              <Search size={18} className="opacity-0" aria-hidden="true" />
            </button>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 mt-2 overflow-hidden">
                <SearchSuggestions
                  query={q}
                  visible={showSuggestions}
                  onPick={(s) => {
                    if (!s) return;
                    setQ(s);

                    const usp = new URLSearchParams();
                    usp.set("search", s);
                    navigate(`/products?${usp.toString()}`);
                    setShowSuggestions(false);

                    try {
                      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
                      const next = [s, ...(Array.isArray(prev) ? prev.filter((r: string) => r !== s) : [])].slice(0, 8);
                      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                />
              </div>
            )}
          </form>
        </div>

        {/* Cart + Profile */}
        <div className="flex items-center gap-4">
          <CartButton />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
}

function CartButton() {
  const { count } = useCart();
  return (
    <Link
      to="/cart"
      className="relative h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
      title="View Cart"
    >
      <ShoppingCart size={22} className="text-gray-700 hover:text-indigo-600 transition-colors" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white shadow-lg border border-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

function ProfileButton() {
  return (
    <Link
      to="/profile"
      className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
      title="Profile"
    >
      <User size={20} className="text-gray-700 hover:text-indigo-600 transition-colors" />
    </Link>
  );
}
