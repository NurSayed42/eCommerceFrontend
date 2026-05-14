// import React, { useState, useEffect, useCallback } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
// import { searchProducts } from '../store/slices/productSlice';
// import { fetchCategories } from '../store/slices/productSlice';
// import ProductCard from '../components/common/ProductCard';
// import ProductCardSkeleton from '../components/common/ProductCardSkeleton';
// import { useLocation, useNavigate } from 'react-router-dom';

// const SORT_OPTIONS = [
//   { value: 'newest',    label: 'Newest First' },
//   { value: 'price_asc', label: 'Price: Low to High' },
//   { value: 'price_desc',label: 'Price: High to Low' },
//   { value: 'popular',   label: 'Most Popular' },
//   { value: 'rating',    label: 'Top Rated' },
// ];

// const PRICE_RANGES = [
//   { label: 'Under ৳500',       min: 0,    max: 500 },
//   { label: '৳500 - ৳1,000',   min: 500,  max: 1000 },
//   { label: '৳1,000 - ৳5,000', min: 1000, max: 5000 },
//   { label: '৳5,000 - ৳10,000',min: 5000, max: 10000 },
//   { label: 'Above ৳10,000',    min: 10000,max: 999999 },
// ];

// export default function ProductListPage() {
//   const dispatch = useDispatch();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { searchResults, searchLoading, categories } = useSelector(s => s.products);

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     q:          searchParams.get('q') || '',
//     categoryId: searchParams.get('categoryId') || '',
//     minPrice:   searchParams.get('minPrice') || '',
//     maxPrice:   searchParams.get('maxPrice') || '',
//     sort:       searchParams.get('sort') || 'newest',
//     inStock:    searchParams.get('inStock') || '',
//     minRating:  searchParams.get('minRating') || '',
//     page:       parseInt(searchParams.get('page') || '0'),
//   });

//   const doSearch = useCallback(() => {
//     const params = {};
//     Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== null) params[k] = v; });
//     dispatch(searchProducts(params));
//     // Update URL
//     const sp = new URLSearchParams();
//     Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
//     setSearchParams(sp);
//   }, [filters, dispatch, setSearchParams]);

//   useEffect(() => { doSearch(); }, [filters.page, filters.sort]);

//   const applyFilters = () => { setFilters(f => ({ ...f, page: 0 })); doSearch(); setSidebarOpen(false); };

//   const clearFilters = () => {
//     setFilters({ q: '', categoryId: '', minPrice: '', maxPrice: '', sort: 'newest', inStock: '', minRating: '', page: 0 });
//   };

//   const setPage = (p) => setFilters(f => ({ ...f, page: p }));

//   const FilterSidebar = () => (
//     <div className="space-y-5">
//       {/* Search */}
//       <div>
//         <label className="label">Search</label>
//         <div className="flex gap-2">
//           <input
//             className="input flex-1 text-sm"
//             placeholder="Product, brand..."
//             value={filters.q}
//             onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
//             onKeyDown={e => e.key === 'Enter' && applyFilters()}
//           />
//         </div>
//       </div>

//       {/* Categories */}
//       <div>
//         <label className="label">Category</label>
//         <select
//           className="input text-sm"
//           value={filters.categoryId}
//           onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value, page: 0 }))}
//         >
//           <option value="">All Categories</option>
//           {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//         </select>
//       </div>

//       {/* Price Range */}
//       <div>
//         <label className="label">Price Range</label>
//         <div className="space-y-2">
//           {PRICE_RANGES.map(r => (
//             <label key={r.label} className="flex items-center gap-2 text-sm cursor-pointer">
//               <input
//                 type="radio"
//                 name="priceRange"
//                 className="accent-primary-600"
//                 checked={filters.minPrice == r.min && filters.maxPrice == r.max}
//                 onChange={() => setFilters(f => ({ ...f, minPrice: r.min, maxPrice: r.max, page: 0 }))}
//               />
//               <span className="text-gray-700">{r.label}</span>
//             </label>
//           ))}
//           <label className="flex items-center gap-2 text-sm cursor-pointer">
//             <input type="radio" name="priceRange" className="accent-primary-600"
//               checked={!filters.minPrice && !filters.maxPrice}
//               onChange={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '', page: 0 }))} />
//             <span className="text-gray-700">Any Price</span>
//           </label>
//         </div>
//         {/* Custom range */}
//         <div className="flex gap-2 mt-3">
//           <input className="input text-sm" type="number" placeholder="Min ৳"
//             value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, page: 0 }))} />
//           <input className="input text-sm" type="number" placeholder="Max ৳"
//             value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, page: 0 }))} />
//         </div>
//       </div>

