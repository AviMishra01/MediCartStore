import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiGet } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/currency";
import { useAuth } from "@/context/AuthContext";
import { Star, Truck, Shield, RotateCcw, MessageCircle } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  stock: number;
  category?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description");
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: "", text: "" });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!id) return;
    apiGet<Product>(`/api/products/${id}`).then(setData);
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    if (!id) return;
    try {
      setReviewLoading(true);
      const res = await fetch(`/api/reviews/product/${id}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newReview.title || !newReview.text) return;

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          rating: newReview.rating,
          title: newReview.title,
          text: newReview.text,
          userName: user.name || "Anonymous",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      setNewReview({ rating: 5, title: "", text: "" });
      await fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    }
  };

  const handleSubmitReply = async (reviewId: string) => {
    if (!user || !replyText.trim()) return;

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: replyText,
          userName: user.name || "Anonymous",
        }),
      });

      if (!res.ok) throw new Error("Failed to submit reply");
      setReplyText("");
      setReplyingTo(null);
      await fetchReviews();
    } catch (err) {
      console.error("Error submitting reply:", err);
      alert("Failed to submit reply");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      const msg = encodeURIComponent("Please log in or sign up to continue.");
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?msg=${msg}&next=${next}`);
      return;
    }

    if (!data) return;

    // Create checkout summary for this product only
    const checkoutItem = {
      _id: data._id,
      productId: data._id,
      name: data.name,
      price: data.price,
      image: data.images?.[0] || data.image,
      qty: qty,
      stock: data.stock,
    };

    const subtotal = data.price * qty;
    const tax = subtotal * 0.13;
    const shipping = 0;
    const total = subtotal + shipping;

    // Save checkout summary to localStorage
    localStorage.setItem('checkout:summary', JSON.stringify({
      items: [checkoutItem],
      subtotal,
      tax,
      shipping,
      total,
    }));

    localStorage.setItem('checkout:selected', JSON.stringify([data._id]));

    // Navigate to checkout page
    navigate('/checkout?step=1');
  };

  if (!data) return (
    <section className="container py-16">
      <div className="h-64 animate-pulse rounded-xl border bg-muted/30" />
    </section>
  );

  return (
    <section className="container py-10">
      {/* Product Header and Main Info */}
      <div className="grid gap-8 md:grid-cols-2 mb-12">
        {/* Left: Image Gallery */}
        <div>
          {/* Carousel: show images[] if present, otherwise single image */}
          {Array.isArray(data.images) && data.images.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden bg-gray-100">
                <img src={data.images[mainImageIdx]} alt={data.name} className="aspect-square w-full object-cover" />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {data.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className={`h-20 w-20 flex-shrink-0 rounded-lg object-cover cursor-pointer border-2 transition ${
                      i === mainImageIdx ? 'ring-2 ring-primary border-primary' : 'border-gray-200 hover:border-primary'
                    }`}
                    alt={`${data.name} ${i}`}
                    onClick={() => setMainImageIdx(i)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <img
              src={data.image || 'https://via.placeholder.com/800?text=No+Image'}
              alt={data.name}
              className="aspect-square w-full rounded-xl object-cover bg-gray-100"
            />
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-between">
          {/* Category Badge */}
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
              {data.category || "Medicine"}
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{data.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(128 reviews)</span>
            </div>

            {/* Price and Stock */}
            <div className="space-y-2 mb-6 pb-6 border-b">
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold text-primary">{formatINR(data.price)}</div>
                <div className="text-lg text-gray-500 line-through">{formatINR(data.price * 1.2)}</div>
              </div>
              <div className={`text-sm font-semibold ${data.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.stock > 0 ? `✓ ${data.stock} in stock` : "Out of stock"}
              </div>
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold">Quantity:</label>
                <input
                  type="number"
                  min={1}
                  max={data.stock}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value || 1), data.stock)))}
                  className="h-10 w-20 rounded-md border bg-background px-3 text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  disabled={data.stock === 0}
                  onClick={handleBuyNow}
                  className="flex-1 h-12 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>🛒</span> Buy Now
                </button>
                <button
                  disabled={data.stock === 0}
                  onClick={() => {
                    if (!user) {
                      const msg = encodeURIComponent("Please log in or sign up to continue.");
                      const next = encodeURIComponent(location.pathname + location.search);
                      navigate(`/login?msg=${msg}&next=${next}`);
                      return;
                    }
                    add(data, qty);
                  }}
                  className="flex-1 h-12 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary/5 transition disabled:opacity-50"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Truck size={18} className="text-primary" />
                <span>Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield size={18} className="text-primary" />
                <span>100% Genuine & Certified</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <RotateCcw size={18} className="text-primary" />
                <span>7-day easy return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-12">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "description"
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "shipping"
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Shipping Info
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "reviews"
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-bold">Product Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.description}</p>

            {/* Specifications */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-bold mb-3">Specifications</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <p className="font-semibold">{data.category || "Medicine"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Availability:</span>
                  <p className="font-semibold">{data.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Price:</span>
                  <p className="font-semibold">{formatINR(data.price)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Stock Quantity:</span>
                  <p className="font-semibold">{data.stock} units</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Info Tab */}
        {activeTab === "shipping" && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-bold mb-4">Shipping & Delivery</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-bold text-gray-900">Standard Delivery</h4>
                <p className="text-gray-700 text-sm mt-1">Delivery within 3-5 business days across major cities</p>
                <p className="text-primary font-semibold text-sm mt-2">Free on orders above ₹500</p>
              </div>
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-bold text-gray-900">Express Delivery</h4>
                <p className="text-gray-700 text-sm mt-1">Next-day delivery available in selected areas</p>
                <p className="text-blue-600 font-semibold text-sm mt-2">Flat ₹99</p>
              </div>
              <div className="bg-blue-50 p-4 rounded mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Delivery times may vary based on your location and current order volume.
                  Medicines are shipped with proper packaging to maintain quality.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="bg-gray-50 p-6 rounded-lg space-y-6">
            <h3 className="text-lg font-bold">Customer Reviews for {data?.name}</h3>

            {/* Review Submission Form */}
            {user ? (
              <form onSubmit={handleSubmitReview} className="border rounded-lg p-4 bg-white space-y-4">
                <h4 className="font-bold">Write a Review</h4>
                <div>
                  <label className="text-sm font-semibold block mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: num })}
                        className={`text-2xl transition ${
                          num <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{newReview.rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">Review Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Great product, fast delivery"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">Your Review</label>
                  <textarea
                    placeholder="Share your experience with this product..."
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    rows={4}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="border rounded-lg p-4 bg-white text-center">
                <p className="text-gray-600 mb-3">Please log in to write a review</p>
                <button
                  onClick={() => navigate("/login")}
                  className="h-10 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90"
                >
                  Log In
                </button>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewLoading ? (
                <p className="text-gray-600">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4 bg-white space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{review.userName}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900">{review.title}</h5>
                      <p className="text-gray-700 text-sm mt-1">{review.text}</p>
                    </div>

                    {/* Replies */}
                    {review.replies && review.replies.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded mt-3 space-y-2 border-l-4 border-primary">
                        {review.replies.map((reply: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <p className="font-semibold text-primary">{reply.userName}</p>
                            <p className="text-gray-700">{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === review._id ? (
                      <div className="flex gap-2 mt-3">
                        <textarea
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          className="flex-1 p-2 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary outline-none"
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleSubmitReply(review._id)}
                            disabled={!user || !replyText.trim()}
                            className="h-10 px-3 bg-primary text-white rounded text-sm hover:bg-primary/90 disabled:opacity-50"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="h-10 px-3 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(review._id)}
                        disabled={!user}
                        className="text-sm text-primary hover:underline disabled:text-gray-400"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      <div className="border-t pt-12">
        <h3 className="text-2xl font-bold mb-6">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "1", name: "Aspirin 500mg", price: 49, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400" },
            { id: "2", name: "Cough Drops", price: 79, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400" },
            { id: "3", name: "Vitamin D3", price: 199, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400" },
            { id: "4", name: "Cold Relief", price: 129, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400" },
          ].map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
              <div className="p-3">
                <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                <p className="text-primary font-bold mt-2">{formatINR(product.price)}</p>
                <button className="w-full mt-2 py-2 text-xs bg-primary text-white rounded hover:bg-primary/90">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
