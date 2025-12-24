import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { setAuthToken } from '@/services/apiClient';

import {
  changePassword as changePasswordApi,
  checkResetToken as checkResetTokenApi,
  forgotPassword as forgotPasswordApi,
  getUserProfile,
  loginUser as loginApi,
  logoutUser as logoutApi,
  resetPassword as resetPasswordApi,
  updateUserProfile as updateUserApi,
} from '@/services/authService';
import authStorage from '@/store/authStorage';

export type AuthState = {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isRemembered: boolean;
  hasFetchedProfile: boolean;
  hasHydrated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  changePasswordStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  changePasswordError: string | null;
  updateUserStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateUserError: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isRemembered: false,
  hasFetchedProfile: false,
  hasHydrated: false,
  status: 'idle',
  error: null,
  changePasswordStatus: 'idle',
  changePasswordError: null,
  updateUserStatus: 'idle',
  updateUserError: null,
};

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const stored = await authStorage.read();
  return stored;
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { emailOrUsername: string; password: string; remember?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const { remember, ...loginData } = credentials;
      const res = await loginApi(loginData);
      const { user, accessToken } = res.data;

      await authStorage.persist({ user, token: accessToken, remember: !!remember });

      return { user, token: accessToken, remember: !!remember };
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

export const logoutUserAsync = createAsyncThunk('auth/logoutAsync', async (_, { dispatch }) => {
  try {
    await logoutApi();
  } catch {
    // ignore
  }
  dispatch(logout());
});

export const forgotPasswordAsync = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordApi(email);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.response?.data || 'Request failed');
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await resetPasswordApi(token, password);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.response?.data || 'Reset failed');
    }
  }
);

export const checkResetTokenAsync = createAsyncThunk(
  'auth/checkResetToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await checkResetTokenApi(token);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err?.response?.data || 'Invalid token');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserProfile();
      const user = res.data?.data ?? res.data?.user ?? res.data;
      return user;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to fetch user profile';
      return rejectWithValue(msg);
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'auth/updateUser',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(data);
      const updatedUser = res.data?.data ?? res.data?.user ?? res.data;
      return updatedUser;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update user profile';
      return rejectWithValue(msg);
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await changePasswordApi({ oldPassword, newPassword });
      return res.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to change password';
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: any; token: string; remember?: boolean }>
    ) {
      const remember = !!action.payload.remember;

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isRemembered = remember;
      state.hasFetchedProfile = false;
      state.hasHydrated = true;
      state.status = 'succeeded';
      state.error = null;

      setAuthToken(state.token);

      void authStorage.persist({
        user: state.user,
        token: state.token,
        remember: state.isRemembered,
      });
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isRemembered = false;
      state.hasFetchedProfile = true;
      state.status = 'idle';
      state.error = null;
      setAuthToken(null);
      // fire and forget
      void authStorage.clear();
    },
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      void authStorage.persistUserOnly(state.user, state.isRemembered);
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = !!action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isRemembered = false;
      setAuthToken(null);
      void authStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        const { user, token, remember } = action.payload;
        state.user = (user as any) ?? null;
        state.token = token ?? null;
        state.isRemembered = remember;
        state.isAuthenticated = !!(user && token);
        state.hasHydrated = true;
        state.status = 'succeeded';

        setAuthToken(state.token);
      })
      .addCase(hydrateAuth.rejected, (state, action) => {
        state.hasHydrated = true;
        state.status = 'failed';
        state.error = (action.error?.message as string) || 'Failed to hydrate auth';
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isRemembered = action.payload.remember;
        state.error = null;

        setAuthToken(state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Login failed';
        state.isAuthenticated = false;
        state.isRemembered = false;
      })

      // FETCH PROFILE
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.hasFetchedProfile = true;
        void authStorage.persistUserOnly(state.user, state.isRemembered);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch user profile';
        state.hasFetchedProfile = true;

        const msg = ((action.payload as string) || '').toString().toLowerCase();
        if (msg.includes('token') || msg.includes('unauthorized') || msg.includes('401')) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.isRemembered = false;
          void authStorage.clear();
        }
      })

      // FORGOT / RESET / CHECK TOKEN
      .addCase(forgotPasswordAsync.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(forgotPasswordAsync.fulfilled, (s) => {
        s.status = 'succeeded';
      })
      .addCase(forgotPasswordAsync.rejected, (s, a) => {
        s.status = 'failed';
        s.error = (a.payload as string) || 'Request failed';
      })

      .addCase(resetPasswordAsync.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (s) => {
        s.status = 'succeeded';
      })
      .addCase(resetPasswordAsync.rejected, (s, a) => {
        s.status = 'failed';
        s.error = (a.payload as string) || 'Reset failed';
      })

      .addCase(checkResetTokenAsync.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(checkResetTokenAsync.fulfilled, (s) => {
        s.status = 'succeeded';
      })
      .addCase(checkResetTokenAsync.rejected, (s, a) => {
        s.status = 'failed';
        s.error = (a.payload as string) || 'Invalid token';
      })

      // UPDATE USER
      .addCase(updateUserAsync.pending, (state) => {
        state.updateUserStatus = 'loading';
        state.updateUserError = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.updateUserStatus = 'succeeded';
        state.user = action.payload;
        void authStorage.persistUserOnly(state.user, state.isRemembered);
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.updateUserStatus = 'failed';
        state.updateUserError = (action.payload as string) || 'Failed to update user profile';
      })

      // CHANGE PASSWORD
      .addCase(changePasswordAsync.pending, (state) => {
        state.changePasswordStatus = 'loading';
        state.changePasswordError = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.changePasswordStatus = 'succeeded';
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.changePasswordStatus = 'failed';
        state.changePasswordError = (action.payload as string) || 'Failed to change password';
      });
  },
});

export const { setCredentials, logout, setUser, setAuthenticated, clearAuth } = authSlice.actions;
export default authSlice.reducer;
