import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { orderAPI } from '../services/api';
import EmptyState from '../components/common/EmptyState';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800', SHIPPED: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-gray-100 text-gray-700', REFUNDED: 'bg-gray-100 text-gray-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    orderAPI.getMyOrders(page).then(r => {
      setOrders(r.data.data?.content || []);
      setTotalPages(r.data.data?.totalPages || 0);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="container-app py-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Package size={24} /> My Orders
      </h1>

      {loading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_,i) => <div key={i} className="card p-5 skeleton h-28" />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" message="You haven't placed any orders. Start shopping!"
                    actionLabel="Shop Now" actionHref="/products" />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.orderNumber}`}
                  className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package size={22} className="text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-primary-600 text-sm">{order.orderNumber}</span>
                  <span className={`badge text-[10px] font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{order.items?.length} items · {new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">৳{order.totalAmount?.toLocaleString('en-BD')}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 flex-shrink-0 group-hover:text-primary-600 transition-colors" />
            </Link>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 pt-4">
              <button disabled={page === 0} onClick={() => setPage(p => p-1)} className="btn-outline text-sm px-5 py-2 disabled:opacity-40">← Prev</button>
              <span className="flex items-center text-sm text-gray-600 px-3">Page {page+1} of {totalPages}</span>
              <button disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)} className="btn-outline text-sm px-5 py-2 disabled:opacity-40">Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
