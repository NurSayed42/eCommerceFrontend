import React from 'react';
import { X } from 'lucide-react';

export default function ProductFilter({ categories, filters, onChange, onReset }) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-gray-700 text-sm mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="category" value={cat.id}
                     checked={String(filters.categoryId) === String(cat.id)}
                     onChange={() => onChange({ categoryId: cat.id })}
                     className="text-primary-600 w-4 h-4" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="font-semibold text-gray-700 text-sm mb-3">Price Range</h4>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" value={filters.minPrice || ''}
                 onChange={e => onChange({ minPrice: e.target.value })}
                 className="input text-sm py-1.5 w-24" />
          <span className="text-gray-400 text-sm">–</span>
          <input type="number" placeholder="Max" value={filters.maxPrice || ''}
                 onChange={e => onChange({ maxPrice: e.target.value })}
                 className="input text-sm py-1.5 w-24" />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-semibold text-gray-700 text-sm mb-3">Sort By</h4>
        <div className="space-y-2">
          {[
            { value: 'createdAt,desc', label: 'Newest First' },
            { value: 'price,asc',      label: 'Price: Low to High' },
            { value: 'price,desc',     label: 'Price: High to Low' },
            { value: 'soldCount,desc', label: 'Most Popular' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="sort" value={opt.value}
                     checked={filters.sort === opt.value}
                     onChange={() => onChange({ sort: opt.value })}
                     className="text-primary-600 w-4 h-4" />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button onClick={onReset}
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors font-medium">
        <X size={14} /> Reset Filters
      </button>
    </div>
  );
}
