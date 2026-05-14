import React, { useState, useRef, useEffect } from 'react';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

// type = 'verify' (email verification) | 'reset' (password reset)
export default function OtpModal({ email, type = 'verify', onSuccess, onClose }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
    const t = setInterval(() => setResendTimer(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0)
      inputs.current[idx - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      // type অনুযায়ী আলাদা API call
      if (type === 'verify') {
        await authAPI.verifyOtp({ identifier: email, otp: code });
        toast.success('Email verified successfully! ✅');
      }
      onSuccess(code);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP. Try again.');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      // Resend এ সবসময় verification OTP পাঠাও — password reset না
      await authAPI.sendVerificationOtp(email);
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      toast.success('New OTP sent to your email!');
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl relative animate-fadeIn">

        {/* Close button */}
        <button onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-lg">
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📧</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Verify your email</h2>
          <p className="text-sm text-gray-500 mt-2">
            We sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-1">{email}</p>
          <p className="text-xs text-gray-400 mt-2">
            Please verify your email to place the order.
          </p>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e.target.value, i)}
                onKeyDown={e => handleKeyDown(e, i)}
                className={`w-11 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
                  digit ? 'border-primary-500 bg-primary-50' : 'border-gray-200 focus:border-primary-400'
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full btn-primary py-3 text-sm font-semibold disabled:opacity-50"
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
                  Verifying...
                </span>
              : 'Verify & Place Order'
            }
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400 mb-1">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-sm font-medium text-primary-600 disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
          >
            {resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : 'Resend verification code'
            }
          </button>
        </div>

        {/* Info */}
        <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-xs text-amber-700 text-center">
            ⚠️ Email verification is required to place orders for your account security.
          </p>
        </div>
      </div>
    </div>
  );
}