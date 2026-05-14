import React, { useEffect, lazy, Suspense, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import store from './store';
import { fetchProfile, googleLogin } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageLoader from './components/common/PageLoader';
import ScrollToTop from './components/common/ScrollToTop';

const HomePage        = lazy(() => import('./pages/HomePage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductPage     = lazy(() => import('./pages/ProductPage'));
const CartPage        = lazy(() => import('./pages/CartPage'));
const CheckoutPage    = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccess    = lazy(() => import('./pages/OrderSuccess'));
const OrdersPage      = lazy(() => import('./pages/OrdersPage'));
const OrderDetail     = lazy(() => import('./pages/OrderDetail'));
const LoginPage       = lazy(() => import('./pages/LoginPage'));
const RegisterPage    = lazy(() => import('./pages/RegisterPage'));
const ForgotPassword  = lazy(() => import('./pages/ForgotPassword'));
const AccountPage     = lazy(() => import('./pages/AccountPage'));
const WishlistPage    = lazy(() => import('./pages/WishlistPage'));
const SearchPage      = lazy(() => import('./pages/SearchPage'));
const NotFound        = lazy(() => import('./pages/NotFound'));

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

// ── Google OAuth একবারই globally initialize ──────────────
let googleInitialized = false;

export function initGoogleAuth(callback) {
  if (!window.google || !GOOGLE_CLIENT_ID || googleInitialized) return;
  googleInitialized = true;

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback,
    cancel_on_tap_outside: false,
  });
}

// ── Protected / Guest Routes ──────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

// ── App Content ───────────────────────────────────────────
function AppContent() {
  const dispatch = useDispatch();

  // On mount: restore session + initialize Google once
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      dispatch(fetchCart()).catch(() => {});
      dispatch(fetchProfile()).catch(() => {});
    }

    // Load Google script if not loaded
    if (GOOGLE_CLIENT_ID && !window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleAuth((response) => {
          dispatch(googleLogin(response.credential)).then(res => {
            if (res.meta.requestStatus === 'fulfilled') {
              dispatch(fetchCart());
              dispatch(fetchWishlist());
            }
          });
        });
      };
      document.head.appendChild(script);
    } else if (window.google && GOOGLE_CLIENT_ID) {
      initGoogleAuth((response) => {
        dispatch(googleLogin(response.credential)).then(res => {
          if (res.meta.requestStatus === 'fulfilled') {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
          }
        });
      });
    }
  }, [dispatch]);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/"                element={<HomePage />} />
              <Route path="/products"        element={<ProductListPage />} />
              <Route path="/products/:slug"  element={<ProductPage />} />
              <Route path="/search"          element={<SearchPage />} />
              <Route path="/cart"            element={<CartPage />} />

              {/* Auth */}
              <Route path="/login"
                element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/register"
                element={<GuestRoute><RegisterPage /></GuestRoute>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected */}
              <Route path="/checkout"
                element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/order/success/:orderNumber"
                element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path="/orders"
                element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders/:orderNumber"
                element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
              <Route path="/account/*"
                element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
              <Route path="/wishlist"
                element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>

      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
            fontWeight: '500',
            borderRadius: '10px',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>
    </Provider>
  );
}