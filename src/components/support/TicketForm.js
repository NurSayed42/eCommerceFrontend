import React, { useState } from 'react';
import { supportAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['GENERAL', 'ORDER', 'PAYMENT', 'RETURN', 'TECHNICAL', 'OTHER'];

export default function TicketForm({ onSuccess }) {
  const [form, setForm] = useState({ subject: '', message: '', category: 'GENERAL' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      await supportAPI.createTicket(form.subject, form.message, form.category);
      toast.success('Ticket submitted! We\'ll reply soon.');
      setForm({ subject: '', message: '', category: 'GENERAL' });
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Category</label>
        <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="input">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Subject *</label>
        <input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}
               className="input" placeholder="Brief description of your issue" />
      </div>
      <div>
        <label className="label">Message *</label>
        <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  className="input resize-none" rows={5} placeholder="Describe your issue in detail..." />
      </div>
      <button type="submit" disabled={loading} className="btn-primary py-3 text-sm font-semibold w-full disabled:opacity-50">
        {loading ? 'Submitting...' : '📨 Submit Ticket'}
      </button>
    </form>
  );
}
