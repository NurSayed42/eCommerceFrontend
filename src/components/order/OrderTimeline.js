import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '../../utils';

const STEPS = [
  { key: 'PENDING',    label: 'Order Placed',  icon: '🛒' },
  { key: 'CONFIRMED',  label: 'Confirmed',     icon: '✅' },
  { key: 'PROCESSING', label: 'Processing',    icon: '🔧' },
  { key: 'SHIPPED',    label: 'Shipped',       icon: '🚚' },
  { key: 'DELIVERED',  label: 'Delivered',     icon: '📦' },
];

const ORDER_INDEX = { PENDING: 0, CONFIRMED: 1, PROCESSING: 2, SHIPPED: 3, DELIVERED: 4 };

export default function OrderTimeline({ status, statusHistory = [] }) {
  const current = ORDER_INDEX[status] ?? 0;
  const isCancelled = status === 'CANCELLED' || status === 'RETURNED';

  const getDate = (stepKey) => {
    const entry = statusHistory.find(h => h.status === stepKey);
    return entry ? formatDate(entry.changedAt) : null;
  };

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <span className="text-2xl">❌</span>
        <div>
          <p className="font-semibold text-red-700">Order {status === 'RETURNED' ? 'Returned' : 'Cancelled'}</p>
          {statusHistory.find(h => h.status === status) && (
            <p className="text-xs text-red-500 mt-0.5">{getDate(status)}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const active = i === current;
        const date = getDate(step.key);
        return (
          <div key={step.key} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-colors ${done ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {done ? (active ? step.icon : <CheckCircle2 size={14} />) : <Clock size={14} />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-0.5 h-8 transition-colors ${i < current ? 'bg-primary-600' : 'bg-gray-200'}`} />
              )}
            </div>
            {/* Label */}
            <div className="pt-1 pb-6">
              <p className={`text-sm font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
              {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
