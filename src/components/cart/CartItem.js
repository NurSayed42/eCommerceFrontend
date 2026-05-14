import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, BookmarkCheck } from 'lucide-react';
import { formatPrice } from '../../utils';

export default function CartItem({ item, onUpdate, onRemove, onSaveForLater }) {
  const image = item.product?.images?.[0] || 'https://placehold.co/80x80?text=No+Image';
  const price = item.product?.salePrice || item.product?.price || 0;
  const total = price * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100">
      {/* Image */}
      <Link to={`/products/${item.product?.slug}`} className="flex-shrink-0">
        <img src={image} alt={item.product?.name}
             className="w-20 h-20 object-cover rounded-lg border border-gray-100"
             onError={e => e.target.src = 'https://placehold.co/80x80?text=Img'} />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.product?.slug}`}
              className="font-medium text-gray-800 text-sm hover:text-primary-600 line-clamp-2">
          {item.product?.name}
        </Link>

        {/* Variant info */}
        {(item.variant?.size || item.variant?.color) && (
          <div className="flex gap-2 mt-1">
            {item.variant.size  && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.variant.size}</span>}
            {item.variant.color && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.variant.color}</span>}
          </div>
        )}

        {/* Price */}
        <p className="text-primary-600 font-bold text-sm mt-1">{formatPrice(total)}</p>

        {/* Quantity + Actions */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => onUpdate(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <Minus size={13} />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
            <button onClick={() => onUpdate(item.id, item.quantity + 1)}
                    disabled={item.quantity >= (item.product?.stock || 99)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <Plus size={13} />
            </button>
          </div>

          <div className="flex gap-2">
            {onSaveForLater && (
              <button onClick={() => onSaveForLater(item.id)}
                      className="text-xs text-gray-400 hover:text-primary-500 flex items-center gap-1 transition-colors">
                <BookmarkCheck size={13} /> Save
              </button>
            )}
            <button onClick={() => onRemove(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
