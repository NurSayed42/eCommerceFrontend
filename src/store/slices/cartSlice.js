import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartAPI.get();
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/add',
  async ({ productId, variantId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      await cartAPI.add(productId, variantId, quantity);
      toast.success('Added to cart! 🛒');
      dispatch(fetchCart());
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateCartItem = createAsyncThunk('cart/update',
  async ({ itemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await cartAPI.update(itemId, quantity);
      dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeFromCart = createAsyncThunk('cart/remove',
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      await cartAPI.remove(itemId);
      toast.success('Removed from cart');
      dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    count: 0,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCart.fulfilled, (s, a) => {
        s.loading = false;
        s.items       = a.payload?.items || [];
        s.totalAmount = a.payload?.totalAmount || 0;
        s.count       = (a.payload?.items || []).filter(i => !i.savedForLater).length;
      })
      .addCase(fetchCart.rejected,  (s, a) => {
        s.loading = false;
        s.error = a.payload;
        // 403/401 হলে cart empty করো silently
        s.items = [];
        s.count = 0;
        s.totalAmount = 0;
      })
      .addCase(addToCart.pending,  (s) => { s.loading = true; })
      .addCase(addToCart.fulfilled,(s) => { s.loading = false; })
      .addCase(addToCart.rejected, (s) => { s.loading = false; });
  },
});

export default cartSlice.reducer;