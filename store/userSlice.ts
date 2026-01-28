import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUser as createUserAPI,
  getListUsers as listUsersAPI,
  updateUser as updateUserAPI,
  updateUserStatus as updateUserStatusAPI,
} from "../services/userService";

interface UserState {
  listUsers: { data: any[]; pagination: any };
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  updateStatusStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatusError: string | null;
}

const initialState: UserState = {
  listUsers: { data: [], pagination: {} },
  fetchStatus: "idle",
  fetchError: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  updateStatusStatus: "idle",
  updateStatusError: null,
};

export const fetchListUsers = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("user/fetchListUsers", async (params: any = {}, { rejectWithValue }) => {
  try {
    const response = await listUsersAPI(params);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra khi tải danh sách người dùng";
    return rejectWithValue(errorMessage);
  }
});

export const createUser = createAsyncThunk<any, any, { rejectValue: string }>(
  "user/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await createUserAPI(userData);
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tạo người dùng";
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateUser = createAsyncThunk<
  any,
  { userId: string; userData: any },
  { rejectValue: string }
>(
  "user/updateUser",
  async (
    { userId, userData }: { userId: string; userData: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateUserAPI(userId, userData);
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật người dùng";
      return rejectWithValue(errorMessage);
    }
  },
);
export const updateUserStatus = createAsyncThunk<
  any,
  { userId: string; status: string },
  { rejectValue: string }
>(
  "user/updateUserStatus",
  async (
    { userId, status }: { userId: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateUserStatusAPI(userId, status);
      return response.data.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật trạng thái người dùng";
      return rejectWithValue(errorMessage);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateOnlineStatusBatch: (state, action) => {
      const statusList = action.payload;
      if (!state.listUsers?.data) return;
      state.listUsers.data = state.listUsers.data.map((user: any) => {
        const found = statusList.find((u: any) => u.id === user.id);
        return found
          ? {
              ...user,
              online: found.online,
              lastOnline: found.lastOnline,
              lastOffline: found.lastOffline,
            }
          : user;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch list users
      .addCase(fetchListUsers.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchListUsers.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const { offset } = action.meta.arg || {};

        if (offset && offset > 0) {
          // Append data
          state.listUsers.data = [
            ...state.listUsers.data,
            ...action.payload.data,
          ];
          state.listUsers.pagination = action.payload.pagination;
        } else {
          // Replace data (initial load or refresh)
          state.listUsers = action.payload;
        }
      })
      .addCase(fetchListUsers.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload ?? null;
      })
      // create user
      .addCase(createUser.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.listUsers.data.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload ?? null;
      })
      // update user
      .addCase(updateUser.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.listUsers.data.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index !== -1) {
          state.listUsers.data[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload ?? null;
      })
      // update user status
      .addCase(updateUserStatus.pending, (state) => {
        state.updateStatusStatus = "loading";
        state.updateStatusError = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.updateStatusStatus = "succeeded";
        const index = state.listUsers.data.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index !== -1) {
          state.listUsers.data[index] = action.payload;
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.updateStatusStatus = "failed";
        state.updateStatusError = action.payload ?? null;
      });
  },
});

export const { updateOnlineStatusBatch } = userSlice.actions;
export default userSlice.reducer;
