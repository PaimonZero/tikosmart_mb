import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createTask as createTaskAPI,
  CreateTaskData,
  deleteTask as deleteTaskAPI,
  getItemsByTask as getItemsByTaskAPI,
  getTaskById as getTaskByIdAPI,
  getTasksByCurrentPacker as getTasksByCurrentPackerAPI,
  getTasksByCurrentSupervisor as getTasksByCurrentSupervisorAPI,
  getTasksByPacker as getTasksByPackerAPI,
  getTasksBySupervisor as getTasksBySupervisorAPI,
  getTaskStatsByUser as getTaskStatsByUserAPI,
  getTaskStatsOverview as getTaskStatsOverviewAPI,
  listTasks as listTasksAPI,
  ReviewTaskData,
  TaskItem,
  TaskParams,
  updateTask as updateTaskAPI,
  UpdateTaskData,
  updateTaskItemByPicker as updateTaskItemByPickerAPI,
  UpdateTaskItemData,
  updateTaskReview as updateTaskReviewAPI,
  updateTaskStatus as updateTaskStatusAPI,
} from "../services/taskService";

/* ============================================================
   INTERFACES
   ============================================================ */

export interface Task {
  id: string;
  items?: TaskItem[];
  review?: any;
  reviewResult?: string;
  reviewReason?: string;
  reviewUpdatedAt?: string;
  [key: string]: any;
}

export interface TaskState {
  tasks:
    | {
        data: Task[];
        [key: string]: any;
      }
    | Task[]; // Handling both paginated (object with data) and array structure
  selectedTask: Task | null;
  taskItems: TaskItem[];
  statsOverview: any[];
  statsByUser: any[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
  statsByUserStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  statsError: string | null;
  statsByUserError: string | null;
}

/* ============================================================
   INITIAL STATE
   ============================================================ */
const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  taskItems: [],
  statsOverview: [],
  statsByUser: [],
  fetchStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  statsStatus: "idle",
  statsByUserStatus: "idle",
  fetchError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  statsError: null,
  statsByUserError: null,
};

/* ============================================================
   ASYNC THUNKS
   ============================================================ */

