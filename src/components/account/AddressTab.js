import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { userAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AddressTab() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName:'', phone:'', streetAddress:'', city:'', district:'', type:'HOME', defaultAddress: false });

  useEffect(() => { userAPI.getAddresses().then(r => setAddresses(r.data.data || [])).catch(() => {}); }, []);

  const save = async () => {
    try { const { data } = await userAPI.addAddress(form); setAddresses(a => [...a, data.data]); setShowForm(false); toast.success('Address added!'); }
    catch { toast.error('Failed to add address'); }
  };

  const remove = async (id) => {
    try { await userAPI.deleteAddress(id); setAddresses(a => a.filter(x => x.id !== id)); toast.success('Address removed'); }
    catch { toast.error('Failed to remove address'); }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-gray-800">Saved Addresses</h2>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary text-sm px-4 py-2 gap-1.5">
          <Plus size={15} /> Add New
        </button>
      </div>

      {showForm && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-4 bg-gray-50 rounded-xl">
          {[['fullName','Full Name'],['phone','Phone'],['streetAddress','Street Address'],['city','City']].map(([k,l]) => (
            <div key={k} className={k === 'streetAddress' ? 'sm:col-span-2' : ''}>
              <label className="label">{l}</label>
              <input className="input text-sm" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="label">District</label>
            <select className="input text-sm" value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}>
              <option value="">Select</option>
              {['Dhaka','Chittagong','Rajshahi','Khulna','Barishal','Sylhet','Rangpur','Gazipur','Narayanganj'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="HOME">Home</option><option value="OFFICE">Office</option><option value="OTHER">Other</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button onClick={save} className="btn-primary text-sm px-5 py-2">Save</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-8 text-gray-400">
          <MapPin size={32} className="mx-auto mb-2" />
          <p className="text-sm">No saved addresses yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className="flex items-start gap-3 p-4 rounded-xl border border-gray-200">
              <MapPin size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm text-gray-800">{addr.fullName}</span>
                  <span className="badge-gray text-[10px]">{addr.type}</span>
                  {addr.defaultAddress && <span className="badge-green text-[10px]">Default</span>}
                </div>
                <p className="text-sm text-gray-600">{addr.streetAddress}, {addr.city}, {addr.district}</p>
                <p className="text-xs text-gray-500">{addr.phone}</p>
              </div>
              <button onClick={() => remove(addr.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
