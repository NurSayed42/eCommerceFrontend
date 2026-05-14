// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { authAPI, userAPI } from '../../services/api';
// import toast from 'react-hot-toast';

// const loadUserFromStorage = () => {
//   try {
//     const raw = localStorage.getItem('user');
//     // "undefined", "null", empty — সব reject করো
//     if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') return null;
//     const parsed = JSON.parse(raw);
//     // object এবং fullName আছে কিনা check করো
//     if (parsed && typeof parsed === 'object' && parsed.fullName) return parsed;
//     return null;
//   } catch {
//     return null;
//   }
// };

// export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
//   try {
//     const { data } = await authAPI.login(credentials);
//     const auth = data.data;
//     localStorage.setItem('accessToken', auth.accessToken);
//     localStorage.setItem('refreshToken', auth.refreshToken);
//     localStorage.setItem('user', JSON.stringify(auth));
//     return auth;
//   } catch (err) {
//     return rejectWithValue(err.response?.data?.message || 'Login failed');
//   }
// });

// export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
//   try {
//     const { data } = await authAPI.register(userData);
//     return data.data;
//   } catch (err) {
//     return rejectWithValue(err.response?.data?.message || 'Registration failed');
//   }
// });

// export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
//   try {
//     const { data } = await userAPI.getProfile();
//     const profile = data.data;
//     if (profile) {
//       localStorage.setItem('user', JSON.stringify(profile));
//     }
//     return profile;
//   } catch (err) {
//     return rejectWithValue(err.response?.data?.message);
//   }
// });

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: loadUserFromStorage(),
//     token: localStorage.getItem('accessToken'),
//     isAuthenticated: !!localStorage.getItem('accessToken'),
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout(state) {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');
//       toast.success('Logged out successfully');
//     },
//     clearError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending,    (s) => { s.loading = true; s.error = null; })
//       .addCase(loginUser.fulfilled,  (s, a) => {
//         s.loading = false;
//         s.user = a.payload;
//         s.token = a.payload.accessToken;
//         s.isAuthenticated = true;
//         toast.success(`Welcome back, ${a.payload.fullName}! 👋`);
//       })
//       .addCase(loginUser.rejected,   (s, a) => { s.loading = false; s.error = a.payload; })
//       .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; })
//       .addCase(registerUser.fulfilled, (s) => { s.loading = false; toast.success('OTP sent! Please verify.'); })
//       .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
//       .addCase(fetchProfile.fulfilled, (s, a) => {
//         if (a.payload) {
//           s.user = a.payload;
//           s.isAuthenticated = true;
//         }
//       })
//       .addCase(fetchProfile.rejected, (s) => {
//         // কিছু করো না — token valid থাকলে cart/wishlist কাজ করবে
//       });
//   },
// });

// export const { logout, clearError } = authSlice.actions;
// export default authSlice.reducer;




















import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, userAPI } from '../../services/api';
import toast from 'react-hot-toast';

const loadUserFromStorage = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.fullName) return parsed;
    return null;
  } catch { return null; }
};

const saveAuth = (auth) => {
  localStorage.setItem('accessToken', auth.accessToken);
  localStorage.setItem('refreshToken', auth.refreshToken);
  localStorage.setItem('user', JSON.stringify(auth));
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    saveAuth(data.data);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (idToken, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.googleLogin(idToken);
    saveAuth(data.data);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Google login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.register(userData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await userAPI.getProfile();
    if (data.data) localStorage.setItem('user', JSON.stringify(data.data));
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUserFromStorage(),
    token: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,    (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled,  (s, a) => {
        s.loading = false; s.user = a.payload;
        s.token = a.payload.accessToken; s.isAuthenticated = true;
        toast.success(`Welcome back, ${a.payload.fullName}! 👋`);
      })
      .addCase(loginUser.rejected,   (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(googleLogin.pending,  (s) => { s.loading = true; s.error = null; })
      .addCase(googleLogin.fulfilled,(s, a) => {
        s.loading = false; s.user = a.payload;
        s.token = a.payload.accessToken; s.isAuthenticated = true;
        toast.success(`Welcome, ${a.payload.fullName}! 👋`);
      })
      .addCase(googleLogin.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false; })
      .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        if (a.payload) { s.user = a.payload; s.isAuthenticated = true; }
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;