//       {/* Rating */}
//       <div>
//         <label className="label">Min Rating</label>
//         <div className="space-y-2">
//           {[4, 3, 2].map(r => (
//             <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
//               <input type="radio" name="rating" className="accent-primary-600"
//                 checked={filters.minRating == r}
//                 onChange={() => setFilters(f => ({ ...f, minRating: r, page: 0 }))} />
//               <span className="flex text-yellow-400">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
//               <span className="text-gray-600">& above</span>
//             </label>
//           ))}
//           <label className="flex items-center gap-2 text-sm cursor-pointer">
//             <input type="radio" name="rating" className="accent-primary-600"
//               checked={!filters.minRating}
//               onChange={() => setFilters(f => ({ ...f, minRating: '', page: 0 }))} />
//             <span className="text-gray-700">All Ratings</span>
//           </label>
//         </div>
//       </div>

//       {/* In Stock */}
//       <div>
//         <label className="flex items-center gap-2 text-sm cursor-pointer">
//           <input type="checkbox" className="accent-primary-600 w-4 h-4"
//             checked={filters.inStock === 'true'}
//             onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked ? 'true' : '', page: 0 }))} />
//           <span className="text-gray-700 font-medium">In Stock Only</span>
//         </label>
//       </div>

//       <div className="flex gap-2 pt-2">
//         <button onClick={applyFilters} className="btn-primary flex-1 text-sm">Apply Filters</button>
//         <button onClick={clearFilters} className="btn-ghost text-sm px-3"><X size={15} /></button>
//       </div>
//     </div>
//   );

//   const products = searchResults?.content || [];
//   const totalPages = searchResults?.totalPages || 0;
//   const totalElements = searchResults?.totalElements || 0;

//   return (
//     <div className="container-app py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">
//             {filters.q ? `Results for "${filters.q}"` : filters.categoryId ? 'Category Products' : 'All Products'}
//           </h1>
//           {!searchLoading && (
//             <p className="text-sm text-gray-500 mt-0.5">{totalElements.toLocaleString()} products found</p>
//           )}
//         </div>
//         <div className="flex items-center gap-3">
//           {/* Sort */}
//           <div className="relative hidden md:block">
//             <select
//               className="input text-sm pr-8 appearance-none"
//               value={filters.sort}
//               onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 0 }))}
//             >
//               {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//             </select>
//             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
//           </div>

//           {/* Mobile filter btn */}
//           <button onClick={() => setSidebarOpen(true)} className="btn-outline flex items-center gap-2 text-sm md:hidden">
//             <SlidersHorizontal size={15} /> Filters
//           </button>
//         </div>
//       </div>

//       <div className="flex gap-6">
//         {/* Desktop Sidebar */}
//         <aside className="hidden md:block w-56 flex-shrink-0">
//           <div className="card p-5 sticky top-24">
//             <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <SlidersHorizontal size={16} /> Filters
//             </h3>
//             <FilterSidebar />
//           </div>
//         </aside>

//         {/* Mobile Sidebar Drawer */}
//         {sidebarOpen && (
//           <div className="fixed inset-0 z-50 flex md:hidden">
//             <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
//             <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-5 shadow-xl">
//               <div className="flex justify-between items-center mb-5">
//                 <h3 className="font-semibold">Filters</h3>
//                 <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
//               </div>
//               <FilterSidebar />
//             </div>
//           </div>
//         )}

//         {/* Products Grid */}
//         <div className="flex-1">
//           {/* Mobile Sort */}
//           <div className="md:hidden mb-4">
//             <select className="input text-sm w-full" value={filters.sort}
//               onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 0 }))}>
//               {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//             </select>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {searchLoading
//               ? Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
//               : products.length > 0
//                 ? products.map(p => <ProductCard key={p.id} product={p} />)
//                 : (
//                   <div className="col-span-full text-center py-16">
//                     <div className="text-4xl mb-3">🔍</div>
//                     <h3 className="font-semibold text-gray-700">No products found</h3>
//                     <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
//                     <button onClick={clearFilters} className="btn-primary mt-4 text-sm">Clear Filters</button>
//                   </div>
//                 )
//             }
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-2 mt-10">
//               <button disabled={filters.page === 0} onClick={() => setPage(filters.page - 1)}
//                       className="btn-outline text-sm px-4 py-2 disabled:opacity-40">← Prev</button>
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 const p = Math.max(0, Math.min(totalPages - 5, filters.page - 2)) + i;
//                 return (
//                   <button key={p} onClick={() => setPage(p)}
//                           className={`w-9 h-9 rounded-lg text-sm font-medium ${p === filters.page ? 'bg-primary-600 text-white' : 'btn-outline'}`}>
//                     {p + 1}
//                   </button>
//                 );
//               })}
//               <button disabled={filters.page >= totalPages - 1} onClick={() => setPage(filters.page + 1)}
//                       className="btn-outline text-sm px-4 py-2 disabled:opacity-40">Next →</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




























