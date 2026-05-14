import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI, categoryAPI, bannerAPI } from '../../services/api';

export const fetchFeatured   = createAsyncThunk('products/featured',
  async (_, { rejectWithValue }) => {
    try { return await productAPI.getFeatured().then(r => r.data.data); }
    catch { return rejectWithValue([]); }
  }
);
export const fetchFlashSale  = createAsyncThunk('products/flashSale',
  async (_, { rejectWithValue }) => {
    try { return await productAPI.getFlashSale().then(r => r.data.data); }
    catch { return rejectWithValue([]); }
  }
);
export const fetchTrending   = createAsyncThunk('products/trending',
  async (_, { rejectWithValue }) => {
    try { return await productAPI.getTrending().then(r => r.data.data); }
    catch { return rejectWithValue([]); }
  }
);
export const fetchTopSelling = createAsyncThunk('products/topSelling',
  async (_, { rejectWithValue }) => {
    try { return await productAPI.getTopSelling(8).then(r => r.data.data); }
    catch { return rejectWithValue([]); }
  }
);
export const fetchCategories = createAsyncThunk('products/categories',
  async (_, { rejectWithValue }) => {
    try { return await categoryAPI.getAll().then(r => r.data.data); }
    catch { return rejectWithValue([]); }
  }
);
export const fetchBanners    = createAsyncThunk('products/banners',
  async (_, { rejectWithValue }) => {
    try { return await bannerAPI.get('HOME_HERO').then(r => r.data.data); }
    catch { return rejectWithValue([]); }
  }
);

export const searchProducts = createAsyncThunk('products/search', async (params, { rejectWithValue }) => {
  try {
    const { data } = await productAPI.search(params);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchProductDetail = createAsyncThunk('products/detail', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await productAPI.getBySlug(slug);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    featured: [], flashSale: [], trending: [], topSelling: [],
    categories: [], banners: [],
    searchResults: null, currentProduct: null,
    loading: false, searchLoading: false,
  },
  reducers: {
    clearCurrentProduct: (s) => { s.currentProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatured.fulfilled,   (s, a) => { s.featured   = a.payload || []; })
      .addCase(fetchFlashSale.fulfilled,  (s, a) => { s.flashSale  = a.payload || []; })
      .addCase(fetchTrending.fulfilled,   (s, a) => { s.trending   = a.payload || []; })
      .addCase(fetchTopSelling.fulfilled, (s, a) => { s.topSelling = a.payload || []; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload || []; })
      .addCase(fetchBanners.fulfilled,    (s, a) => { s.banners    = a.payload || []; })
      .addCase(searchProducts.pending,    (s) => { s.searchLoading = true; })
      .addCase(searchProducts.fulfilled,  (s, a) => { s.searchLoading = false; s.searchResults = a.payload; })
      .addCase(searchProducts.rejected,   (s) => { s.searchLoading = false; })
      .addCase(fetchProductDetail.pending,   (s) => { s.loading = true; s.currentProduct = null; })
      .addCase(fetchProductDetail.fulfilled, (s, a) => { s.loading = false; s.currentProduct = a.payload; })
      .addCase(fetchProductDetail.rejected,  (s) => { s.loading = false; });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;