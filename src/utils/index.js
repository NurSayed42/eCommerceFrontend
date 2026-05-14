// ─── Price Formatting ─────────────────────────────────────────────────────────
export const formatPrice = (amount) => {
  if (amount == null) return '৳0';
  return `৳${Number(amount).toLocaleString('en-BD')}`;
};

export const calcDiscount = (original, sale) => {
  if (!original || !sale || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
};

// ─── Date Formatting ──────────────────────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-BD', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

// ─── String Helpers ───────────────────────────────────────────────────────────
export const truncate = (str, len = 80) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
};

export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

// ─── Order Status ─────────────────────────────────────────────────────────────
export const orderStatusColor = (status) => {
  const map = {
    PENDING:    'bg-yellow-100 text-yellow-700',
    CONFIRMED:  'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-purple-100 text-purple-700',
    SHIPPED:    'bg-indigo-100 text-indigo-700',
    DELIVERED:  'bg-green-100 text-green-700',
    CANCELLED:  'bg-red-100 text-red-700',
    RETURNED:   'bg-gray-100 text-gray-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

export const orderStatusLabel = (status) => {
  const map = {
    PENDING:    '⏳ Pending',
    CONFIRMED:  '✅ Confirmed',
    PROCESSING: '🔧 Processing',
    SHIPPED:    '🚚 Shipped',
    DELIVERED:  '📦 Delivered',
    CANCELLED:  '❌ Cancelled',
    RETURNED:   '↩️ Returned',
  };
  return map[status] || status;
};

// ─── Validation ───────────────────────────────────────────────────────────────
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPhone = (phone) => /^(\+88)?01[3-9]\d{8}$/.test(phone);

// ─── Local Storage ────────────────────────────────────────────────────────────
export const getFromStorage = (key, fallback = null) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

export const setToStorage = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* ignore */ }
};
