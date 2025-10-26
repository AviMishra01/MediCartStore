import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/currency";
import { Trash2, Plus, Minus, CheckCircle } from 'lucide-react';

export default function CartPage() {
  const { items, update, remove } = useCart();
  const navigate = useNavigate();

  const [selected, setSelected] = React.useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    items.forEach(i => (map[i._id] = true));
    return map;
  });

  React.useEffect(() => {
    setSelected(prev => {
      const next: Record<string, boolean> = {};
      items.forEach(i => { next[i._id] = prev[i._id] ?? true; });
      return next;
    });
  }, [items]);

  const toggle = (id: string) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const allSelected = items.length > 0 && items.every(i => selected[i._id]);
  const toggleAll = () => {
    if (allSelected) setSelected({});
    else {
      const next: Record<string, boolean> = {};
      items.forEach(i => (next[i._id] = true));
      setSelected(next);
    }
  };

  // Constants
  const TAX_RATE = 0.13;
  const SHIPPING_THRESHOLD = 1500;
  const SHIPPING_CHARGE = 65;

  const SELECTED_ITEMS = items.filter(i => selected[i._id]);
  const total = SELECTED_ITEMS.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxAmount = total * TAX_RATE;
  const subtotal = total - taxAmount;
  const shippingCost = total === 0 ? 0 : total > SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const totalPayable = total + shippingCost;

  return (
    <section className="container py-12 lg:py-20 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-8 p-10 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
          <CheckCircle size={48} className="text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-4">Your Medizo is empty!</p>
          <Link 
            to="/products" 
            className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Start Shopping for Medicines
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((i) => {
              const itemTotal = i.price * i.qty;
              return (
                <div 
                  key={i._id} 
                  className="flex items-center gap-4 bg-white rounded-xl shadow-md border border-gray-200 p-4 transition duration-200 hover:shadow-lg"
                >
                  <div className="flex-shrink-0">
                    <input type="checkbox" checked={!!selected[i._id]} onChange={() => toggle(i._id)} aria-label={`Select ${i.name}`} />
                  </div>

                  <img 
                    src={i.image} 
                    alt={i.name} 
                    className="h-20 w-20 rounded-lg object-cover border border-gray-100 flex-shrink-0" 
                  />

                  <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0 pr-4">
                      <div className="truncate font-semibold text-lg text-gray-900">{i.name}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{formatINR(i.price)} per unit</div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="flex items-center border border-gray-300 rounded-lg h-9">
                        <button 
                          onClick={() => update(i._id, Math.max(1, i.qty - 1))} 
                          disabled={i.qty <= 1}
                          className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <input 
                          type="number"
                          value={i.qty}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 1 && val <= i.stock) update(i._id, val);
                          }}
                          className="h-full w-12 text-center text-sm font-medium border-x border-gray-300 bg-background focus:outline-none"
                          min={1}
                          max={i.stock}
                        />
                        <button 
                          onClick={() => update(i._id, Math.min(i.stock, i.qty + 1))} 
                          disabled={i.qty >= i.stock}
                          className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button 
                        onClick={() => remove(i._id)} 
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="hidden sm:block font-bold text-lg text-gray-900 w-24 text-right">
                    {formatINR(itemTotal)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-20 h-max rounded-xl shadow-2xl border border-primary/50 bg-white p-6 space-y-4">
            <div className="text-xl font-bold text-gray-900 border-b pb-3">Order Summary</div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all items" />
              <div className="text-sm text-gray-700">Select all items for checkout</div>
            </div>

            {/* Itemized summary */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {SELECTED_ITEMS.map((i) => (
                <div key={i._id} className="flex justify-between text-gray-700 text-sm">
                  <div>
                    <span className="font-medium">{i.name}</span> × {i.qty}
                  </div>
                  <div className="font-semibold">{formatINR(i.price * i.qty)}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-base text-gray-700 border-t pt-4">
              <span>Subtotal</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-base text-gray-700">
              <span>Tax ({Math.round(TAX_RATE * 100)}%)</span>
              <span className="font-semibold">{formatINR(taxAmount)}</span>
            </div>

            <div className="flex items-center justify-between text-base text-gray-700">
              <span>Shipping & Handling</span>
              <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                {shippingCost === 0 ? 'Free' : formatINR(shippingCost)}
              </span>
            </div>

            <div className="flex items-center justify-between text-2xl font-bold border-t pt-4">
              <span>Total Payable</span>
              <span className="text-primary">{formatINR(totalPayable)}</span>
            </div>

            <button 
              onClick={() => {
                const selectedIds = SELECTED_ITEMS.map(i => i._id);
                localStorage.setItem('checkout:selected', JSON.stringify(selectedIds));

                const snapshot = {
                  items: SELECTED_ITEMS.map(i => ({ productId: i._id, name: i.name, price: i.price, qty: i.qty })),
                  subtotal,
                  tax: taxAmount,
                  shipping: shippingCost,
                  total: totalPayable,
                };
                localStorage.setItem('checkout:summary', JSON.stringify(snapshot));

                navigate('/checkout?step=1');
              }} 
              className="mt-4 w-full h-12 rounded-lg bg-primary py-2 font-bold text-primary-foreground hover:bg-primary/90 transition-colors text-lg shadow-md"
            >
              Checkout selected items
            </button>

            <p className="text-xs text-center text-gray-500">
              Shipping is free on orders over {formatINR(SHIPPING_THRESHOLD)}.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
