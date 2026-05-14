import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProfileTab() {
  const { user } = useSelector(s => s.auth);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await userAPI.updateProfile({ fullName }); toast.success('Profile updated!'); }
    catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-gray-800 mb-5">Profile Information</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="label">Full Name</label>
          <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input bg-gray-50 text-gray-500" value={user?.email || '—'} readOnly />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input bg-gray-50 text-gray-500" value={user?.phone || '—'} readOnly />
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={save} disabled={saving} className="btn-primary px-6 py-2.5 text-sm disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
