import React, { useEffect, useState, useRef } from "react";
import { Search, Grid, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  featured?: boolean;
  images?: string[];
  image?: string;
}

const PRICE_RANGES = [
  { label: "₹0 - ₹499", min: 0, max: 499 },
  { label: "₹500 - ₹999", min: 500, max: 999 },
  { label: "₹1000 - ₹4999", min: 1000, max: 4999 },
  { label: "₹5000+", min: 5000, max: Infinity },
];

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const token = localStorage.getItem("ADMIN_TOKEN");
  const searchRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      const allProducts = Array.isArray(data.items) ? data.items : data.items || [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [token]);

  // Reset form
  const resetForm = () => {
    setName(""); setDescription(""); setPrice(""); setStock(""); setCategory(""); setFeatured(false);
    setImageFiles([]); setImagePreviews([]); setEditingProduct(null); setModalOpen(false);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles([...imageFiles, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle removing image
  const handleRemoveImage = (idx: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== idx));
    setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
  };

  // Add/Edit product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name || !price) {
        toast({
          title: "Validation Error",
          description: "Name and price are required",
          variant: "destructive",
        });
        return;
      }

      // Convert image files to base64 or use existing previews
      const imageArray = [...imagePreviews];

      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock) || 0,
        category,
        featured,
        images: imageArray,
        image: imageArray.length > 0 ? imageArray[0] : "",
      };

      const url = editingProduct ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error(await res.text());
      toast({
        title: "Success",
        description: editingProduct ? "Product updated successfully" : "Product added successfully",
      });
      resetForm();
      fetchProducts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      fetchProducts();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Error deleting product: " + (err.message || err),
        variant: "destructive",
      });
    }
  };

  // Open modal for new product (auto-featured)
  const openNewProductModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("");
    setFeatured(true);
    setImagePreviews([]);
    setImageFiles([]);
    setModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description || "");
    setPrice(p.price.toString());
    setStock(p.stock.toString());
    setCategory(p.category || "");
    setFeatured(p.featured || false);
    setImagePreviews(p.images || []);
    setImageFiles([]);
    setModalOpen(true);
  };

  // Filter & search
  useEffect(() => {
    let temp = [...products];
    if (searchTerm) {
      temp = temp.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      temp = temp.filter((p) => p.price >= range.min && p.price <= range.max);
    }
    setFilteredProducts(temp);
  }, [searchTerm, selectedPriceRange, products]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col md:flex-row gap-6">
      {/* Left Sidebar Filters */}
      <div className="md:w-64 bg-white p-4 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-semibold mb-2">Filters</h3>
        <div>
          <h4 className="font-medium mb-1">Price Range</h4>
          <div className="flex flex-col gap-2">
            {PRICE_RANGES.map((r, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPriceRange(idx)}
                className={`px-3 py-1 rounded-lg text-left ${
                  selectedPriceRange === idx ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {r.label}
              </button>
            ))}
            <button
              onClick={() => setSelectedPriceRange(null)}
              className="px-3 py-1 rounded-lg text-left bg-gray-200"
            >
              All
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <span>View:</span>
          <div className="flex gap-2">
            <button onClick={() => setViewMode("grid")} className={`p-1 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
              <Grid size={16} />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-1 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Search & Add */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 relative" ref={searchRef}>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full pl-10 pr-4 text-sm text-gray-800 border rounded-lg focus:ring-2 focus:ring-primary/50 outline-none"
              onFocus={() => setShowSuggestions(true)}
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {showSuggestions && searchTerm && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-52 overflow-y-auto">
                {products
                  .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p) => (
                    <div
                      key={p._id}
                      onClick={() => { setSearchTerm(p.name); setShowSuggestions(false); }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {p.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <button
            onClick={openNewProductModal}
            className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            <span className="text-xl mr-2">+</span> Add Product
          </button>
        </div>

        {/* Products List */}
        {viewMode === "list" ? (
          <div className="overflow-x-auto bg-white rounded shadow-lg">
            <table className="min-w-full text-gray-700 border-collapse">
              <thead className="bg-gray-100 uppercase text-sm">
                <tr>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Stock</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Featured</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">Loading...</td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">No products found</td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition">
                      <td className="p-3 border">{p.name}</td>
                      <td className="p-3 border">₹{p.price.toLocaleString()}</td>
                      <td className="p-3 border">{p.stock}</td>
                      <td className="p-3 border">{p.category || "-"}</td>
                      <td className="p-3 border">{p.featured ? "Yes" : "No"}</td>
                      <td className="p-3 border space-x-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div key={p._id} className="bg-white rounded shadow p-4 flex flex-col">
                {p.images?.[0] || p.image ? (
                  <img src={p.images?.[0] || p.image} alt={p.name} className="h-40 w-full object-cover rounded mb-2" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                ) : (
                  <div className="h-40 w-full bg-gray-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <h4 className="font-semibold">{p.name}</h4>
                <p>₹{p.price.toLocaleString()}</p>
                <p>Stock: {p.stock}</p>
                <p>Category: {p.category || "-"}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEditModal(p)} className="flex-1 px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="flex-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold mb-4">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 resize-none" rows={2} />
              <div className="flex space-x-2">
                <input placeholder="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                <input placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>
              <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                <span>Featured</span>
              </label>
              <div className="space-y-2">
                <span className="font-semibold text-gray-700">Product Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img src={src} alt="preview" className="h-20 w-20 object-cover rounded border" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{editingProduct ? "Save Changes" : "Add Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
