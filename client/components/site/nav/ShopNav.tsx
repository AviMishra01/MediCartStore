import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
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
    const usp = new URLSearchParams();
    usp.set("search", q.trim());
    navigate(`/products?${usp.toString()}`);
    setShowSuggestions(false);
    try {
      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const next = [q.trim(), ...(Array.isArray(prev) ? prev.filter((r: string) => r !== q.trim()) : [])].slice(0, 8);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm h-14">
      <div className="container flex items-center justify-between h-full px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 min-w-max">
          <div className="h-8 w-8 rounded-md bg-primary/10 grid place-items-center">
            <span className="text-primary text-lg font-black">✚</span>
          </div>
          <span className="text-base font-extrabold tracking-tight text-gray-900">Medizo</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative ml-4" ref={searchRef}>
          <form onSubmit={onSubmit} className="relative w-full">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search medicines, categories, brands..."
              className="h-9 w-full pl-8 pr-10 text-sm text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-gray-600 hover:text-gray-900"
            >
              <Search size={16} />
            </button>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 mt-1">
                <SearchSuggestions
                  query={q}
                  visible={showSuggestions}
                  onPick={(s) => {
                    if (!s) return;
                    setQ(s);
                    const usp = new URLSearchParams();
                    usp.set("search", s);
                    navigate(`/products?${usp.toString()}`);
                    try {
                      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
                      const next = [s, ...(Array.isArray(prev) ? prev.filter((r: string) => r !== s) : [])].slice(0, 8);
                      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
                    } catch {}
                    setShowSuggestions(false);
                  }}
                />
              </div>
            )}
          </form>
        </div>

        {/* Cart Button */}
        <CartButton />
      </div>
    </header>
  );
}

function CartButton() {
  const { count } = useCart();
  return (
    <Link to="/cart" className="relative ml-4 inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-sm hover:bg-accent transition">
      <span role="img" aria-label="shopping cart" className="text-xl">🛒</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
