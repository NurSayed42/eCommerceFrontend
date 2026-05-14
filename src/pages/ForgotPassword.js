import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!identifier.trim()) return;
    setLoading(true);
    try { await authAPI.forgotPassword(identifier); toast.success('OTP sent!'); setStep(2); }
    catch { toast.error('Account not found'); }
    finally { setLoading(false); }
  };

  const resetPwd = async () => {
    if (!otp || !newPassword) return;
    setLoading(true);
    try { await authAPI.resetPassword(identifier, otp, newPassword); toast.success('Password reset!'); setStep(3); }
    catch { toast.error('Invalid OTP'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4">
      <div className="card p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-500 text-sm mb-6">Enter your email or phone to reset your password</p>
        {step === 1 && (<>
          <input className="input mb-4" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Email or phone number" />
          <button onClick={sendOtp} disabled={loading} className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60">
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>)}
        {step === 2 && (<>
          <input className="input mb-3 text-center text-xl tracking-widest font-bold" maxLength={6}
                 value={otp} onChange={e => setOtp(e.target.value.replace(/\D/,''))} placeholder="Enter 6-digit OTP" />
          <input className="input mb-4" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 6 chars)" />
          <button onClick={resetPwd} disabled={loading || otp.length !== 6 || newPassword.length < 6} className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-60">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </>)}
        {step === 3 && (
          <div className="text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold text-gray-800 mb-4">Password reset successfully!</p>
            <Link to="/login" className="btn-primary px-8 py-2.5 text-sm">Login Now</Link>
          </div>
        )}
        <Link to="/login" className="block text-center text-sm text-primary-600 hover:underline mt-4">← Back to Login</Link>
      </div>
    </div>
  );
}
