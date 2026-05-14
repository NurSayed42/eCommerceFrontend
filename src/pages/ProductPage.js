import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart, ShoppingCart, Zap, Share2, ChevronDown, ChevronUp,
  Truck, ShieldCheck, RefreshCw, Star, Plus, Minus, ImageIcon
} from 'lucide-react';
import { fetchProductDetail } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeWishlist } from '../store/slices/wishlistSlice';
import { reviewAPI } from '../services/api';
import StarRating from '../components/common/StarRating';
import Breadcrumb from '../components/common/Breadcrumb';
import PageLoader from '../components/common/PageLoader';
import ReviewForm from '../components/review/ReviewForm';
import toast from 'react-hot-toast';

export default function ProductPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading } = useSelector(s => s.products);
  const { isAuthenticated } = useSelector(s => s.auth);
  const { items: wishlistItems } = useSelector(s => s.wishlist);

  const [selectedImg, setSelectedImg]     = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize]   = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity]           = useState(1);
  const [reviews, setReviews]             = useState([]);
  const [activeTab, setActiveTab]         = useState('description');
  const [openFaq, setOpenFaq]             = useState(null);
  const [canReview, setCanReview]         = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expandedImages, setExpandedImages] = useState(null); // review image preview

  const isWishlisted = wishlistItems.some(w => w.product?.id === product?.id);

  useEffect(() => { dispatch(fetchProductDetail(slug)); }, [slug, dispatch]);

  const loadReviews = () => {
    if (product?.id) {
      reviewAPI.getProductReviews(product.id)
        .then(r => setReviews(r.data.data?.content || []))
        .catch(() => {});
    }
  };

  useEffect(() => { loadReviews(); }, [product?.id]);

  // Review দিতে পারবে কিনা check
  useEffect(() => {
    if (isAuthenticated && product?.id) {
      reviewAPI.canReview(product.id)
        .then(r => setCanReview(r.data.data?.canReview || false))
        .catch(() => setCanReview(false));
    }
  }, [isAuthenticated, product?.id]);

  if (loading || !product) return <PageLoader />;

  const images = product.images?.length
    ? product.images
    : ['https://placehold.co/500x500?text=No+Image'];

  const price = selectedVariant
    ? (product.salePrice || product.price) + (selectedVariant.additionalPrice || 0)
    : (product.salePrice || product.price);

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const sizes  = [...new Set(product.variants?.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(
    product.variants
      ?.filter(v => !selectedSize || v.size === selectedSize)
      .map(v => v.color).filter(Boolean)
  )];

  const handleVariantSelect = (size, color) => {
    const variant = product.variants?.find(v => v.size === size && v.color === color);
    setSelectedVariant(variant || null);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); navigate('/login'); return; }
    dispatch(addToCart({ productId: product.id, variantId: selectedVariant?.id || null, quantity }));
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { toast.error('Please login to continue'); navigate('/login'); return; }
    dispatch(addToCart({ productId: product.id, variantId: selectedVariant?.id || null, quantity }));
    navigate('/cart');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) { toast.error('Please login to save to wishlist'); navigate('/login'); return; }
    isWishlisted ? dispatch(removeWishlist(product.id)) : dispatch(addToWishlist(product.id));
  };

  const faq = (() => { try { return JSON.parse(product.faq || '[]'); } catch { return []; } })();

  // Review images parse
  const parseImages = (imgJson) => {
    try { return JSON.parse(imgJson || '[]'); } catch { return []; }
  };

  return (
    <div className="container-app py-4">
      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: product.categoryName || 'Products', href: `/products?categoryId=${product.categoryId}` },
        { label: product.name },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* ─── LEFT: Images ─── */}
        <div className="space-y-3">
          <div className="card overflow-hidden bg-gray-50">
            <div className="relative" style={{ paddingBottom: '100%' }}>
              <img src={images[selectedImg]} alt={product.name}
                   className="absolute inset-0 w-full h-full object-contain p-4"
                   onError={e => { e.target.src = 'https://placehold.co/500x500?text=No+Image'; }} />
              {hasDiscount && (
                <div className="absolute top-4 left-4 badge-red font-bold text-sm px-2 py-1">
                  -{product.discountPercent?.toFixed(0)}% OFF
                </div>
              )}
              <button className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50"
                      onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}>
                <Share2 size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImg ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover"
                       onError={e => { e.target.src = 'https://placehold.co/64x64?text=Img'; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── RIGHT: Details ─── */}
        <div className="space-y-5">
          {product.brand && <p className="text-sm font-medium text-primary-600">{product.brand}</p>}
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>
          <div className="flex items-center gap-3">
            <StarRating rating={product.avgRating} showValue />
            <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">{product.soldCount?.toLocaleString()} sold</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900">৳{price?.toLocaleString('en-BD')}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-400 line-through">৳{product.price?.toLocaleString('en-BD')}</span>
                <span className="badge-red font-bold px-2 py-0.5">Save ৳{(product.price - price).toLocaleString('en-BD')}</span>
              </>
            )}
          </div>
          {product.shortDescription && <p className="text-gray-600 text-sm leading-relaxed">{product.shortDescription}</p>}

          {sizes.length > 0 && (
            <div>
              <p className="label">Size: <span className="font-semibold">{selectedSize || 'Select'}</span></p>
              <div className="flex flex-wrap gap-2 mt-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => { setSelectedSize(s); handleVariantSelect(s, selectedColor); }}
                          className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all ${selectedSize === s ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {colors.length > 0 && (
            <div>
              <p className="label">Color: <span className="font-semibold">{selectedColor || 'Select'}</span></p>
              <div className="flex flex-wrap gap-2 mt-2">
                {colors.map(c => {
                  const variant = product.variants?.find(v => v.color === c);
                  return (
                    <button key={c} onClick={() => { setSelectedColor(c); handleVariantSelect(selectedSize, c); }}
                            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border-2 font-medium transition-all ${selectedColor === c ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      {variant?.colorCode && <span className="w-4 h-4 rounded-full border border-gray-300" style={{ background: variant.colorCode }} />}
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="label">Quantity</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-sm">
                {product.stock > 0
                  ? <span className="text-green-600 font-medium">{product.stock <= 10 ? `Only ${product.stock} left!` : 'In Stock'}</span>
                  : <span className="text-red-500 font-medium">Out of Stock</span>
                }
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
                    className="btn-outline flex-1 py-3 text-sm font-semibold gap-2 disabled:opacity-50">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0}
                    className="btn-primary flex-1 py-3 text-sm font-semibold gap-2 disabled:opacity-50">
              <Zap size={18} /> Buy Now
            </button>
            <button onClick={handleWishlist}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${isWishlisted ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}>
              <Heart size={20} className={isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Truck size={16} />, text: product.deliveryInfo || '3-5 Days Delivery' },
              { icon: <ShieldCheck size={16} />, text: 'Secure Payment' },
              { icon: <RefreshCw size={16} />, text: product.returnPolicy || '7 Days Return' },
            ].map(f => (
              <div key={f.text} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center">
                <span className="text-primary-600">{f.icon}</span>
                <span className="text-[11px] text-gray-600 leading-tight">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="mt-10">
        <div className="flex gap-1 border-b border-gray-200">
          {[
            ['description', 'Description'],
            ['reviews', `Reviews (${reviews.length})`],
            ['faq', 'FAQ'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
                    className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {/* Description */}
          {activeTab === 'description' && (
            <div className="prose max-w-none text-gray-600 text-sm leading-relaxed"
                 dangerouslySetInnerHTML={{ __html: product.description?.replace(/\n/g, '<br/>') || 'No description available.' }} />
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">

              {/* ─── Review Form ─── */}
              {isAuthenticated && canReview && !showReviewForm && (
                <button onClick={() => setShowReviewForm(true)}
                        className="w-full py-3 border-2 border-dashed border-primary-300 rounded-xl text-primary-600 font-medium text-sm hover:bg-primary-50 transition-colors flex items-center justify-center gap-2">
                  <Star size={18} /> Write a Review for this Product
                </button>
              )}

              {isAuthenticated && canReview && showReviewForm && (
                <ReviewForm
                  productId={product.id}
                  onSuccess={() => {
                    setShowReviewForm(false);
                    setCanReview(false); // already reviewed
                    loadReviews();
                    setActiveTab('reviews');
                  }}
                />
              )}

              {/* Not eligible message */}
              {isAuthenticated && !canReview && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-700 flex items-start gap-2">
                  <span className="text-lg">ℹ️</span>
                  <div>
                    <p className="font-medium">Purchase required to review</p>
                    <p className="text-xs mt-0.5 text-amber-600">
                      Only customers who have received a delivered order for this product can leave a review.
                    </p>
                  </div>
                </div>
              )}

              {!isAuthenticated && (
                <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 text-center">
                  <button onClick={() => navigate('/login')}
                          className="text-primary-600 font-semibold hover:underline">
                    Sign in
                  </button>{' '}
                  to write a review (purchase required)
                </div>
              )}

              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="card p-4 flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-gray-900">
                      {product.avgRating?.toFixed(1) || '0.0'}
                    </div>
                    <StarRating rating={product.avgRating} size={14} />
                    <p className="text-xs text-gray-400 mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-4 text-gray-500">{star}</span>
                          <Star size={10} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full transition-all"
                                 style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-6 text-right text-gray-400">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Review List */}
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Star size={40} className="mx-auto mb-3 text-gray-200" />
                  <p className="font-medium">No reviews yet</p>
                  <p className="text-sm">Be the first to review this product!</p>
                </div>
              ) : reviews.map(r => {
                const reviewImgs = parseImages(r.images);
                return (
                  <div key={r.id} className="card p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 text-sm font-bold">
                            {r.user?.fullName?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{r.user?.fullName || 'Anonymous'}</span>
                            {r.verifiedPurchase && (
                              <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded-full font-medium">
                                ✓ Verified Purchase
                              </span>
                            )}
                          </div>
                          <StarRating rating={r.rating} size={12} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString('en-BD')}
                      </span>
                    </div>

                    {r.title && <p className="font-semibold text-sm text-gray-800">{r.title}</p>}
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>

                    {/* Review Images */}
                    {reviewImgs.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {reviewImgs.map((imgUrl, i) => (
                          <button key={i} onClick={() => setExpandedImages({ images: reviewImgs, index: i })}
                                  className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover"
                                 onError={e => { e.target.src = 'https://placehold.co/64?text=Img'; }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faq.length === 0 ? (
                <p className="text-gray-500 text-sm">No FAQ available.</p>
              ) : faq.map((item, i) => (
                <div key={i} className="card overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex justify-between items-center p-4 text-left">
                    <span className="font-medium text-sm text-gray-800">{item.question}</span>
                    {openFaq === i
                      ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0" />
                      : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Image Lightbox ─── */}
      {expandedImages && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
             onClick={() => setExpandedImages(null)}>
          <button className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                  onClick={() => setExpandedImages(null)}>✕</button>
          <img src={expandedImages.images[expandedImages.index]} alt=""
               className="max-w-full max-h-[90vh] object-contain rounded-lg"
               onClick={e => e.stopPropagation()} />
          <div className="absolute bottom-4 flex gap-2">
            {expandedImages.images.map((img, i) => (
              <button key={i}
                      onClick={e => { e.stopPropagation(); setExpandedImages(p => ({...p, index: i})); }}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 ${i === expandedImages.index ? 'border-white' : 'border-transparent opacity-60'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}