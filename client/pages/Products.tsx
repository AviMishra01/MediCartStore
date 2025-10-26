import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Grid, List, Search, Filter, X, ShoppingCart, Star } from "lucide-react";
import axios from "axios";

// --- Cart Context (example, replace with your own if exists) ---
const CartContext = React.createContext({ addToCart: (item: any) => {} });

// --- Configuration & Utility ---
const INDIGO_COLOR = "indigo-600";
const INDIGO_RING = "focus:ring-indigo-500";
const ITEMS_PER_PAGE = 12;

// --- Product Card Component ---
const ProductCard = ({ _id, name, price, image, rating, onAddToCart, onClick }) => (
  <div
    onClick={onClick}
    className="border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white cursor-pointer overflow-hidden flex flex-col"
  >
    <img src={image} alt={name} className="w-full h-40 object-cover bg-gray-100" loading="lazy" />
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{name}</h3>
      <div className="flex items-center text-sm text-yellow-500 mb-3">
        <Star size={16} fill="currentColor" className="mr-1" />
        <span className="font-semibold">{rating?.toFixed(1) ?? "4.0"}</span>
      </div>
      <p className="mt-auto text-2xl font-extrabold text-indigo-700">₹{price.toFixed(0)}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onAddToCart({ _id, name, price, image }); }}
        className="w-full mt-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2"
      >
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </div>
  </div>
);

// --- Product List Item Component ---
const ProductListItem = ({ _id, name, price, image, rating, description, onAddToCart, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition duration-300 items-center cursor-pointer"
  >
    <img src={image} alt={name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-100" />
    <div className="flex-1">
      <h2 className="font-bold text-lg text-gray-900">{name}</h2>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
      <div className="flex items-center text-sm text-yellow-500 mt-2">
        <Star size={16} fill="currentColor" className="mr-1" />
        <span className="font-medium">{rating?.toFixed(1) ?? "4.0"}</span>
      </div>
    </div>
    <div className="flex flex-col items-start sm:items-end space-y-2 pt-2 sm:pt-0 w-full sm:w-auto">
      <p className="font-extrabold text-2xl text-indigo-700">₹{price.toFixed(0)}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onAddToCart({ _id, name, price, image }); }}
        className="w-full sm:w-36 px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2"
      >
        <ShoppingCart size={16} /> Add
      </button>
    </div>
  </div>
);

