import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, message, actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">{message}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref} className="btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}
