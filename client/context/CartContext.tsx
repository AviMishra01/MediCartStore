import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  update: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartCtx = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart:v1", JSON.stringify(items));
  }, [items]);

  const add: CartState["add"] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p._id === item._id);
      if (existing) {
        const nextQty = Math.min(existing.qty + qty, item.stock);
        return prev.map((p) => (p._id === item._id ? { ...p, qty: nextQty } : p));
      }
      return [...prev, { ...item, qty: Math.min(qty, item.stock) }];
    });
  }, []);

  const update: CartState["update"] = useCallback((id, qty) => {
    setItems((prev) => prev.map((p) => (p._id === id ? { ...p, qty: Math.max(1, Math.min(qty, p.stock)) } : p)));
  }, []);

  const remove: CartState["remove"] = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p._id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartState>(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const count = items.reduce((c, i) => c + i.qty, 0);
    return { items, count, subtotal, add, update, remove, clear };
  }, [items, add, update, remove, clear]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