// --- Main Products Component ---
export default function Products() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [data, setData] = useState({ items: [], total: 0, categories: [] });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [sort, setSort] = useState("pop");
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    setSearch(initialSearch);
    setPage(1);
  }, [initialSearch]);

  // --- Convert sort option to actual backend params ---
  const sortParams = useMemo(() => {
    switch (sort) {
      case "price_asc": return { sortBy: "price", order: "asc" };
      case "price_desc": return { sortBy: "price", order: "desc" };
      case "name_asc": return { sortBy: "name", order: "asc" };
      case "pop":
      default: return { sortBy: "popularity", order: "desc" };
    }
  }, [sort]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products", {
        params: {
          search,
          category,
          maxPrice,
          page,
          limit: ITEMS_PER_PAGE,
          sortBy: sortParams.sortBy,
          order: sortParams.order
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setData({ items: [], total: 0, categories: [] });
    } finally {
      setLoading(false);
    }
  }, [search, category, maxPrice, page, sortParams]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totalPages = Math.ceil(data.total / ITEMS_PER_PAGE);
  const isFiltered = search || category || maxPrice < 5000;

  const clearFilters = () => {
    setSearch(""); setCategory(""); setMaxPrice(5000); setSort("pop"); setPage(1);
  };

  const handleMaxPriceChange = (e) => setMaxPrice(Number(e.target.value));

  const sortOptions = useMemo(() => [
    { v: "pop", l: "Most Popular" },
    { v: "price_asc", l: "Price: Low to High" },
    { v: "price_desc", l: "Price: High to Low" },
    { v: "name_asc", l: "Name: A to Z" },
  ], []);

  const handleProductClick = (id) => navigate(`/product/${id}`);
  const handleAddToCart = (item) => addToCart(item);

  return (
    <section className="container max-w-7xl mx-auto py-12 lg:py-16 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-gray-100 pb-4">
        <div>
          <h1 className={`text-4xl font-extrabold tracking-tight text-${INDIGO_COLOR}`}>The Health & Wellness Store</h1>
          <p className="mt-2 text-lg text-gray-500">Explore a wide range of quality medicines and health products.</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className={`h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm shadow-sm hover:border-${INDIGO_COLOR} focus:outline-none focus:ring-1 ${INDIGO_RING} appearance-none pr-8 transition`}
          >
            {sortOptions.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>

          <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => setViewMode("grid")} className={`p-2.5 transition ${viewMode === "grid" ? `bg-${INDIGO_COLOR} text-white shadow-inner` : "hover:bg-gray-100 text-gray-600"}`} title="Grid View"><Grid size={20} /></button>
            <button onClick={() => setViewMode("list")} className={`p-2.5 transition border-l border-gray-300 ${viewMode === "list" ? `bg-${INDIGO_COLOR} text-white shadow-inner` : "hover:bg-gray-100 text-gray-600"}`} title="List View"><List size={20} /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6 sticky top-24 self-start h-fit p-5 border border-gray-200 rounded-2xl bg-white shadow-xl">
          <h3 className={`flex items-center gap-2 text-xl font-extrabold text-${INDIGO_COLOR} border-b border-gray-100 pb-3`}><Filter size={24} /> Advanced Filters</h3>
          {isFiltered && (
            <button onClick={clearFilters} className="w-full h-10 flex items-center justify-center gap-1 text-sm font-semibold text-red-600 border border-red-300 rounded-xl bg-red-50 hover:bg-red-100 transition shadow-sm"><X size={16} /> Clear All Filters</button>
          )}

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Search Product</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="search" className={`h-10 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-2 ${INDIGO_RING} focus:border-indigo-500 shadow-sm transition`} placeholder="e.g., Paracetamol" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setPage(1)} />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <label className="text-sm font-bold text-gray-700 block mb-3">Max Price: <span className={`text-${INDIGO_COLOR}`}>₹{maxPrice.toFixed(0)}</span></label>
            <input type="range" min="0" max="5000" step="50" value={maxPrice} onChange={handleMaxPriceChange} onMouseUp={() => setPage(1)} onTouchEnd={() => setPage(1)} className={`w-full accent-${INDIGO_COLOR} cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none transition`} />
            <div className="flex justify-between text-xs text-gray-500 mt-1"><span>₹0</span><span>₹5000</span></div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="text-sm font-bold text-gray-700 block mb-3">Category</div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              <button onClick={() => setCategory("")} className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${!category ? `bg-${INDIGO_COLOR} text-white font-semibold shadow-md` : "hover:bg-indigo-50 text-gray-700"}`}>All Categories</button>
              {data.categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${category === c ? `bg-${INDIGO_COLOR} text-white font-semibold shadow-md` : "hover:bg-indigo-50 text-gray-700"}`}>{c}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product List */}
        <div className="space-y-8">
          <p className="text-sm font-medium text-gray-600 border-b border-gray-100 pb-2 mb-4">Showing {data.items.length} of {data.total} results</p>

          {loading ? (
            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <div key={i} className={`animate-pulse rounded-xl bg-gray-100/80 ${viewMode === "list" ? "h-32" : "h-72"}`} />)}
            </div>
          ) : data.items.length === 0 ? (
            <div className="text-center p-16 border border-gray-200 rounded-2xl bg-gray-50 shadow-inner mt-4">
              <Search size={48} className={`mx-auto text-${INDIGO_COLOR}/50 mb-4`} />
              <p className="text-xl text-gray-700 font-semibold">Oops! No products found.</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className={`mt-6 px-4 py-2 text-sm font-bold text-${INDIGO_COLOR} border border-${INDIGO_COLOR} rounded-full hover:bg-indigo-50 transition`}>
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p) => <ProductCard key={p._id} {...p} onAddToCart={handleAddToCart} onClick={() => handleProductClick(p._id)} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {data.items.map((p) => <ProductListItem key={p._id} {...p} onAddToCart={handleAddToCart} onClick={() => handleProductClick(p._id)} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10 flex-wrap">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition font-medium">&larr; Previous</button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button key={idx + 1} onClick={() => setPage(idx + 1)} className={`w-10 h-10 rounded-xl font-bold transition ${idx + 1 === page ? `bg-${INDIGO_COLOR} text-white border-2 border-indigo-700 shadow-md` : "hover:bg-indigo-50 border border-gray-200 text-gray-700"}`}>{idx + 1}</button>
              ))}
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition font-medium">Next &rarr;</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
