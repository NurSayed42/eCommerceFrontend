// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { useForm } from 'react-hook-form';
// import { Eye, EyeOff } from 'lucide-react';
// import { registerUser } from '../store/slices/authSlice';
// import { authAPI } from '../services/api';
// import toast from 'react-hot-toast';

// export default function RegisterPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector(s => s.auth);
//   const { register, handleSubmit, watch, formState: { errors } } = useForm();
//   const [showPwd, setShowPwd] = useState(false);
//   const [step, setStep] = useState(1);
//   const [identifier, setIdentifier] = useState('');
//   const [otp, setOtp] = useState('');
//   const [verifying, setVerifying] = useState(false);

//   const onSubmit = async (data) => {
//     const res = await dispatch(registerUser({ fullName: data.fullName, email: data.email, phone: data.phone, password: data.password }));
//     if (res.meta.requestStatus === 'fulfilled') {
//       setIdentifier(data.email || data.phone);
//       setStep(2);
//     }
//   };

//   const verifyOtp = async () => {
//     setVerifying(true);
//     try {
//       await authAPI.verifyOtp({ identifier, otp });
//       toast.success('Account verified! Please login.');
//       navigate('/login');
//     } catch { toast.error('Invalid OTP. Try again.'); }
//     finally { setVerifying(false); }
//   };

//   if (step === 2) return (
//     <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4">
//       <div className="card p-8 w-full max-w-md text-center animate-fadeIn">
//         <div className="text-5xl mb-4">📧</div>
//         <h2 className="text-xl font-bold mb-2">Verify Your Account</h2>
//         <p className="text-sm text-gray-500 mb-6">We've sent a 6-digit OTP to <strong>{identifier}</strong></p>
//         <input className="input text-center text-2xl tracking-widest font-bold mb-4" maxLength={6}
//                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))} placeholder="000000" />
//         <button onClick={verifyOtp} disabled={otp.length !== 6 || verifying} className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60">
//           {verifying ? 'Verifying...' : 'Verify OTP'}
//         </button>
//         <button onClick={() => dispatch(registerUser({}))} className="text-sm text-primary-600 hover:underline mt-3 block mx-auto">Resend OTP</button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4">
//       <div className="w-full max-w-md">
//         <div className="card p-8 animate-fadeIn">
//           <div className="text-center mb-8">
//             <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
//             <p className="text-gray-500 text-sm mt-1">Join ShopBD for the best deals</p>
//           </div>
//           {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">⚠️ {error}</div>}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="label">Full Name *</label>
//               <input className={errors.fullName ? 'input-error' : 'input'} placeholder="Your full name"
//                      {...register('fullName', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} />
//               {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
//             </div>
//             <div>
//               <label className="label">Email Address</label>
//               <input className="input" type="email" placeholder="your@email.com" {...register('email')} />
//             </div>
//             <div>
//               <label className="label">Phone Number</label>
//               <input className="input" placeholder="01XXXXXXXXX" {...register('phone')} />
//               <p className="text-xs text-gray-400 mt-1">At least one of email or phone is required</p>
//             </div>
//             <div>
//               <label className="label">Password *</label>
//               <div className="relative">
//                 <input className={`${errors.password ? 'input-error' : 'input'} pr-10`}
//                        type={showPwd ? 'text' : 'password'} placeholder="Min 6 characters"
//                        {...register('password', { required: true, minLength: { value: 6, message: 'Min 6 characters' } })} />
//                 <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
//                   {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//               {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//             </div>
//             <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60">
//               {loading ? 'Creating Account...' : 'Create Account'}
//             </button>
//           </form>
//           <p className="text-center text-sm text-gray-600 mt-6">
//             Already have an account?{' '}
//             <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../store/slices/authSlice';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPwd, setShowPwd]     = useState(false);
  const [step, setStep]           = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp]             = useState('');
  const [verifying, setVerifying] = useState(false);

  // ❌ useEffect + initialize() সরিয়ে দেওয়া হয়েছে
  // ✅ App.js এ একবার initialize হয়েছে

  const onSubmit = async (data) => {
    const res = await dispatch(registerUser({
      fullName: data.fullName,
      email:    data.email,
      phone:    data.phone,
      password: data.password,
    }));
    if (res.meta.requestStatus === 'fulfilled') {
      setIdentifier(data.email || data.phone);
      setStep(2);
      toast.success('OTP sent! Check your email.');
    }
  };

  const verifyOtp = async () => {
    setVerifying(true);
    try {
      await authAPI.verifyOtp({ identifier, otp });
      toast.success('Account verified! Please login.');
      navigate('/login');
    } catch {
      toast.error('Invalid OTP. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  // ✅ শুধু prompt() — initialize() নয়
  const handleGoogleSignup = () => {
    if (!window.google || !process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      toast.error('Google signup not configured.');
      return;
    }
    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          toast.error('Google popup blocked. Please use email registration.');
        }
      });
    } catch (e) {
      toast.error('Google signup unavailable. Use email registration.');
    }
  };

  if (step === 2) return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4">
      <div className="card p-8 w-full max-w-md text-center animate-fadeIn">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold mb-2">Verify Your Account</h2>
        <p className="text-sm text-gray-500 mb-6">
          We've sent a 6-digit OTP to <strong>{identifier}</strong>
        </p>
        <input
          className="input text-center text-2xl tracking-widest font-bold mb-4"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
        />
        <button
          onClick={verifyOtp}
          disabled={otp.length !== 6 || verifying}
          className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60"
        >
          {verifying ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button
          onClick={() => authAPI.sendVerificationOtp(identifier)
            .then(() => toast.success('OTP resent!'))}
          className="text-sm text-primary-600 hover:underline mt-3 block mx-auto"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-fadeIn">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join ShopBD for the best deals</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              ⚠️ {error}
            </div>
          )}

          {process.env.REACT_APP_GOOGLE_CLIENT_ID && (
            <>
              <button
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors mb-5 font-medium text-sm text-gray-700"
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
                </svg>
                Sign up with Google
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
              <label className="label">Full Name *</label>
              <input
                className={errors.fullName ? 'input-error' : 'input'}
                placeholder="Your full name"
                {...register('fullName', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Min 2 characters' },
                })}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="your@email.com" {...register('email')} />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input className="input" placeholder="01XXXXXXXXX" {...register('phone')} />
              <p className="text-xs text-gray-400 mt-1">At least one of email or phone is required</p>
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input
                  className={`${errors.password ? 'input-error' : 'input'} pr-10`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  {...register('password', {
                    required: true,
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}