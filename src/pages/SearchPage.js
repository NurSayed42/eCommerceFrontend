import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/common/ProductCard';
import ProductCardSkeleton from '../components/common/ProductCardSkeleton';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, searchLoading } = useSelector(s => s.products);
  const q = searchParams.get('q') || '';

  useEffect(() => {
    if (q) dispatch(searchProducts({ q, size: 20 }));
  }, [q, dispatch]);

  const products = searchResults?.content || [];

  return (
    <div className="container-app py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Search size={18} className="text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">
            {q ? `Results for "${q}"` : 'Search Products'}
          </h1>
        </div>
        {!searchLoading && searchResults && (
          <p className="text-sm text-gray-500">{searchResults.totalElements} products found</p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {searchLoading
          ? Array(10).fill(0).map((_,i) => <ProductCardSkeleton key={i} />)
          : products.length > 0
            ? products.map(p => <ProductCard key={p.id} product={p} />)
            : (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="font-semibold text-gray-700">No results found for "{q}"</h3>
                <p className="text-sm text-gray-500 mt-2">Try different keywords or browse all products</p>
              </div>
            )
        }
      </div>
    </div>
  );
}
