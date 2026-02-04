import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createDepartment as createDepartmentAPI,
  deleteDepartment as deleteDepartmentAPI,
  DepartmentData,
  DepartmentParams,
  getDepartment as getDepartmentAPI,
  listDepartments as listDepartmentsAPI,
  updateDepartment as updateDepartmentAPI,
  updateDepartmentStatus as updateDepartmentStatusAPI,
} from "../services/departmentService";

export interface Department {
  id: string;
  [key: string]: any;
}

export interface Pagination {
  total?: number;
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface DepartmentState {
  departments: {
    data: Department[];
    pagination: Pagination;
  };
  departmentById: Department | {};
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
}

const initialState: DepartmentState = {
  departments: {
    data: [],
    pagination: {},
  },
  departmentById: {},
  fetchStatus: "idle",
  fetchError: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  deleteStatus: "idle",
  deleteError: null,
};

// Lấy danh sách departments
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async (params: DepartmentParams, { rejectWithValue }) => {
    try {
      const response = await listDepartmentsAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Lấy chi tiết department
export const fetchDepartmentById = createAsyncThunk(
  "departments/fetchDepartmentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getDepartmentAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Tạo department
export const createDepartment = createAsyncThunk(
  "departments/createDepartment",
  async (data: DepartmentData, { rejectWithValue }) => {
    try {
      const response = await createDepartmentAPI(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Cập nhật department
export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async (
    { id, data }: { id: string; data: DepartmentData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateDepartmentAPI(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Cập nhật trạng thái department
export const updateDepartmentStatus = createAsyncThunk(
  "departments/updateDepartmentStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateDepartmentStatusAPI(id, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Xóa department
export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteDepartmentAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    resetDepartmentState: (state) => {
      // Reset status flags but keep data if needed, or reset everything
      state.createStatus = "idle";
      state.createError = null;
      state.updateStatus = "idle";
      state.updateError = null;
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    clearDepartmentDetail: (state) => {
      state.departmentById = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDepartments
      .addCase(fetchDepartments.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.departments.data = action.payload.data;
        state.departments.pagination = action.payload.pagination;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as string) || action.error.message || null;
      })
      // fetchDepartmentById
      .addCase(fetchDepartmentById.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.departmentById = action.payload.data;
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as string) || action.error.message || null;
      })
      // createDepartment
      .addCase(createDepartment.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createDepartment.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as string) || action.error.message || null;
      })
      // updateDepartment
      .addCase(updateDepartment.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateDepartment.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as string) || action.error.message || null;
      })
      // updateDepartmentStatus
      .addCase(updateDepartmentStatus.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateDepartmentStatus.fulfilled, (state) => {
        state.updateStatus = "succeeded";
      })
      .addCase(updateDepartmentStatus.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as string) || action.error.message || null;
      })
      // deleteDepartment
      .addCase(deleteDepartment.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteDepartment.fulfilled, (state) => {
        state.deleteStatus = "succeeded";
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export const { resetDepartmentState, clearDepartmentDetail } =
  departmentSlice.actions;

export default departmentSlice.reducer;
