import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4 text-center">
      <div className="animate-fadeIn">
        <div className="text-8xl font-black text-gray-100 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary px-6 py-2.5 text-sm">Go Home</Link>
          <Link to="/products" className="btn-outline px-6 py-2.5 text-sm">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}
