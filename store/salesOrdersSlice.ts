import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createSalesOrder as createSalesOrderAPI,
  CreateSalesOrderData,
  getListSalesOrders as getListSalesOrdersAPI,
  getSalesOrderById as getSalesOrderByIdAPI,
  SalesOrderParams,
  setSalesOrderAdminLock as updateAdminLockStatusAPI,
  UpdateSalesOrderData,
  updateSalesOrder as updateSalesOrderInfoAPI,
} from "../services/salesOrdersService";

export interface SalesOrder {
  id: string;
  [key: string]: any;
}

export interface Pagination {
  total?: number;
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface SalesOrdersState {
  salesOrders: {
    data: SalesOrder[];
    pagination: Pagination;
  };
  salesOrdersById: SalesOrder | {};
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  updateAdminLockStatus: "idle" | "loading" | "succeeded" | "failed";
  updateAdminLockError: string | null;
}

const initialState: SalesOrdersState = {
  salesOrders: {
    data: [],
    pagination: {},
  },
  salesOrdersById: {},
  fetchStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  fetchError: null,
  createStatus: "idle",
  createError: null,
  updateStatus: "idle",
  updateError: null,
  updateAdminLockStatus: "idle",
  updateAdminLockError: null,
};

// Lấy danh sách orders
export const fetchSalesOrders = createAsyncThunk(
  "salesOrders/fetchSalesOrders",
  async (params: SalesOrderParams = {}, { rejectWithValue }) => {
    try {
      const response = await getListSalesOrdersAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
// Lấy danh sách orders của seller (q = sellerId, limit, offset)
export const fetchSalesOrdersBySeller = createAsyncThunk(
  "salesOrders/fetchSalesOrdersBySeller",
  async (params: SalesOrderParams, { rejectWithValue }) => {
    try {
      const response = await getListSalesOrdersAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Tạo order mới
export const createSalesOrder = createAsyncThunk(
  "salesOrders/createSalesOrder",
  async (orderData: CreateSalesOrderData, { rejectWithValue }) => {
    try {
      const response = await createSalesOrderAPI(orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Lấy thông tin order
export const fetchSalesOrderById = createAsyncThunk(
  "salesOrders/fetchSalesOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getSalesOrderByIdAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Update thông tin order
export const updateSalesOrderInfo = createAsyncThunk(
  "salesOrders/updateSalesOrderInfo",
  async (
    { id, orderData }: { id: string; orderData: UpdateSalesOrderData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateSalesOrderInfoAPI(id, orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// cập nhật adminLock
export const updateAdminLockStatus = createAsyncThunk(
  "salesOrders/updateAdminLockStatus",
  async (
    { id, adminLocked }: { id: string; adminLocked: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateAdminLockStatusAPI(id, adminLocked);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const salesOrdersSlice = createSlice({
  name: "salesOrders",
  initialState,
  reducers: {
    resetSalesOrders: (state) => {
      state.salesOrders = {
        data: [],
        pagination: {},
      };
      state.fetchStatus = "idle";
      state.fetchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSalesOrders
      .addCase(fetchSalesOrders.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const { data, pagination } = action.payload;
        if (pagination?.offset && pagination.offset > 0) {
          // Append if loading more
          state.salesOrders.data = [...state.salesOrders.data, ...data];
        } else {
          // Replace if first page
          state.salesOrders.data = data;
        }
        state.salesOrders.pagination = pagination;
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })
      // fetchSalesOrdersBySeller
      .addCase(fetchSalesOrdersBySeller.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchSalesOrdersBySeller.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const { data, pagination } = action.payload;
        if (pagination?.offset && pagination.offset > 0) {
          // Append if loading more
          state.salesOrders.data = [...state.salesOrders.data, ...data];
        } else {
          // Replace if first page
          state.salesOrders.data = data;
        }
        state.salesOrders.pagination = pagination;
      })
      .addCase(fetchSalesOrdersBySeller.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })
      // createSalesOrder
      .addCase(createSalesOrder.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // Optionally add the new order to the list
        state.salesOrders.data.unshift(action.payload);
      })
      .addCase(createSalesOrder.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as any)?.message || action.error.message;
      })
      // fetchSalesOrderById
      .addCase(fetchSalesOrderById.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchSalesOrderById.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.salesOrdersById = action.payload.data;
      })
      .addCase(fetchSalesOrderById.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })
      // updateSalesOrderInfo
      .addCase(updateSalesOrderInfo.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateSalesOrderInfo.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.salesOrdersById = action.payload.data;
      })
      .addCase(updateSalesOrderInfo.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message;
      })
      // updateAdminLockStatus
      .addCase(updateAdminLockStatus.pending, (state) => {
        state.updateAdminLockStatus = "loading";
        state.updateAdminLockError = null;
      })
      .addCase(updateAdminLockStatus.fulfilled, (state, action) => {
        state.updateAdminLockStatus = "succeeded";
        state.salesOrdersById = action.payload.data;
      })
      .addCase(updateAdminLockStatus.rejected, (state, action) => {
        state.updateAdminLockStatus = "failed";
        state.updateAdminLockError =
          (action.payload as any)?.message || action.error.message;
      });
  },
});

export const { resetSalesOrders } = salesOrdersSlice.actions;
export default salesOrdersSlice.reducer;
