import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { fetchWishlist, removeWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import { ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.wishlist);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  // API response এ product field different হতে পারে — normalize করো
  const getProduct = (item) => item.product || item;

  const handleRemove = (productId) => {
    dispatch(removeWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (loading) return (
    <div className="container-app py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="skeleton h-48 rounded-t-xl" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container-app py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart size={24} className="text-red-500 fill-red-500" />
        My Wishlist
        <span className="text-sm font-normal text-gray-400 ml-1">({items.length} items)</span>
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="Your wishlist is empty"
          message="Save products you love by clicking the heart icon."
          actionLabel="Browse Products"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(item => {
            const p = getProduct(item);
            if (!p || !p.id) return null;

            const price = p.salePrice || p.price || 0;
            const hasDiscount = p.salePrice && p.salePrice < p.price;
            const image = p.images?.[0] || p.image || 'https://placehold.co/200?text=No+Image';

            return (
              <div key={item.id || p.id} className="card group overflow-hidden">
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-50">
                  <Link to={`/products/${p.slug}`}>
                    <img src={image} alt={p.name}
                         className="w-full h-44 object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                         onError={e => { e.target.src = 'https://placehold.co/200?text=Img'; }} />
                  </Link>
                  {hasDiscount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      -{p.discountPercent?.toFixed(0)}%
                    </span>
                  )}
                  {/* Remove button */}
                  <button onClick={() => handleRemove(p.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 space-y-2">
                  <Link to={`/products/${p.slug}`}>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug hover:text-primary-600">
                      {p.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">৳{price?.toLocaleString('en-BD')}</span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        ৳{p.price?.toLocaleString('en-BD')}
                      </span>
                    )}
                  </div>

                  <button onClick={() => handleAddToCart(p.id)}
                          disabled={p.stock === 0}
                          className="w-full btn-primary py-2 text-xs font-medium gap-1.5 disabled:opacity-50">
                    <ShoppingCart size={14} />
                    {p.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}