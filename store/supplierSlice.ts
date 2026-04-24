import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createSupplier as createSupplierAPI,
  deleteBulkSuppliers as deleteBulkSuppliersAPI,
  deleteSupplier as deleteSupplierAPI,
  getRecentSuppliers as getRecentSuppliersAPI,
  getSupplierByCode as getSupplierByCodeAPI,
  getSupplierById as getSupplierByIdAPI,
  getSupplierCreationStats as getSupplierCreationStatsAPI,
  listSuppliers as listSuppliersAPI,
  searchSuppliers as searchSuppliersAPI,
  SupplierData,
  SupplierParams,
  updateSupplier as updateSupplierAPI,
} from "../services/supplierService";

// ===================== INTERFACES =====================
export interface Supplier {
  id: string;
  [key: string]: any;
}

export interface Pagination {
  total?: number;
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface SupplierState {
  suppliers:
    | {
        data: Supplier[];
        pagination: Pagination;
      }
    | Supplier[]; // Handling both paginated and non-paginated structures if necessary, though consistency is better.
  selectedSupplier: Supplier | null;
  stats: any[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchMoreStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteBulkStatus: "idle" | "loading" | "succeeded" | "failed";
  searchStatus: "idle" | "loading" | "succeeded" | "failed";
  recentStatus: "idle" | "loading" | "succeeded" | "failed";
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  deleteBulkError: string | null;
  searchError: string | null;
  recentError: string | null;
  statsError: string | null;
}

// ===================== INITIAL STATE =====================
const initialState: SupplierState = {
  suppliers: [],
  selectedSupplier: null,
  stats: [],
  fetchStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  fetchMoreStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  deleteBulkStatus: "idle",
  searchStatus: "idle",
  recentStatus: "idle",
  statsStatus: "idle",
  fetchError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  deleteBulkError: null,
  searchError: null,
  recentError: null,
  statsError: null,
};

// ===================== THUNKS =====================

// Lấy danh sách suppliers
export const fetchListSuppliers = createAsyncThunk(
  "supplier/fetchListSuppliers",
  async (params: SupplierParams = {}, { rejectWithValue }) => {
    try {
      const response = await listSuppliersAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Tạo supplier mới
export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (supplierData: SupplierData, { rejectWithValue }) => {
    try {
      const response = await createSupplierAPI(supplierData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Cập nhật supplier
export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async (
    {
      supplierId,
      supplierData,
    }: { supplierId: string; supplierData: SupplierData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateSupplierAPI(supplierId, supplierData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Xóa supplier theo ID
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (supplierId: string, { rejectWithValue }) => {
    try {
      const response = await deleteSupplierAPI(supplierId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Xóa nhiều suppliers
export const deleteBulkSuppliers = createAsyncThunk(
  "supplier/deleteBulkSuppliers",
  async (ids: string[], { rejectWithValue }) => {
    try {
      const response = await deleteBulkSuppliersAPI(ids);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Tìm kiếm nâng cao
export const searchSuppliers = createAsyncThunk(
  "supplier/searchSuppliers",
  async (params: SupplierParams, { rejectWithValue }) => {
    try {
      const response = await searchSuppliersAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Lấy suppliers gần đây
export const fetchRecentSuppliers = createAsyncThunk(
  "supplier/fetchRecentSuppliers",
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await getRecentSuppliersAPI(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Lấy thống kê supplier theo tháng
export const fetchSupplierCreationStats = createAsyncThunk(
  "supplier/fetchSupplierCreationStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSupplierCreationStatsAPI();
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Lấy chi tiết supplier theo ID
export const fetchSupplierById = createAsyncThunk(
  "supplier/fetchSupplierById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getSupplierByIdAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Lấy chi tiết supplier theo mã code
export const fetchSupplierByCode = createAsyncThunk(
  "supplier/fetchSupplierByCode",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await getSupplierByCodeAPI(code);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// ===================== SLICE =====================
const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearSelectedSupplier: (state) => {
      state.selectedSupplier = null;
    },
    setSelectedSupplier: (state, action) => {
      state.selectedSupplier = action.payload;
    },
    resetSuppliers: (state) => {
      state.suppliers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchListSuppliers.pending, (state, action) => {
        const offset = action.meta?.arg?.offset ?? 0;
        if (offset === 0) {
          state.fetchStatus = "loading";
        } else {
          state.fetchMoreStatus = "loading";
        }
        state.fetchError = null;
      })
      .addCase(fetchListSuppliers.fulfilled, (state, action) => {
        const offset = action.meta?.arg?.offset ?? 0;
        const newData = action.payload?.data || action.payload;
        const pagination = action.payload?.pagination;

        if (offset === 0) {
          state.suppliers = action.payload;
          state.fetchStatus = "succeeded";
        } else {
          const existingData = (state.suppliers as any)?.data
            ? (state.suppliers as any).data
            : state.suppliers;

          if (Array.isArray(existingData) && Array.isArray(newData)) {
            if ((state.suppliers as any)?.data) {
              (state.suppliers as any).data = [...existingData, ...newData];
              if (pagination) {
                (state.suppliers as any).pagination = pagination;
              }
            } else {
              state.suppliers = [...existingData, ...newData];
            }
          }
          state.fetchMoreStatus = "succeeded";
        }
      })
      .addCase(fetchListSuppliers.rejected, (state, action) => {
        const offset = action.meta?.arg?.offset ?? 0;
        if (offset === 0) {
          state.fetchStatus = "failed";
        } else {
          state.fetchMoreStatus = "failed";
        }
        state.fetchError = (action.payload as any)?.message;
      })

      // Create
      .addCase(createSupplier.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        if (Array.isArray(state.suppliers)) {
          state.suppliers.push(action.payload);
        } else if ((state.suppliers as any).data) {
          (state.suppliers as any).data.push(action.payload);
        }
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = (action.payload as any)?.message;
      })

      // Update
      .addCase(updateSupplier.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        let index = -1;
        if (Array.isArray(state.suppliers)) {
          index = state.suppliers.findIndex((s) => s.id === action.payload.id);
          if (index !== -1) {
            state.suppliers[index] = action.payload;
          }
        } else if ((state.suppliers as any).data) {
          index = (state.suppliers as any).data.findIndex(
            (s: Supplier) => s.id === action.payload.id,
          );
          if (index !== -1) {
            (state.suppliers as any).data[index] = action.payload;
          }
        }
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = (action.payload as any)?.message;
      })

      // Delete single
      .addCase(deleteSupplier.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        if (Array.isArray(state.suppliers)) {
          state.suppliers = state.suppliers.filter(
            (s) => s.id !== action.payload.id,
          );
        } else if ((state.suppliers as any).data) {
          (state.suppliers as any).data = (state.suppliers as any).data.filter(
            (s: Supplier) => s.id !== action.payload.id,
          );
        }
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = (action.payload as any)?.message;
      })

      // Delete bulk
      .addCase(deleteBulkSuppliers.pending, (state) => {
        state.deleteBulkStatus = "loading";
      })
      .addCase(deleteBulkSuppliers.fulfilled, (state) => {
        state.deleteBulkStatus = "succeeded";
      })
      .addCase(deleteBulkSuppliers.rejected, (state, action) => {
        state.deleteBulkStatus = "failed";
        state.deleteBulkError = (action.payload as any)?.message;
      })

      // Search
      .addCase(searchSuppliers.pending, (state) => {
        state.searchStatus = "loading";
        state.searchError = null;
      })
      .addCase(searchSuppliers.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.suppliers = action.payload;
      })
      .addCase(searchSuppliers.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.searchError = (action.payload as any)?.message;
      })

      // Recent
      .addCase(fetchRecentSuppliers.pending, (state) => {
        state.recentStatus = "loading";
        state.recentError = null;
      })
      .addCase(fetchRecentSuppliers.fulfilled, (state, action) => {
        state.recentStatus = "succeeded";
        state.suppliers = action.payload;
      })
      .addCase(fetchRecentSuppliers.rejected, (state, action) => {
        state.recentStatus = "failed";
        state.recentError = (action.payload as any)?.message;
      })

      // Stats
      .addCase(fetchSupplierCreationStats.pending, (state) => {
        state.statsStatus = "loading";
        state.statsError = null;
      })
      .addCase(fetchSupplierCreationStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchSupplierCreationStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = (action.payload as any)?.message;
      })

      // Fetch by ID or Code
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.selectedSupplier = action.payload;
      })
      .addCase(fetchSupplierByCode.fulfilled, (state, action) => {
        state.selectedSupplier = action.payload;
      });
  },
});

export const { clearSelectedSupplier, setSelectedSupplier, resetSuppliers } =
  supplierSlice.actions;
export default supplierSlice.reducer;
