import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Grid, List, Search, Filter, X } from "lucide-react";

// Utility to call backend API
const apiGet = async (url: string, params: Record<string, any>) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${url}?${query}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

// Product Card Component
const ProductCard = ({ _id, name, price, image, rating }) => (
  <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white cursor-pointer overflow-hidden">
    <img src={image} alt={name} className="w-full h-40 object-cover" loading="lazy" />
    <div className="p-3">
      <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
      <p className="text-sm text-yellow-500 mt-1">⭐ {rating?.toFixed(1) ?? "4.0"}</p>
      <p className="mt-2 text-xl font-bold text-primary">₹{price.toFixed(0)}</p>
      <button className="w-full mt-3 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition shadow-sm">
        Add to Cart
      </button>
    </div>
  </div>
);

export default function Products() {
  const [data, setData] = useState({ items: [], total: 0, categories: [] });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [sort, setSort] = useState("pop");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const ITEMS_PER_PAGE = 20;

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiGet("/api/products", {
        search,
        category,
        maxPrice,
        sort,
        page,
        limit: ITEMS_PER_PAGE,
      });
      // sort manually if backend doesn’t support it
      let sorted = res.items;
      if (sort === "price_asc") sorted = [...sorted].sort((a, b) => a.price - b.price);
      if (sort === "price_desc") sorted = [...sorted].sort((a, b) => b.price - a.price);
      if (sort === "name_asc") sorted = [...sorted].sort((a, b) => a.name.localeCompare(b.name));
      if (sort === "pop") sorted = [...sorted]; // keep default order
      setData({ ...res, items: sorted });
    } catch (err) {
      console.error(err);
      setData({ items: [], total: 0, categories: [] });
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, maxPrice, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sortOptions = useMemo(
    () => [
      { v: "pop", l: "Most Popular" },
      { v: "price_asc", l: "Price: Low to High" },
      { v: "price_desc", l: "Price: High to Low" },
      { v: "name_asc", l: "Name: A to Z" },
    ],
    []
  );

  const totalPages = Math.ceil(data.total / ITEMS_PER_PAGE);
  const isFiltered = search || category || maxPrice < 5000;

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMaxPrice(5000);
    setSort("pop");
    setPage(1);
  };

  return (
    <section className="container max-w-6xl mx-auto py-10 lg:py-16 px-4 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Health Store</h1>
          <p className="mt-1 text-gray-500">Search, filter by category, and sort products.</p>
          <p className="mt-1 text-sm text-gray-500 font-medium">{data.total} products found</p>
        </div>

        {/* Sort + View Toggle */}
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm shadow-sm hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {sortOptions.map((o) => (
              <option key={o.v} value={o.v}>
                {o.l}
              </option>
            ))}
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition ${
                viewMode === "grid" ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition border-l border-gray-300 ${
                viewMode === "list" ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6 sticky top-20 self-start h-fit p-4 border rounded-xl bg-white shadow-md">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 border-b pb-3">
            <Filter size={20} className="text-primary" /> Filters
          </h3>

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="w-full h-9 flex items-center justify-center gap-1 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
            >
              <X size={14} /> Clear All Filters
            </button>
          )}

          {/* Search */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              />
            </div>
          </div>

          {/* Price Range (Single Bar for Max Price) */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">
              Max Price (₹{maxPrice})
            </label>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              onMouseUp={fetchProducts}
              onTouchEnd={fetchProducts}
              className="w-full accent-primary cursor-pointer"
            />
          </div>

          {/* Categories */}
          <div>
            <div className="text-sm font-semibold text-gray-700 block mb-2 border-t pt-3">
              Category
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setCategory("")}
                className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                  !category ? "bg-primary text-white font-semibold shadow-sm" : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                All
              </button>
              {data.categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                    category === c
                      ? "bg-primary text-white font-semibold shadow-sm"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid/List */}
        <div className="space-y-8">
          {loading ? (
            <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse rounded-lg bg-gray-200/50 ${
                    viewMode === "list" ? "h-32" : "h-60"
                  }`}
                />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <div className="text-center p-12 border border-gray-300 rounded-lg bg-gray-50 mt-4">
              <p className="text-lg text-gray-600 font-medium">No products found matching your criteria.</p>
              <button onClick={clearFilters} className="mt-4 text-sm font-semibold text-primary hover:underline">
                Clear Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p) => (
                <ProductCard key={p._id} {...p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {data.items.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-900">{p.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                    <p className="mt-1 text-sm text-yellow-500">⭐ {p.rating?.toFixed(1) ?? "4.0"}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end space-y-2 pt-2 sm:pt-0">
                    <p className="font-bold text-xl text-primary">₹{p.price.toFixed(0)}</p>
                    <button className="w-full sm:w-auto px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition shadow-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6 flex-wrap">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded-md border text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                &larr; Prev
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`w-8 h-8 rounded-md font-medium transition ${
                    idx + 1 === page
                      ? "bg-primary text-white border-primary shadow-md"
                      : "hover:bg-primary/10 border"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-md border text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
