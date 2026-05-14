// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useForm } from 'react-hook-form';
// import { Eye, EyeOff, Package } from 'lucide-react';
// import { loginUser } from '../store/slices/authSlice';

// export default function LoginPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { loading, error } = useSelector(s => s.auth);
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [showPwd, setShowPwd] = useState(false);
//   const from = location.state?.from || '/';

//   const onSubmit = async (data) => {
//     const res = await dispatch(loginUser({ username: data.email, password: data.password }));
//     if (res.meta.requestStatus === 'fulfilled') navigate(from, { replace: true });
//   };

//   return (
//     <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4">
//       <div className="w-full max-w-md">
//         <div className="card p-8 animate-fadeIn">
//           <div className="text-center mb-8">
//             <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
//               <Package size={28} className="text-white" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
//             <p className="text-gray-500 text-sm mt-1">Sign in to your ShopBD account</p>
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 border border-red-100">
//               ⚠️ {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="label">Email or Phone</label>
//               <input className={errors.email ? 'input-error' : 'input'} placeholder="your@email.com or 01XXXXXXXXX"
//                      {...register('email', { required: 'Email or phone is required' })} />
//               {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-1.5">
//                 <label className="label mb-0">Password</label>
//                 <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">Forgot password?</Link>
//               </div>
//               <div className="relative">
//                 <input className={`${errors.password ? 'input-error' : 'input'} pr-10`}
//                        type={showPwd ? 'text' : 'password'} placeholder="••••••••"
//                        {...register('password', { required: 'Password is required' })} />
//                 <button type="button" onClick={() => setShowPwd(v => !v)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//               {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//             </div>
//             <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60">
//               {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Signing in...</span> : 'Sign In'}
//             </button>
//           </form>

//           <div className="divider my-6">or</div>

//           <p className="text-center text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one free</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

























import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Package } from 'lucide-react';
import { loginUser, googleLogin } from '../store/slices/authSlice';
import { fetchCart } from '../store/slices/cartSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { loading, error } = useSelector(s => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPwd, setShowPwd] = useState(false);
  const from = location.state?.from || '/';

  // ❌ useEffect + initialize() সরিয়ে দেওয়া হয়েছে
  // ✅ App.js এ একবার initialize হয়েছে

  const onSubmit = async (data) => {
    const res = await dispatch(loginUser({
      username: data.email,
      password: data.password,
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      navigate(from, { replace: true });
    }
  };

  // ✅ শুধু prompt() — initialize() নয়
  const handleGoogleLogin = () => {
    if (!window.google || !process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      toast.error('Google login not configured.');
      return;
    }
    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          toast.error('Google popup blocked. Please allow popups or use email login.');
        }
      });
    } catch (e) {
      toast.error('Google login unavailable. Use email login.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your ShopBD account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5 border border-red-100">
              ⚠️ {error}
            </div>
          )}

          {/* Google Button — শুধু GOOGLE_CLIENT_ID থাকলে দেখাবে */}
          {process.env.REACT_APP_GOOGLE_CLIENT_ID && (
            <>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors mb-5 font-medium text-sm text-gray-700"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email or Phone</label>
              <input
                className={errors.email ? 'input-error' : 'input'}
                placeholder="your@email.com or 01XXXXXXXXX"
                {...register('email', { required: 'Email or phone is required' })}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  className={`${errors.password ? 'input-error' : 'input'} pr-10`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}