import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Truck, ArrowLeft } from 'lucide-react';
import { orderAPI } from '../services/api';
import PageLoader from '../components/common/PageLoader';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED'];
const STATUS_COLORS = { PENDING:'bg-yellow-100 text-yellow-800', CONFIRMED:'bg-blue-100 text-blue-800', SHIPPED:'bg-cyan-100 text-cyan-800', DELIVERED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800' };

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    orderAPI.getByOrderNum(orderNumber).then(r => setOrder(r.data.data)).finally(() => setLoading(false));
  }, [orderNumber]);

  const cancelOrder = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const { data } = await orderAPI.cancel(order.id, 'Customer requested cancellation');
      setOrder(data.data);
      toast.success('Order cancelled');
    } catch { toast.error('Cannot cancel this order'); }
    finally { setCancelling(false); }
  };

  if (loading) return <PageLoader />;
  if (!order) return <div className="container-app py-10 text-center text-gray-500">Order not found</div>;

  const address = (() => { try { return JSON.parse(order.shippingAddress || '{}'); } catch { return {}; } })();
  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container-app py-6 max-w-3xl">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className={`badge px-3 py-1.5 font-semibold text-xs ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
          {order.status}
        </span>
      </div>

      {/* Timeline */}
      {!['CANCELLED','RETURNED','REFUNDED'].includes(order.status) && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between gap-2">
            {STATUS_STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= stepIndex ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] text-center leading-tight ${i <= stepIndex ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                    {s.replace('_',' ')}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mb-4 ${i < stepIndex ? 'bg-primary-600' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Items */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Package size={16} />Order Items</h3>
          {order.items?.map(item => (
            <div key={item.id} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
              <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.productImage || 'https://placehold.co/56?text=Img'} alt=""
                     className="w-full h-full object-contain"
                     onError={e => e.target.src = 'https://placehold.co/56?text=Img'} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                {(item.size || item.color) && <p className="text-xs text-gray-400 mt-0.5">{[item.size, item.color].filter(Boolean).join(' / ')}</p>}
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                  <span className="text-sm font-semibold text-gray-900">৳{item.totalPrice?.toLocaleString('en-BD')}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="space-y-2 mt-4 pt-3 border-t border-gray-100 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>৳{order.subtotal?.toLocaleString('en-BD')}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-৳{order.discount?.toLocaleString('en-BD')}</span></div>}
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>৳{order.shippingCost?.toLocaleString('en-BD')}</span></div>
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100"><span>Total</span><span>৳{order.totalAmount?.toLocaleString('en-BD')}</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Address */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><MapPin size={16} className="text-primary-600" />Delivery Address</h3>
            <p className="text-sm font-medium text-gray-800">{address.name}</p>
            <p className="text-sm text-gray-600 mt-1">{address.address}</p>
            <p className="text-sm text-gray-600">{address.city}, {address.district}</p>
            <p className="text-sm text-gray-500 mt-1">📞 {address.phone}</p>
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><CreditCard size={16} className="text-primary-600" />Payment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span>
                <span className={`badge text-[11px] font-semibold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.paymentStatus}</span>
              </div>
              {order.trackingNumber && <div className="flex justify-between"><span className="text-gray-500">Tracking</span><span className="font-medium text-primary-600">{order.trackingNumber}</span></div>}
            </div>
          </div>
        </div>

        {/* Actions */}
        {['PENDING','CONFIRMED'].includes(order.status) && (
          <button onClick={cancelOrder} disabled={cancelling}
                  className="btn-danger w-full py-2.5 text-sm font-medium disabled:opacity-50">
            {cancelling ? 'Cancelling...' : '✕ Cancel Order'}
          </button>
        )}
        {order.status === 'DELIVERED' && (
          <button onClick={() => orderAPI.requestReturn(order.id, 'Return requested by customer')}
                  className="btn-outline w-full py-2.5 text-sm font-medium">
            ↩ Request Return
          </button>
        )}
      </div>
    </div>
  );
}
