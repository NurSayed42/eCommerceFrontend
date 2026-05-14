import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await wishlistAPI.get();
    return data.data || [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await wishlistAPI.add(productId);
      toast.success('Added to wishlist ❤️');
      dispatch(fetchWishlist());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeWishlist = createAsyncThunk('wishlist/remove',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await wishlistAPI.remove(productId);
      toast.success('Removed from wishlist');
      dispatch(fetchWishlist());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending,   (s) => { s.loading = true; })
      .addCase(fetchWishlist.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload || [];
      })
      .addCase(fetchWishlist.rejected,  (s) => {
        s.loading = false;
        s.items = []; // 403 হলে empty রাখো
      })
      .addCase(addToWishlist.pending,   (s) => { s.loading = true; })
      .addCase(addToWishlist.fulfilled, (s) => { s.loading = false; })
      .addCase(addToWishlist.rejected,  (s) => { s.loading = false; })
      .addCase(removeWishlist.pending,  (s) => { s.loading = true; })
      .addCase(removeWishlist.fulfilled,(s) => { s.loading = false; })
      .addCase(removeWishlist.rejected, (s) => { s.loading = false; });
  },
});

export default wishlistSlice.reducer;