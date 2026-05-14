import React, { useState } from 'react';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function SecurityTab() {
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    if (form.newPwd !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.newPwd.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await userAPI.changePassword(form.current, form.newPwd);
      toast.success('Password changed successfully!');
      setForm({ current: '', newPwd: '', confirm: '' });
    } catch { toast.error('Current password is incorrect'); }
    finally { setLoading(false); }
  };

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-gray-800 mb-5">Change Password</h2>
      <div className="space-y-4 max-w-md">
        {[['current','Current Password'],['newPwd','New Password'],['confirm','Confirm New Password']].map(([k,l]) => (
          <div key={k}>
            <label className="label">{l}</label>
            <input className="input" type="password" value={form[k]}
                   onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
          </div>
        ))}
        <button onClick={changePassword} disabled={loading || !form.current || !form.newPwd || !form.confirm}
                className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
          {loading ? 'Saving...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
}
