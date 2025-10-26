import React, { useEffect, useState } from "react";
import { MapPin, XCircle, CheckCircle } from "lucide-react";

// --- INTERFACES & CONSTANTS ---
interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: string;
  shipping: {
    fullName: string;
    addressLine: string;
    city: string;
    province: string;
  };
  createdAt: string;
  updatedAt: string;
  canceledReason?: string;
}

const STATUS_WORKFLOW = [
  "pending",
  "confirmed",
  "in_warehouse",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gray-500",
  confirmed: "bg-blue-600",
  in_warehouse: "bg-yellow-500",
  shipped: "bg-indigo-600",
  out_for_delivery: "bg-orange-500",
  delivered: "bg-green-600",
  canceled: "bg-red-600",
};

// --- StatusBadge COMPONENT ---
interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || "bg-gray-400";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold uppercase leading-none rounded-full text-white ${colorClass}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
};

// --- Column Definition Interfaces ---
interface ColumnDefinition {
  key: string;
  header: string;
  render?: (order: Order, index: number) => React.ReactNode;
  cellClass?: string;
  headerClass?: string;
}

interface OrderTableProps {
  title: string;
  data: Order[];
  columns: ColumnDefinition[];
}

// --- OrderTable COMPONENT ---
const OrderTable: React.FC<OrderTableProps> = ({ title, data, columns }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-extrabold text-gray-800 border-b pb-2">
      {title} ({data.length})
    </h2>
    {data.length === 0 ? (
      <div className="p-4 bg-white border border-dashed rounded-lg text-center text-gray-500">
        <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
        <p>No {title.toLowerCase()} found.</p>
      </div>
    ) : (
      <div className="overflow-x-auto shadow-xl rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider ${col.headerClass || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((o, idx) => (
              <tr key={o._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-800 ${col.cellClass || ''}`}
                  >
                    {col.render ? col.render(o, idx) : (o[col.key as keyof Order] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// --- MAIN COMPONENT: AdminOrders ---
export default function AdminOrders() {
  const token = localStorage.getItem("ADMIN_TOKEN");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelReasonId, setCancelReasonId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchOrders = async () => {
    if (!token) return setLoading(false);
    try {
      const res = await fetch("/api/orders/admin/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/admin/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelOrder = async (id: string) => {
    if (!token || !cancelReason) return;
    try {
      const res = await fetch(`/api/orders/admin/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: cancelReason }),
      });
      if (res.ok) {
        fetchOrders();
        setCancelReason("");
        setCancelReasonId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getNextActions = (status: string) => {
    const index = STATUS_WORKFLOW.indexOf(status);
    const nextStatus = index + 1 < STATUS_WORKFLOW.length ? STATUS_WORKFLOW[index + 1] : null;
    return nextStatus ? [nextStatus, "canceled"] : ["canceled"];
  };

  const renderStatusDropdown = (order: Order) => {
    const isFinalStatus = order.status === "delivered" || order.status === "canceled";
    if (isFinalStatus) return <StatusBadge status={order.status} />;

    const nextActions = getNextActions(order.status);

    if (cancelReasonId === order._id) {
      return (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Cancellation reason..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="px-3 py-1 border border-red-300 rounded-md text-sm flex-1 focus:ring-red-500 focus:border-red-500 transition"
          />
          <button
            onClick={() => cancelOrder(order._id)}
            disabled={!cancelReason}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium transition"
          >
            Confirm
          </button>
          <button
            onClick={() => setCancelReasonId(null)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <StatusBadge status={order.status} />
        <select
          className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition"
          value={order.status}
          onChange={(e) => {
            if (e.target.value === "canceled") setCancelReasonId(order._id);
            else updateStatus(order._id, e.target.value);
          }}
        >
          <option value={order.status} disabled>Change Status</option>
          {nextActions.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderProducts = (o: Order) => (
    <div className="text-xs space-y-1 max-w-sm">
      {o.items.map((it, i) => (
        <p key={i} className="truncate" title={it.name}>
          {it.name} x<span className="font-medium">{it.qty}</span> (₹{(it.price * it.qty).toFixed(0)})
        </p>
      ))}
    </div>
  );

  const renderShippingAddress = (o: Order) => (
    <div className="flex items-center text-xs text-gray-600">
      <MapPin className="w-3 h-3 mr-1 text-red-500" />
      {o.shipping && `${o.shipping.city}, ${o.shipping.province}`}
    </div>
  );

  // --- UPDATED FINANCIAL SUMMARY ---
  const renderFinancialSummary = (o: Order) => {
    const productAmount = o.items.reduce((sum, it) => sum + it.price * it.qty, 0);
    return (
      <div className="text-xs space-y-1 font-medium">
        <p className="flex justify-between text-gray-600">
          <span>Product Amount:</span>
          <span>₹{productAmount.toFixed(0)}</span>
        </p>
        <p className="flex justify-between text-lg font-bold border-t pt-1 mt-1 text-gray-900">
          <span>Total:</span>
          <span className="text-green-600">₹{o.total.toFixed(0)}</span>
        </p>
      </div>
    );
  };

  const activeOrders = orders.filter(o => o.status !== "canceled" && o.status !== "delivered");
  const canceledOrders = orders.filter(o => o.status === "canceled");
  const deliveredOrders = orders.filter(o => o.status === "delivered");

  const commonColumns: ColumnDefinition[] = [
    { key: 'idx', header: '#', render: (_, index) => index + 1 },
    { key: 'orderNumber', header: 'Order #', render: o => <span className="font-semibold text-blue-600">{o.orderNumber}</span> },
    { key: 'products', header: 'Products', render: renderProducts },
    { key: 'customer', header: 'Customer', render: o => o.shipping?.fullName },
    { key: 'shippingAddress', header: 'Shipping', render: renderShippingAddress },
  ];

  const financialColumns: ColumnDefinition[] = [
    { key: 'summary', header: 'Financial Summary', render: renderFinancialSummary, headerClass: 'text-right', cellClass: 'text-right w-40' },
  ];

  const activeColumns: ColumnDefinition[] = [
    ...commonColumns,
    ...financialColumns,
    { key: 'status', header: 'Actions / Status', render: renderStatusDropdown },
    { key: 'createdAt', header: 'Created At', render: o => new Date(o.createdAt).toLocaleString() },
  ];

  const deliveredColumns: ColumnDefinition[] = [
    ...commonColumns,
    ...financialColumns,
    { key: 'status', header: 'Status', render: o => <StatusBadge status={o.status} /> },
    { key: 'deliveredAt', header: 'Delivered At', render: o => new Date(o.updatedAt).toLocaleString() },
  ];

  const canceledColumns: ColumnDefinition[] = [
    { key: 'orderNumber', header: 'Order #', render: o => <span className="font-semibold text-blue-600">{o.orderNumber}</span> },
    { key: 'customer', header: 'Customer', render: o => o.shipping?.fullName },
    { key: 'reason', header: 'Cancellation Reason', render: o => <p className="italic text-red-700">{o.canceledReason || 'N/A'}</p> },
    { key: 'status', header: 'Status', render: o => <StatusBadge status={o.status} /> },
    { key: 'canceledAt', header: 'Canceled At', render: o => new Date(o.updatedAt).toLocaleString() },
    ...financialColumns,
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 space-y-16 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 border-b pb-4">Admin Order Management</h1>
      {loading ? (
        <div className="text-center p-10 text-xl text-gray-500">Loading orders...</div>
      ) : (
        <>
          <OrderTable title="Active Orders" data={activeOrders} columns={activeColumns} />
          <OrderTable title="Delivered Orders" data={deliveredOrders} columns={deliveredColumns} />
          <OrderTable title="Canceled Orders" data={canceledOrders} columns={canceledColumns} />
        </>
      )}
    </div>
  );
}
