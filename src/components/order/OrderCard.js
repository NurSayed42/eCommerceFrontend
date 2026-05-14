import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { formatPrice, formatDate, orderStatusColor, orderStatusLabel } from '../../utils';

export default function OrderCard({ order }) {
  const firstItem = order.items?.[0];
  const moreCount = (order.items?.length || 1) - 1;

  return (
    <Link to={`/orders/${order.orderNumber}`}
          className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
      {/* Product image */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
        {firstItem?.product?.images?.[0]
          ? <img src={firstItem.product.images[0]} alt="" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><Package size={24} className="text-gray-300" /></div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs text-gray-400 font-mono">#{order.orderNumber}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${orderStatusColor(order.status)}`}>
            {orderStatusLabel(order.status)}
          </span>
        </div>

        <p className="text-sm font-medium text-gray-800 truncate">
          {firstItem?.product?.name}
          {moreCount > 0 && <span className="text-gray-400 font-normal"> +{moreCount} more</span>}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
          <span className="font-bold text-sm text-gray-900">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
    </Link>
  );
}