// 📋 Lấy danh sách tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchList",
  async (params: TaskParams = {}, { rejectWithValue }) => {
    try {
      const res = await listTasksAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📋 Lấy thêm danh sách tasks (Pagination / Infinite Scroll)
export const fetchMoreTasks = createAsyncThunk(
  "tasks/fetchMoreList",
  async (params: TaskParams = {}, { rejectWithValue }) => {
    try {
      const res = await listTasksAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🔍 Lấy chi tiết task
export const fetchTaskById = createAsyncThunk(
  "tasks/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getTaskByIdAPI(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📦 Lấy danh sách items của task
export const fetchItemsByTask = createAsyncThunk(
  "tasks/fetchItemsByTask",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getItemsByTaskAPI(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ➕ Tạo task mới
export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData: CreateTaskData, { rejectWithValue }) => {
    try {
      const res = await createTaskAPI(taskData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ✏️ Cập nhật task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async (
    { id, data }: { id: string; data: UpdateTaskData },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateTaskAPI(id, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🔄 Cập nhật trạng thái task (assigned → in_progress → pending_review → completed)
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateTaskStatusAPI(id, status);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🧾 Cập nhật kết quả review của preparation task
export const updateTaskReview = createAsyncThunk(
  "tasks/updateReview",
  async (
    { id, data }: { id: string; data: ReviewTaskData },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateTaskReviewAPI(id, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ✏️ Picker cập nhật item trong task
export const updateTaskItemByPicker = createAsyncThunk(
  "tasks/updateItemByPicker",
  async (
    {
      taskId,
      itemId,
      data,
    }: { taskId: string; itemId: string; data: UpdateTaskItemData },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateTaskItemByPickerAPI(taskId, itemId, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ❌ Xóa task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await deleteTaskAPI(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📊 Lấy thống kê tổng quan
export const fetchTaskStatsOverview = createAsyncThunk(
  "tasks/fetchStatsOverview",
  async (params: TaskParams = {}, { rejectWithValue }) => {
    try {
      const res = await getTaskStatsOverviewAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 👤 Lấy thống kê theo người dùng
export const fetchTaskStatsByUser = createAsyncThunk(
  "tasks/fetchStatsByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await getTaskStatsByUserAPI(userId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📦 Lấy task theo supervisor
export const fetchTasksBySupervisor = createAsyncThunk(
  "tasks/fetchBySupervisor",
  async (
    {
      supervisorId,
      params = {},
    }: { supervisorId: string; params?: TaskParams },
    { rejectWithValue },
  ) => {
    try {
      const res = await getTasksBySupervisorAPI(supervisorId, params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📦 Lấy task theo packer
export const fetchTasksByPacker = createAsyncThunk(
  "tasks/fetchByPacker",
  async (
    { packerId, params = {} }: { packerId: string; params?: TaskParams },
    { rejectWithValue },
  ) => {
    try {
      const res = await getTasksByPackerAPI(packerId, params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📋 Lấy toàn bộ task của supervisor hiện tại (theo JWT)
export const fetchTasksByCurrentSupervisor = createAsyncThunk(
  "tasks/fetchByCurrentSupervisor",
  async (params: TaskParams = {}, { rejectWithValue }) => {
    try {
      const res = await getTasksByCurrentSupervisorAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📋 Lấy toàn bộ task của packer hiện tại (theo JWT)
export const fetchTasksByCurrentPacker = createAsyncThunk(
  "tasks/fetchByCurrentPacker",
  async (params: TaskParams = {}, { rejectWithValue }) => {
    try {
      const res = await getTasksByCurrentPackerAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

/* ============================================================
   SLICE
   ============================================================ */

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    clearTaskItems: (state) => {
      state.taskItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------- FETCH LIST -------- */
      .addCase(fetchTasks.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- FETCH MORE LIST (INFINITE SCROLL) -------- */
      .addCase(fetchMoreTasks.pending, (state) => {
        // Not setting "loading" to avoid replacing the big full-screen loader
        // Could add a fetchMoreStatus in the future if needed
      })
      .addCase(fetchMoreTasks.fulfilled, (state, action) => {
        const newData = action.payload?.data || action.payload || [];
        // Extract array if it was wrapped or append directly
        const freshItems = Array.isArray(newData) ? newData : [];

        // Appending to the existing array safely based on structure
        if ((state.tasks as any).data) {
          (state.tasks as any).data = [
            ...(state.tasks as any).data,
            ...freshItems,
          ];
          // Also update pagination meta if provided by payload
          if (action.payload?.total !== undefined) {
            (state.tasks as any).total = action.payload.total;
          }
        } else if (Array.isArray(state.tasks)) {
          state.tasks = [...state.tasks, ...freshItems];
        } else {
          state.tasks = action.payload;
        }
      })
      .addCase(fetchMoreTasks.rejected, (state, action) => {
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- FETCH BY ID -------- */
      .addCase(fetchTaskById.pending, (state) => {
        state.fetchStatus = "loading";
        state.selectedTask = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.selectedTask = action.payload?.data || ({} as any);
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
        state.selectedTask = null;
      })

      /* -------- FETCH ITEMS BY TASK -------- */
      .addCase(fetchItemsByTask.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchItemsByTask.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.taskItems = action.payload?.data || [];
      })
      .addCase(fetchItemsByTask.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- CREATE -------- */
      .addCase(createTask.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        if ((state.tasks as any).data) {
          (state.tasks as any).data.unshift(
            action.payload.data || action.payload,
          );
        } else if (Array.isArray(state.tasks)) {
          state.tasks.unshift(action.payload.data || action.payload);
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- UPDATE -------- */
      .addCase(updateTask.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const updated = action.payload?.data || action.payload;
        if (!updated?.id) return;

        // Nếu tasks là object có field data
        if ((state.tasks as any).data) {
          const idx = (state.tasks as any).data.findIndex(
            (t: Task) => t.id === updated.id,
          );
          if (idx !== -1)
            (state.tasks as any).data[idx] = {
              ...(state.tasks as any).data[idx],
              ...updated,
            };
        }
        // Nếu tasks là mảng thuần
        else if (Array.isArray(state.tasks)) {
          const idx = state.tasks.findIndex((t) => t.id === updated.id);
          if (idx !== -1)
            state.tasks[idx] = { ...state.tasks[idx], ...updated };
        }

        // Nếu đang mở selectedTask, cập nhật lại luôn
        if (state.selectedTask?.id === updated.id) {
          state.selectedTask = { ...state.selectedTask, ...updated };
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- UPDATE ITEM BY PICKER -------- */
      .addCase(updateTaskItemByPicker.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateTaskItemByPicker.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedItem = action.payload?.data || action.payload;

        // Cập nhật trong state.taskItems (nếu đang có)
        if (Array.isArray(state.taskItems)) {
          const idx = state.taskItems.findIndex((i) => i.id === updatedItem.id);
          if (idx !== -1)
            state.taskItems[idx] = { ...state.taskItems[idx], ...updatedItem };
        }

        // Cập nhật trong selectedTask.items nếu đang mở task
        if (state.selectedTask?.items) {
          const idx = state.selectedTask.items.findIndex(
            (i) => i.id === updatedItem.id,
          );
          if (idx !== -1)
            state.selectedTask.items[idx] = {
              ...state.selectedTask.items[idx],
              ...updatedItem,
            };
        }
      })
      .addCase(updateTaskItemByPicker.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- UPDATE STATUS -------- */
      .addCase(updateTaskStatus.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updated = action.payload?.data || action.payload;
        const updatedTask = updated?.id ? updated : null;

        if (updatedTask) {
          // Nếu state.tasks là object có field data (dạng { data: [...] })
          if ((state.tasks as any).data) {
            const idx = (state.tasks as any).data.findIndex(
              (t: Task) => t.id === updatedTask.id,
            );
            if (idx !== -1)
              (state.tasks as any).data[idx] = {
                ...(state.tasks as any).data[idx],
                ...updatedTask,
              };
          }
          // Nếu state.tasks là mảng thuần
          else if (Array.isArray(state.tasks)) {
            const idx = state.tasks.findIndex((t) => t.id === updatedTask.id);
            if (idx !== -1)
              state.tasks[idx] = { ...state.tasks[idx], ...updatedTask };
          }
        }

        // Cập nhật selectedTask nếu đang mở
        if (state.selectedTask?.id === updatedTask?.id) {
          state.selectedTask = { ...state.selectedTask, ...updatedTask };
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- UPDATE REVIEW -------- */
      .addCase(updateTaskReview.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateTaskReview.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";

        const updatedReview = action.payload?.data || action.payload;
        const taskId = updatedReview?.task_id;

        // Nếu có selectedTask hiện tại thì cập nhật thông tin review
        if (state.selectedTask && state.selectedTask.id === taskId) {
          state.selectedTask.review = updatedReview;
        }

        // Nếu state.tasks là danh sách các task — có thể thêm cờ reviewResult
        if (Array.isArray(state.tasks)) {
          const idx = state.tasks.findIndex((t) => t.id === taskId);
          if (idx !== -1) {
            state.tasks[idx] = {
              ...state.tasks[idx],
              reviewResult: updatedReview.result,
              reviewReason: updatedReview.reason,
              reviewUpdatedAt: updatedReview.updated_at,
            };
          }
        }
      })
      .addCase(updateTaskReview.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- DELETE -------- */
      .addCase(deleteTask.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        if (Array.isArray(state.tasks)) {
          state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
        } else if ((state.tasks as any).data) {
          (state.tasks as any).data = (state.tasks as any).data.filter(
            (t: Task) => t.id !== action.payload.id,
          );
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- STATS OVERVIEW -------- */
      .addCase(fetchTaskStatsOverview.pending, (state) => {
        state.statsStatus = "loading";
      })
      .addCase(fetchTaskStatsOverview.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.statsOverview = action.payload;
      })
      .addCase(fetchTaskStatsOverview.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- STATS BY USER -------- */
      .addCase(fetchTaskStatsByUser.pending, (state) => {
        state.statsByUserStatus = "loading";
      })
      .addCase(fetchTaskStatsByUser.fulfilled, (state, action) => {
        state.statsByUserStatus = "succeeded";
        state.statsByUser = action.payload;
      })
      .addCase(fetchTaskStatsByUser.rejected, (state, action) => {
        state.statsByUserStatus = "failed";
        state.statsByUserError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- FETCH TASKS BY CURRENT SUPERVISOR -------- */
      .addCase(fetchTasksByCurrentSupervisor.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchTasksByCurrentSupervisor.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.tasks = action.payload?.data || action.payload;
      })
      .addCase(fetchTasksByCurrentSupervisor.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- FETCH TASKS BY CURRENT PACKER -------- */
      .addCase(fetchTasksByCurrentPacker.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchTasksByCurrentPacker.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.tasks = action.payload?.data || action.payload;
      })
      .addCase(fetchTasksByCurrentPacker.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      });
  },
});

export const { clearSelectedTask, clearTaskItems } = taskSlice.actions;
export default taskSlice.reducer;
