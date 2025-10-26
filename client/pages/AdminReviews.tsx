import React, { useEffect, useState } from "react";
import { Trash2, Reply, ChevronDown } from "lucide-react";

interface Review {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  text: string;
  replies?: any[];
  createdAt?: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("ADMIN_TOKEN");

  // Fetch all reviews
  const fetchReviews = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      alert("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews(reviews.filter((r) => r._id !== reviewId));
      alert("Review deleted successfully");
    } catch (err: any) {
      alert("Error: " + (err.message || err));
    }
  };

  // Submit reply
  const handleSubmitReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: replyText,
          userName: "Admin",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit reply");
      setReplyText("");
      setReplyingTo(null);
      await fetchReviews();
      alert("Reply added successfully");
    } catch (err: any) {
      alert("Error: " + (err.message || err));
    }
  };

  // Toggle expanded review
  const toggleExpanded = (reviewId: string) => {
    const newSet = new Set(expandedReviews);
    if (newSet.has(reviewId)) {
      newSet.delete(reviewId);
    } else {
      newSet.add(reviewId);
    }
    setExpandedReviews(newSet);
  };

  // Filter & search reviews
  const filteredReviews = reviews
    .filter((r) => (filterRating ? r.rating === filterRating : true))
    .filter((r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Reviews</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by product, user, or text..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
        />

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterRating(null)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterRating === null
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilterRating(rating)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterRating === rating
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              ⭐ {rating} ({reviews.filter((r) => r.rating === rating).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-gray-600 py-8">Loading reviews...</p>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600">No reviews found</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {/* Review Header */}
              <div
                onClick={() => toggleExpanded(review._id)}
                className="p-4 cursor-pointer hover:bg-gray-50 transition flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">Product ID: {review.productId}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{review.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">By {review.userName}</p>
                  <p className="text-gray-700 line-clamp-2">{review.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recently"}
                  </p>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 flex-shrink-0 ml-4 transition ${
                    expandedReviews.has(review._id) ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Expanded Content */}
              {expandedReviews.has(review._id) && (
                <div className="border-t p-4 bg-gray-50 space-y-4">
                  {/* Full Review */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Full Review</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{review.text}</p>
                  </div>

                  {/* Replies */}
                  {review.replies && review.replies.length > 0 && (
                    <div className="bg-white p-3 rounded border-l-4 border-primary">
                      <h4 className="font-bold text-gray-900 mb-3">Replies</h4>
                      <div className="space-y-3">
                        {review.replies.map((reply: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <p className="font-semibold text-primary">{reply.userName}</p>
                            <p className="text-gray-700">{reply.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === review._id ? (
                    <div className="space-y-2 bg-white p-3 rounded">
                      <textarea
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        className="w-full p-2 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-primary outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitReply(review._id)}
                          disabled={!replyText.trim()}
                          className="flex-1 h-10 bg-primary text-white rounded font-medium hover:bg-primary/90 disabled:opacity-50"
                        >
                          Send Reply
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText("");
                          }}
                          className="h-10 px-4 bg-gray-300 text-gray-700 rounded font-medium hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(review._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition"
                    >
                      <Reply size={16} /> Add Reply
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition"
                  >
                    <Trash2 size={16} /> Delete Review
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
