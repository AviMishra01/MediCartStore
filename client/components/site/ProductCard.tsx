import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: string;
  images?: string[];
}

export default function ProductCard(p: ProductCardProps) {
  const { user } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback for product image
  const firstImage = p.images && p.images.length ? p.images[0] : p.image;
  const placeholder = "https://via.placeholder.com/400?text=No+Image";
  const imgSrc = firstImage || placeholder;

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      const msg = encodeURIComponent("Please log in or sign up to continue.");
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?msg=${msg}&next=${next}`);
      return;
    }
    if (p.stock > 0) {
      add({ _id: p._id, name: p.name, price: p.price, image: imgSrc, stock: p.stock });
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card shadow hover:shadow-lg transition-all duration-300">
      {/* Stock Badge */}
      {p.stock === 0 && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
          Out of Stock
        </span>
      )}

      {/* Image & Link */}
      <Link to={`/product/${p._id}`} className="block overflow-hidden">
        <img
          src={imgSrc}
          alt={p.name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="p-4 space-y-1">
        <Link to={`/product/${p._id}`} className="line-clamp-1 font-medium hover:text-primary transition-colors">
          {p.name}
        </Link>
        {p.category && <div className="text-sm text-muted-foreground">{p.category}</div>}
        <div className="flex items-center justify-between pt-2">
          <div className="text-base font-semibold">₹{p.price.toFixed(2)}</div>
          <button
            className={`rounded-md px-3 py-2 text-xs font-medium transition ${
              p.stock > 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            onClick={onAdd}
            disabled={p.stock === 0}
          >
            Add to Cart
          </button>
        </div>
        <div className="text-xs text-muted-foreground">
          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
        </div>
      </div>
    </div>
  );
}
