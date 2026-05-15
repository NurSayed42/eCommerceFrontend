// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
// import { addToCart } from '../../store/slices/cartSlice';
// import { addToWishlist, removeWishlist } from '../../store/slices/wishlistSlice';

// export default function ProductCard({ product }) {
//   const dispatch = useDispatch();
//   const { items: wishlistItems } = useSelector(s => s.wishlist);
//   const { isAuthenticated } = useSelector(s => s.auth);
//   const isWishlisted = wishlistItems.some(w => w.product?.id === product.id);

//   const handleCart = (e) => {
//     e.preventDefault();
//     dispatch(addToCart({ productId: product.id, quantity: 1 }));
//   };

//   const handleWishlist = (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) { window.location.href = '/login'; return; }
//     if (isWishlisted) dispatch(removeWishlist(product.id));
//     else dispatch(addToWishlist(product.id));
//   };

//   const img = product.images?.[0] || 'https://placehold.co/300x300?text=No+Image';
//   const price = product.salePrice || product.price;
//   const hasDiscount = product.salePrice && product.salePrice < product.price;

//   return (
//     <Link to={`/products/${product.slug}`} className="product-card block">
//       {/* Image */}
//       <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: '100%' }}>
//         <img
//           src={img}
//           alt={product.name}
//           className="product-card-img absolute inset-0 w-full h-full object-cover"
//           loading="lazy"
//           onError={e => { e.target.src = 'https://placehold.coNo+Image'; }}
//         />

//         {/* Badges */}
//         <div className="absolute top-2 left-2 flex flex-col gap-1">
//           {product.flashSale && (
//             <span className="badge-red text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-0.5">
//               <Zap size={9} />FLASH
//             </span>
//           )}
//           {hasDiscount && (
//             <span className="badge bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5">
//               -{product.discountPercent?.toFixed(0)}%
//             </span>
//           )}
//           {product.stock === 0 && (
//             <span className="badge bg-gray-500 text-white text-[10px]">Out of Stock</span>
//           )}
//         </div>

//         {/* Wishlist btn */}
//         <button
//           onClick={handleWishlist}
//           className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-50'}`}
//         >
//           <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
//         </button>

//         {/* Quick add to cart */}
//         <button
//           onClick={handleCart}
//           disabled={product.stock === 0}
//           className="absolute bottom-2 left-2 right-2 btn-primary py-1.5 text-xs opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 disabled:opacity-50"
//         >
//           <ShoppingCart size={13} /> Add to Cart
//         </button>
//       </div>

//       {/* Info */}
//       <div className="p-3">
//         <p className="text-xs text-primary-600 font-medium mb-0.5">{product.brand || product.categoryName}</p>
//         <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 leading-snug">{product.name}</h3>

//         {/* Rating */}
//         {product.reviewCount > 0 && (
//           <div className="flex items-center gap-1 mb-2">
//             <div className="flex">
//               {[1,2,3,4,5].map(s => (
//                 <Star key={s} size={11} className={s <= Math.round(product.avgRating) ? 'star-filled fill-current' : 'star-empty'} />
//               ))}
//             </div>
//             <span className="text-xs text-gray-400">({product.reviewCount})</span>
//           </div>
//         )}

//         {/* Price */}
//         <div className="flex items-baseline gap-2">
//           <span className="text-base font-bold text-gray-900">৳{price?.toLocaleString('en-BD')}</span>
//           {hasDiscount && (
//             <span className="text-xs text-gray-400 line-through">৳{product.price?.toLocaleString('en-BD')}</span>
//           )}
//         </div>

//         {/* Stock indicator */}
//         {product.stock > 0 && product.stock <= 10 && (
//           <p className="text-[11px] text-orange-500 mt-1">Only {product.stock} left!</p>
//         )}
//       </div>
//     </Link>
//   );
// }





import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

// images field টা string হলে parse করো, array হলে সরাসরি নাও
const parseImages = (imgs) => {
  if (!imgs) return [];
  if (Array.isArray(imgs)) return imgs;
  try { return JSON.parse(imgs); } catch { return []; }
};

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector(s => s.wishlist);
  const { isAuthenticated } = useSelector(s => s.auth);
  const isWishlisted = wishlistItems.some(
    w => (w.product?.id ?? w.productId) === product.id
  );

  const handleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    toast.success('Added to cart!');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { window.location.href = '/login'; return; }
    if (isWishlisted) {
      dispatch(removeWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product.id));
      toast.success('Added to wishlist ❤️');
    }
  };

  const images = parseImages(product.images);
  const img = images[0] || 'https://placehold.co/300x300?text=No+Image';
  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  return (
    <Link to={`/products/${product.slug}`} className="product-card block group">
      {/* ── Image Area ── */}
      <div className="relative overflow-hidden bg-gray-50" style={{ paddingBottom: '100%' }}>
        <img
          src={img}
          alt={product.name}
          className="product-card-img absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={e => { e.target.src = 'https://placehold.co/300x300?text=No+Image'; }}
        />

        {/* Badges — top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.flashSale && (
            <span className="badge-red text-[10px] font-bold px-1.5 py-0.5 flex items-center gap-0.5">
              <Zap size={9} /> FLASH
            </span>
          )}
          {hasDiscount && (
            <span className="badge bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5">
              -{product.discountPercent?.toFixed(0)}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-gray-500 text-white text-[10px]">Out of Stock</span>
          )}
        </div>

        {/* ── Heart / Wishlist btn — সবসময় দেখা যাবে ── */}
        <button
          onClick={handleWishlist}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10
            ${isWishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white text-gray-400 hover:bg-red-50 hover:text-red-500'
            }`}
        >
          <Heart
            size={14}
            fill={isWishlisted ? 'currentColor' : 'none'}
            className="transition-all duration-200"
          />
        </button>

        {/* Quick Add to Cart — hover এ দেখা যাবে */}
        <button
          onClick={handleCart}
          disabled={product.stock === 0}
          className="absolute bottom-2 left-2 right-2 btn-primary py-1.5 text-xs
                     opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0
                     transition-all duration-200 disabled:opacity-50 z-10"
        >
          <ShoppingCart size={13} /> Add to Cart
        </button>
      </div>

      {/* ── Info Area ── */}
      <div className="p-3">
        <p className="text-xs text-primary-600 font-medium mb-0.5 truncate">
          {product.brand || product.categoryName}
        </p>
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 leading-snug">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  size={11}
                  className={s <= Math.round(product.avgRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200 fill-gray-200'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900">
            ৳{price?.toLocaleString('en-BD')}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ৳{product.price?.toLocaleString('en-BD')}
            </span>
          )}
        </div>

        {/* Low stock warning */}
        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-[11px] text-orange-500 mt-1 font-medium">
            Only {product.stock} left!
          </p>
        )}
      </div>
    </Link>
  );
}
