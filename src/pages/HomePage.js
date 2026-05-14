import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { Zap, TrendingUp, Star, ChevronRight, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import { fetchBanners, fetchFeatured, fetchFlashSale, fetchTrending, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/common/ProductCard';
import ProductCardSkeleton from '../components/common/ProductCardSkeleton';
import CountdownTimer from '../components/home/CountdownTimer';

const HERO_SETTINGS = {
  dots: true, infinite: true, speed: 600, slidesToShow: 1, slidesToScroll: 1,
  autoplay: true, autoplaySpeed: 5000, pauseOnHover: true, arrows: false,
};

const PRODUCT_SETTINGS = {
  dots: false, infinite: false, speed: 400,
  slidesToShow: 5, slidesToScroll: 2, arrows: true,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 4 } },
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768,  settings: { slidesToShow: 2 } },
    { breakpoint: 480,  settings: { slidesToShow: 2, slidesToScroll: 1 } },
  ],
};

const FEATURES = [
  { icon: <Truck size={22} />, title: 'Fast Delivery', desc: '2-5 working days nationwide' },
  { icon: <ShieldCheck size={22} />, title: '100% Secure', desc: 'SSL & trusted payment gateway' },
  { icon: <RefreshCw size={22} />, title: 'Easy Return', desc: '7-day hassle-free returns' },
  { icon: <Headphones size={22} />, title: '24/7 Support', desc: 'Dedicated customer service' },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { banners, categories, featured, flashSale, trending } = useSelector(s => s.products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dispatch(fetchBanners()),
      dispatch(fetchCategories()),
      dispatch(fetchFeatured()),
      dispatch(fetchFlashSale()),
      dispatch(fetchTrending()),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  const flashSaleEnd = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours from now

  return (
    <div className="pb-16">

      {/* ═══ HERO BANNER ═══ */}
      <section className="bg-gray-100">
        {banners.length > 0 ? (
          <Slider {...HERO_SETTINGS}>
            {banners.map(b => (
              <div key={b.id}>
                <a href={b.linkUrl || '#'}>
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full object-cover"
                    style={{ maxHeight: '480px' }}
                    onError={e => e.target.style.display = 'none'}
                  />
                </a>
              </div>
            ))}
          </Slider>
        ) : (
          /* Fallback hero */
          <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-red-800 text-white">
            <div className="container-app py-20 relative z-10">
              <div className="max-w-xl">
                <span className="badge bg-white/20 text-white text-sm px-3 py-1 mb-4 inline-block">🔥 Flash Sale Live Now</span>
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  Shop Smart,<br />Save Big in Bangladesh
                </h1>
                <p className="text-lg text-primary-100 mb-8">Up to 70% off on thousands of products. Free delivery on orders above ৳1000.</p>
                <div className="flex gap-3">
                  <Link to="/products" className="btn bg-white text-primary-700 hover:bg-gray-100 font-semibold px-6 py-3">
                    Shop Now
                  </Link>
                  <Link to="/products?flashSale=true" className="btn border border-white/50 text-white hover:bg-white/10 px-6 py-3">
                    View Deals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ═══ FEATURES BAR ═══ */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-app py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="container-app mt-10">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            All Categories <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {loading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="skeleton w-16 h-16 rounded-2xl" />
                  <div className="skeleton h-3 w-14 rounded" />
                </div>
              ))
            : categories.slice(0, 8).map(cat => (
                <Link key={cat.id} to={`/products?categoryId=${cat.id}`}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain" />
                      : <span className="text-2xl">{getCategoryEmoji(cat.name)}</span>
                    }
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
                </Link>
              ))
          }
        </div>
      </section>

      {/* ═══ FLASH SALE ═══ */}
      {(flashSale.length > 0 || loading) && (
        <section className="mt-12">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 py-1" />
          <div className="bg-red-50 py-6">
            <div className="container-app">
              <div className="section-header">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-primary-600 text-white px-3 py-1.5 rounded-lg">
                    <Zap size={16} className="animate-pulse" />
                    <span className="font-bold text-sm">FLASH SALE</span>
                  </div>
                  <CountdownTimer targetDate={flashSaleEnd} />
                </div>
                <Link to="/products?flashSale=true" className="text-sm text-primary-600 font-medium flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </Link>
              </div>
              <Slider {...PRODUCT_SETTINGS}>
                {loading
                  ? Array(5).fill(0).map((_, i) => <div key={i} className="px-2"><ProductCardSkeleton /></div>)
                  : flashSale.map(p => <div key={p.id} className="px-2"><ProductCard product={p} /></div>)
                }
              </Slider>
            </div>
          </div>
        </section>
      )}

      {/* ═══ FEATURED PRODUCTS ═══ */}
      <section className="container-app mt-12">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <Star size={20} className="text-yellow-500 fill-yellow-500" />
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link to="/products?featured=true" className="text-sm text-primary-600 font-medium flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading
            ? Array(10).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.slice(0, 10).map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* ═══ BANNER AD ═══ */}
      <section className="container-app mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white min-h-[160px] flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-blue-200">New Arrivals</p>
              <h3 className="text-2xl font-bold mt-1">Electronics Sale</h3>
              <p className="text-blue-200 text-sm mt-2">Up to 40% off on gadgets</p>
            </div>
            <Link to="/products?categoryId=1" className="btn bg-white text-blue-700 text-sm py-2 px-4 self-start mt-4">
              Shop Now
            </Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white min-h-[160px] flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-200">Best Deals</p>
              <h3 className="text-2xl font-bold mt-1">Fashion Week</h3>
              <p className="text-emerald-200 text-sm mt-2">Trendy styles, great prices</p>
            </div>
            <Link to="/products?categoryId=2" className="btn bg-white text-emerald-700 text-sm py-2 px-4 self-start mt-4">
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TRENDING ═══ */}
      <section className="container-app mt-12">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-600" />
            <h2 className="section-title">Trending Now</h2>
          </div>
          <Link to="/products?trending=true" className="text-sm text-primary-600 font-medium flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <Slider {...PRODUCT_SETTINGS}>
            {trending.map(p => <div key={p.id} className="px-2"><ProductCard product={p} /></div>)}
          </Slider>
        )}
      </section>
    </div>
  );
}

function getCategoryEmoji(name) {
  const map = { Electronics:'📱', Fashion:'👗', Home:'🏠', Sports:'⚽', Books:'📚', Beauty:'💄', Toys:'🧸', Food:'🍎', Auto:'🚗', Health:'💊' };
  return Object.entries(map).find(([k]) => name?.toLowerCase().includes(k.toLowerCase()))?.[1] || '🛍️';
}