import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import { searchProducts, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/common/ProductCard';
import ProductCardSkeleton from '../components/common/ProductCardSkeleton';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
  { value: 'popular',   label: 'Most Popular' },
  { value: 'rating',    label: 'Top Rated' },
];

const PRICE_RANGES = [
  { label: 'Under ৳500',       min: 0,    max: 500 },
  { label: '৳500 - ৳1,000',   min: 500,  max: 1000 },
  { label: '৳1,000 - ৳5,000', min: 1000, max: 5000 },
  { label: '৳5,000 - ৳10,000',min: 5000, max: 10000 },
  { label: 'Above ৳10,000',    min: 10000,max: 999999 },
];

export default function ProductListPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, searchLoading, categories } = useSelector(s => s.products);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    q:          searchParams.get('q') || '',
    categoryId: searchParams.get('categoryId') || '',
    minPrice:   searchParams.get('minPrice') || '',
    maxPrice:   searchParams.get('maxPrice') || '',
    sort:       searchParams.get('sort') || 'newest',
    inStock:    searchParams.get('inStock') || '',
    minRating:  searchParams.get('minRating') || '',
    page:       parseInt(searchParams.get('page') || '0'),
  });

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Update filters when URL changes (for category navigation from navbar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('categoryId');
    const flashSale = params.get('flashSale');
    const search = params.get('q');
    
    setFilters(prev => ({
      ...prev,
      categoryId: categoryId || '',
      q: search || '',
      page: 0,
      ...(flashSale === 'true' && { flashSale: true })
    }));
  }, [location.search]);

  const doSearch = useCallback(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { 
      if (v !== '' && v !== null && v !== false) params[k] = v; 
    });
    dispatch(searchProducts(params));
    // Update URL
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { 
      if (v) sp.set(k, v); 
    });
    setSearchParams(sp);
  }, [filters, dispatch, setSearchParams]);

  // Call search when filters change (except page and sort which have their own triggers)
  useEffect(() => {
    doSearch();
  }, [filters.q, filters.categoryId, filters.minPrice, filters.maxPrice, filters.inStock, filters.minRating]);

  // Separate effect for page and sort changes
  useEffect(() => {
    doSearch();
  }, [filters.page, filters.sort]);

  const applyFilters = () => { 
    setFilters(f => ({ ...f, page: 0 })); 
    setSidebarOpen(false); 
  };

  const clearFilters = () => {
    setFilters({ 
      q: '', 
      categoryId: '', 
      minPrice: '', 
      maxPrice: '', 
      sort: 'newest', 
      inStock: '', 
      minRating: '', 
      page: 0 
    });
    // Clear URL params
    navigate('/products');
  };

  const setPage = (p) => setFilters(f => ({ ...f, page: p }));

  const FilterSidebar = () => (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="label">Search</label>
        <div className="flex gap-2">
          <input
            className="input flex-1 text-sm"
            placeholder="Product, brand..."
            value={filters.q}
            onChange={e => setFilters(f => ({ ...f, q: e.target.value, page: 0 }))}
            onKeyDown={e => e.key === 'Enter' && applyFilters()}
          />
          <button onClick={applyFilters} className="btn-primary text-sm px-3">
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="label">Category</label>
        <select
          className="input text-sm"
          value={filters.categoryId}
          onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value, page: 0 }))}
        >
          <option value="">All Categories</option>
          {categories?.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="label">Price Range</label>
        <div className="space-y-2">
          {PRICE_RANGES.map(r => (
            <label key={r.label} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                className="accent-primary-600"
                checked={Number(filters.minPrice) === r.min && Number(filters.maxPrice) === r.max}
                onChange={() => setFilters(f => ({ ...f, minPrice: r.min, maxPrice: r.max, page: 0 }))}
              />
              <span className="text-gray-700">{r.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="priceRange" 
              className="accent-primary-600"
              checked={!filters.minPrice && !filters.maxPrice}
              onChange={() => setFilters(f => ({ ...f, minPrice: '', maxPrice: '', page: 0 }))} 
            />
            <span className="text-gray-700">Any Price</span>
          </label>
        </div>
        {/* Custom range */}
        <div className="flex gap-2 mt-3">
          <input 
            className="input text-sm" 
            type="number" 
            placeholder="Min ৳"
            value={filters.minPrice} 
            onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value, page: 0 }))} 
          />
          <input 
            className="input text-sm" 
            type="number" 
            placeholder="Max ৳"
            value={filters.maxPrice} 
            onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value, page: 0 }))} 
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="label">Min Rating</label>
        <div className="space-y-2">
          {[4, 3, 2].map(r => (
            <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="rating" 
                className="accent-primary-600"
                checked={Number(filters.minRating) === r}
                onChange={() => setFilters(f => ({ ...f, minRating: r, page: 0 }))} 
              />
              <span className="flex text-yellow-400">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
              <span className="text-gray-600">& above</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input 
              type="radio" 
              name="rating" 
              className="accent-primary-600"
              checked={!filters.minRating}
              onChange={() => setFilters(f => ({ ...f, minRating: '', page: 0 }))} 
            />
            <span className="text-gray-700">All Ratings</span>
          </label>
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input 
            type="checkbox" 
            className="accent-primary-600 w-4 h-4"
            checked={filters.inStock === 'true'}
            onChange={e => setFilters(f => ({ ...f, inStock: e.target.checked ? 'true' : '', page: 0 }))} 
          />
          <span className="text-gray-700 font-medium">In Stock Only</span>
        </label>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={applyFilters} className="btn-primary flex-1 text-sm">Apply Filters</button>
        <button onClick={clearFilters} className="btn-ghost text-sm px-3">
          <X size={15} /> Clear All
        </button>
      </div>
    </div>
  );

  const products = searchResults?.content || [];
  const totalPages = searchResults?.totalPages || 0;
  const totalElements = searchResults?.totalElements || 0;

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || (i >= filters.page - delta && i <= filters.page + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="container-app py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {filters.q 
              ? `Results for "${filters.q}"` 
              : filters.categoryId 
                ? categories?.find(c => c.id == filters.categoryId)?.name || 'Category Products'
                : 'All Products'
            }
          </h1>
          {!searchLoading && totalElements > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">{totalElements.toLocaleString()} products found</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative hidden md:block">
            <select
              className="input text-sm pr-8 appearance-none cursor-pointer"
              value={filters.sort}
              onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 0 }))}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Active filters summary */}
          {(filters.categoryId || filters.minPrice || filters.maxPrice || filters.minRating || filters.inStock) && (
            <button 
              onClick={clearFilters}
              className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X size={14} /> Clear filters
            </button>
          )}

          {/* Mobile filter btn */}
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="btn-outline flex items-center gap-2 text-sm md:hidden"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <SlidersHorizontal size={16} /> Filters
            </h3>
            <FilterSidebar />
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-5 shadow-xl">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button onClick={() => setSidebarOpen(false)} className="p-1">
                  <X size={24} />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile Sort */}
          <div className="md:hidden mb-4">
            <select 
              className="input text-sm w-full" 
              value={filters.sort}
              onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 0 }))}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchLoading
              ? Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.length > 0
                ? products.map(p => <ProductCard key={p.id} product={p} />)
                : (
                  <div className="col-span-full text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="font-semibold text-gray-700 text-lg">No products found</h3>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                    <button onClick={clearFilters} className="btn-primary mt-6 text-sm">
                      Clear All Filters
                    </button>
                  </div>
                )
            }
          </div>

          {/* Pagination */}
          {totalPages > 1 && !searchLoading && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button 
                disabled={filters.page === 0} 
                onClick={() => setPage(filters.page - 1)}
                className="btn-outline text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              {getPageNumbers().map((p, idx) => (
                p === '...' 
                  ? <span key={`dot-${idx}`} className="px-2 text-gray-400">...</span>
                  : (
                    <button 
                      key={p} 
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        p === filters.page 
                          ? 'bg-primary-600 text-white shadow-md' 
                          : 'border border-gray-200 hover:border-primary-300 hover:text-primary-600'
                      }`}
                    >
                      {p + 1}
                    </button>
                  )
              ))}
              
              <button 
                disabled={filters.page >= totalPages - 1} 
                onClick={() => setPage(filters.page + 1)}
                className="btn-outline text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}