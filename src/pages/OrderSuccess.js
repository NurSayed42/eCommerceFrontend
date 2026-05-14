import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Home } from 'lucide-react';
import { orderAPI } from '../services/api';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderAPI.getByOrderNum(orderNumber).then(r => setOrder(r.data.data)).catch(() => {});
  }, [orderNumber]);

  return (
    <div className="container-app py-16 text-center max-w-xl mx-auto">
      <div className="card p-10 animate-scaleIn">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-6">Thank you for your order. We'll deliver it to you soon.</p>

        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Order Number</span>
            <span className="font-bold text-primary-600">{orderNumber}</span>
          </div>
          {order && (<>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="font-bold text-gray-900">৳{order.totalAmount?.toLocaleString('en-BD')}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Payment Method</span>
              <span className="text-sm font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Est. Delivery</span>
              <span className="text-sm font-medium">
                {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-BD', { day: 'numeric', month: 'long' }) : '3-5 Days'}
              </span>
            </div>
          </>)}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={`/orders/${orderNumber}`} className="btn-outline flex-1 py-2.5 text-sm gap-2">
            <Package size={16} /> Track Order
          </Link>
          <Link to="/" className="btn-primary flex-1 py-2.5 text-sm gap-2">
            <Home size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
