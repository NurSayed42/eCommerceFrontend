import React from 'react';
export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton" style={{ paddingBottom: '100%' }} />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-5 w-24 rounded" />
      </div>
    </div>
  );
}
