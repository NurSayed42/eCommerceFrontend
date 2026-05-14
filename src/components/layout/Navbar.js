import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { ShoppingCart, Heart, Search, User, Menu, X, ChevronDown, Package } from 'lucide-react';
import { categoryAPI } from '../../services/api';

// localStorage থেকে safely user load করে
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { count: cartCount } = useSelector((s) => s.cart);
  const { items: wishlistItems } = useSelector((s) => s.wishlist);

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.data || [])).catch(() => { });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // Redux user না থাকলে localStorage থেকে নাও
  const storedUser = getStoredUser();
  const displayName = user?.fullName || storedUser?.fullName || '';
  const displayEmail = user?.email || storedUser?.email || '';
  const avatarLetter = displayName.charAt(0).toUpperCase() || 'U';
  const firstName = displayName.split(' ')[0] || 'Account';

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'} bg-white`}>

      {/* ─── TOP BAR ─── */}
      <div className="bg-primary-600 text-white text-xs py-1.5 text-center hidden md:block">
        🚚 Free shipping on orders over ৳1000 | 📞 01700-000000 | COD Available Nationwide
      </div>

      {/* ─── MAIN NAVBAR ─── */}
      <div className="container-app">
        <div className="flex items-center gap-4 py-3">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Package size={18} className="text-white" />
              </div>
              <span className="text-xl font-black text-gray-900">Shop<span className="text-primary-600">BD</span></span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 hidden md:flex max-w-2xl">
            <div className="flex w-full rounded-xl border border-gray-200 overflow-hidden focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
              <select className="px-3 py-2.5 text-sm bg-gray-50 border-r border-gray-200 text-gray-600 focus:outline-none">
                <option value="">All</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
              />
              <button type="submit" className="px-5 bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Heart size={20} className="text-gray-600" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ShoppingCart size={20} className="text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scaleIn">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(v => !v)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {avatarLetter}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {firstName}
                  </span>
                  <ChevronDown size={14} className="text-gray-400 hidden lg:block" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-scaleIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                      <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                    </div>
                    <Link to="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={15} /> My Account
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <Package size={15} /> My Orders
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <Heart size={15} /> Wishlist
                    </Link>
                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={() => { dispatch(logout()); navigate('/'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2.5 rounded-lg hover:bg-gray-100"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ─── CATEGORY NAV ─── */}
        <nav className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
          <Link to="/products" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg whitespace-nowrap transition-colors">
            All Products
          </Link>
          {categories.slice(0, 8).map(cat => (
            <Link
              key={cat.id}
              to={`/products?categoryId=${cat.id}`}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg whitespace-nowrap transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          <Link to="/products?flashSale=true" className="px-3 py-1.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg whitespace-nowrap">
            ⚡ Flash Sale
          </Link>
        </nav>
      </div>

      {/* ─── MOBILE MENU ─── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 animate-fadeIn">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="input flex-1 text-sm"
            />
            <button type="submit" className="btn-primary py-2 px-4"><Search size={16} /></button>
          </form>

          {!isAuthenticated && (
            <div className="flex gap-2">
              <Link to="/login" className="btn-outline flex-1 text-sm justify-center">Login</Link>
              <Link to="/register" className="btn-primary flex-1 text-sm justify-center">Register</Link>
            </div>
          )}

          <div className="space-y-1">
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?categoryId=${cat.id}`}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}