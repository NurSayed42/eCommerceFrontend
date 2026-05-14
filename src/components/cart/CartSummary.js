import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../utils';

export default function CartSummary({ subtotal, discount = 0, shipping = 0, onCheckout }) {
  const navigate = useNavigate();
  const total = subtotal - discount + shipping;

  return (
    <div className="card p-5 sticky top-24">
      <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-green-600 font-medium">FREE</span> : formatPrice(shipping)}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button onClick={onCheckout || (() => navigate('/checkout'))}
              className="btn-primary w-full mt-5 py-3 text-sm font-semibold gap-2">
        Proceed to Checkout <ArrowRight size={16} />
      </button>

      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
        <ShieldCheck size={13} />
        <span>Secure & encrypted checkout</span>
      </div>
    </div>
  );
}
