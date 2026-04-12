import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createNotification as createNotificationAPI,
  CreateNotificationData,
  deleteNotification as deleteNotificationAPI,
  getNotifications as getNotificationsAPI,
  markAllNotificationsAsRead as markAllNotificationsAsReadAPI,
  markNotificationAsRead as markNotificationAsReadAPI,
  NotificationParams,
} from "../services/notificationService";

export interface NotificationItem {
  id: string;
  status: string;
  [key: string]: any;
}

export interface Pagination {
  total?: number;
  unreadCount?: number;
  [key: string]: any;
}

export interface NotificationState {
  notifications: {
    data: NotificationItem[];
    pagination: Pagination;
  };
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
  markAsReadStatus: "idle" | "loading" | "succeeded" | "failed";
  markAsReadError: string | null;
  markAllAsReadStatus: "idle" | "loading" | "succeeded" | "failed";
  markAllAsReadError: string | null;
}

const initialState: NotificationState = {
  notifications: { data: [], pagination: {} },

  fetchStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  fetchError: null,
  createStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  createError: null,
  deleteStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  deleteError: null,
  markAsReadStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  markAsReadError: null,
  markAllAsReadStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  markAllAsReadError: null,
};

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (params: NotificationParams, { rejectWithValue }) => {
    try {
      const response = await getNotificationsAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);
// Create notification
export const createNotification = createAsyncThunk(
  "notifications/createNotification",
  async (notificationData: CreateNotificationData, { rejectWithValue }) => {
    try {
      const response = await createNotificationAPI(notificationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);
// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await markNotificationAsReadAPI(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsReadAPI();
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);
// Delete notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await deleteNotificationAPI(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      const newNotification = action.payload;
      // Thêm vào đầu danh sách
      state.notifications.data.unshift(newNotification);

      // Tăng total và unreadCount
      if (state.notifications.pagination.total) {
        state.notifications.pagination.total += 1;
      } else {
        state.notifications.pagination.total = 1;
      }
      if (state.notifications.pagination.unreadCount) {
        state.notifications.pagination.unreadCount += 1;
      } else {
        state.notifications.pagination.unreadCount = 1;
      }

      // Giới hạn số lượng thông báo trong state để tránh tràn bộ nhớ (ví dụ: 50)
      if (state.notifications.data.length > 50) {
        state.notifications.data.pop();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const { data, pagination } = action.payload;
        // Lấy params gốc (offset) đã truyền cho thunk
        const params = action.meta.arg || {};

        if (params.offset && params.offset > 0) {
          // 👇 Đây là request "Tải thêm" -> Nối data mới vào data cũ
          state.notifications.data.push(...data);
          // Cập nhật pagination
          state.notifications.pagination = pagination;
        } else {
          // 👇 Đây là request tải lần đầu -> Ghi đè data
          state.notifications = action.payload;
        }
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })
      //Create notification
      .addCase(createNotification.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.notifications.data.unshift(action.payload);
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as any)?.message || action.error.message;
      })
      //Delete notification sau khi delete
      .addCase(deleteNotification.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.notifications.data = state.notifications.data.filter(
          (notif) => notif.id !== action.payload,
        );
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as any)?.message || action.error.message;
      })
      //Mark notification as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.markAsReadStatus = "loading";
        state.markAsReadError = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.markAsReadStatus = "succeeded";
        const notif = state.notifications.data.find(
          (n) => n.id === action.payload,
        );
        if (notif && notif.status === "unread") {
          notif.status = "read";
          if (state.notifications.pagination.unreadCount && state.notifications.pagination.unreadCount > 0) {
            state.notifications.pagination.unreadCount -= 1;
          }
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.markAsReadStatus = "failed";
        state.markAsReadError =
          (action.payload as any)?.message || action.error.message;
      })
      //Mark all notifications as read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.markAllAsReadStatus = "loading";
        state.markAllAsReadError = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.markAllAsReadStatus = "succeeded";
        state.notifications.data.forEach((notif) => {
          notif.status = "read";
        });
        if (state.notifications.pagination) {
          state.notifications.pagination.unreadCount = 0;
        }
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.markAllAsReadStatus = "failed";
        state.markAllAsReadError =
          (action.payload as any)?.message || action.error.message;
      });
  },
});
export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
