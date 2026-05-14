import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Tag, ShoppingBag, Minus, Plus, ArrowRight, BookmarkCheck } from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { couponAPI } from '../services/api';
import EmptyState from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, loading } = useSelector(s => s.cart);
  const { isAuthenticated } = useSelector(s => s.auth);

  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => { if (isAuthenticated) dispatch(fetchCart()); }, [dispatch, isAuthenticated]);

  const activeItems = items.filter(i => !i.savedForLater);
  const savedItems  = items.filter(i => i.savedForLater);

  const discount = couponData
    ? couponData.type === 'PERCENTAGE'
      ? Math.min(totalAmount * couponData.discountValue / 100, couponData.maxDiscountAmount || Infinity)
      : couponData.discountValue || 0
    : 0;

  const shipping = (totalAmount - discount) >= 1000 ? 0 : 60;
  const grandTotal = totalAmount - discount + shipping;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await couponAPI.validate(couponCode.trim(), totalAmount);
      setCouponData(data.data);
      toast.success('Coupon applied! 🎉');
    } catch { setCouponData(null); }
    finally { setCouponLoading(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-app py-10">
        <EmptyState icon="🛒" title="Your cart is empty"
          message="Please login to view your cart and start shopping."
          actionLabel="Login" actionHref="/login" />
      </div>
    );
  }

  if (!loading && activeItems.length === 0 && savedItems.length === 0) {
    return (
      <div className="container-app py-10">
        <EmptyState icon="🛒" title="Your cart is empty"
          message="Looks like you haven't added anything yet. Start shopping!"
          actionLabel="Browse Products" actionHref="/products" />
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingBag size={24} /> Shopping Cart
        <span className="badge-gray ml-2">{activeItems.length} items</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─── CART ITEMS ─── */}
        <div className="lg:col-span-2 space-y-4">
          {activeItems.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <Link to={`/products/${item.product?.slug}`}
                    className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <img src={item.product?.images?.[0] || 'https://placehold.co/80x80?text=Img'}
                     alt={item.productName}
                     className="w-full h-full object-contain p-1"
                     onError={e => e.target.src = 'https://placehold.co/80x80?text=Img'} />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product?.slug}`}
                      className="font-medium text-gray-800 hover:text-primary-600 line-clamp-2 text-sm leading-snug">
                  {item.productName || item.product?.name}
                </Link>

                {(item.size || item.color) && (
                  <div className="flex gap-2 mt-1">
                    {item.size  && <span className="badge-gray text-[11px]">Size: {item.size}</span>}
                    {item.color && <span className="badge-gray text-[11px]">Color: {item.color}</span>}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 gap-4">
                  {/* Qty */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity - 1 }))}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40">
                      <Minus size={13} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity + 1 }))}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50">
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900">৳{((item.unitPrice || 0) * item.quantity).toLocaleString('en-BD')}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-400">৳{(item.unitPrice || 0).toLocaleString('en-BD')} each</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button onClick={() => dispatch(removeFromCart(item.id))}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Saved for Later */}
          {savedItems.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <BookmarkCheck size={18} className="text-primary-600" />
                Saved for Later ({savedItems.length})
              </h3>
              <div className="space-y-3">
                {savedItems.map(item => (
                  <div key={item.id} className="card p-4 flex gap-4 opacity-75">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.product?.images?.[0] || 'https://placehold.co/64x64?text=Img'}
                           alt="" className="w-full h-full object-contain p-1"
                           onError={e => e.target.src = 'https://placehold.co/64x64?text=Img'} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 line-clamp-1">{item.productName}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">৳{(item.unitPrice || 0).toLocaleString('en-BD')}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity }))}
                                className="text-xs text-primary-600 hover:underline font-medium">Move to Cart</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => dispatch(removeFromCart(item.id))}
                                className="text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── ORDER SUMMARY ─── */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-primary-600" /> Apply Coupon
            </h3>
            <div className="flex gap-2">
              <input
                className="input flex-1 text-sm uppercase"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && applyCoupon()}
              />
              <button onClick={applyCoupon} disabled={couponLoading}
                      className="btn-primary px-4 text-sm disabled:opacity-50">
                {couponLoading ? '...' : 'Apply'}
              </button>
            </div>
            {couponData && (
              <div className="mt-2 flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <span className="text-xs text-green-700 font-medium">
                  🎉 {couponCode} — Save ৳{discount.toLocaleString('en-BD')}
                </span>
                <button onClick={() => { setCouponData(null); setCouponCode(''); }}
                        className="text-xs text-gray-400 hover:text-red-500">Remove</button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({activeItems.length} items)</span>
                <span>৳{totalAmount.toLocaleString('en-BD')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-৳{discount.toLocaleString('en-BD')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0
                  ? <span className="text-green-600 font-medium">FREE</span>
                  : `৳${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg">
                  Add ৳{(1000 - totalAmount + discount).toFixed(0)} more for free shipping!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-gray-900">
                <span>Total</span>
                <span>৳{grandTotal.toLocaleString('en-BD')}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout', { state: { couponCode: couponData ? couponCode : null, discount, shipping, grandTotal } })}
                    disabled={activeItems.length === 0}
                    className="btn-primary w-full mt-5 py-3 text-sm font-semibold gap-2 disabled:opacity-50">
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <Link to="/products" className="block text-center text-sm text-primary-600 hover:underline mt-3">
              ← Continue Shopping
            </Link>
          </div>

          {/* Trust signals */}
          <div className="card p-4 space-y-2">
            {[['🔒', 'Secure checkout with SSL encryption'],
              ['🚚', 'Fast delivery across Bangladesh'],
              ['↩️', '7-day easy return policy']].map(([e, t]) => (
              <div key={t} className="flex items-center gap-2 text-xs text-gray-600">
                <span>{e}</span><span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
