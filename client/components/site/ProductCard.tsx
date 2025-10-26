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
  const firstImage = (p as any).images && (p as any).images.length ? (p as any).images[0] : p.image;
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
    add({ _id: p._id, name: p.name, price: p.price, image: firstImage, stock: p.stock });
  };
  return (
    <div className="group overflow-hidden rounded-lg border bg-card">
      <Link to={`/product/${p._id}`} className="block overflow-hidden">
        <img
          src={imgSrc}
          alt={p.name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="space-y-1 p-4">
        <Link to={`/product/${p._id}`} className="line-clamp-1 font-medium hover:text-primary">
          {p.name}
        </Link>
        <div className="text-sm text-muted-foreground">{p.category ?? ""}</div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-base font-semibold">₹{p.price.toFixed(2)}</div>
          <button className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90" onClick={onAdd}>
            Add to Cart
          </button>
        </div>
        <div className="text-xs text-muted-foreground">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</div>
      </div>
    </div>
  );
}
