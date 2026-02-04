import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createInventoryLot as createInventoryLotAPI,
  deleteInventoryLot as deleteInventoryLotAPI,
  findInventoryLotsInDepartmentByProduct as findInventoryLotsInDepartmentByProductAPI,
  getInventoryLotById as getInventoryLotByIdAPI,
  getInventoryLotDetail as getInventoryLotDetailAPI,
  getListInventoryLots as getListInventoryLotsAPI,
  getListInventoryLotsByProductId as getListInventoryLotsByProductIdAPI,
  InventoryLotData,
  InventoryLotParams,
  updateInventoryLot as updateInventoryLotAPI,
} from "../services/inventoryLotService";

export interface InventoryLot {
  id: string;
  [key: string]: any;
}

export interface Pagination {
  total?: number;
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface InventoryLotState {
  inventoryLots:
    | { data: InventoryLot[]; pagination: Pagination }
    | InventoryLot[]
    | any; // Support legacy or mixed types if necessary, preferably stricter
  inventoryLotsByProductId:
    | { data: InventoryLot[]; pagination: Pagination }
    | InventoryLot[]
    | any;
  inventoryLotsById: InventoryLot | {};
  inventoryLotDetail: InventoryLot | {};
  fetchStatus: "idle" | "loading" | "succeeded" | "failed"; // get by product ID
  fetchListStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchByIdStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchDetailStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  fetchListError: string | null;
  fetchByIdError: string | null;
  fetchDetailError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: InventoryLotState = {
  inventoryLots: [],
  inventoryLotsByProductId: [],
  inventoryLotsById: {},
  inventoryLotDetail: {},
  fetchStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed' get by product ID
  fetchListStatus: "idle",
  fetchByIdStatus: "idle",
  fetchDetailStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  fetchError: null,
  fetchListError: null,
  fetchByIdError: null,
  fetchDetailError: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

// Async thunk để lấy danh sách inventory lots theo product ID
export const fetchInventoryLots = createAsyncThunk(
  "inventoryLot/fetchInventoryLots",
  async (
    { productId, params }: { productId: string; params: InventoryLotParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await getListInventoryLotsByProductIdAPI(
        productId,
        params,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);
// Async thunk để lấy chi tiết inventory lot theo ID
export const fetchInventoryLotById = createAsyncThunk(
  "inventoryLot/fetchInventoryLotById",
  async (inventoryLotId: string, { rejectWithValue }) => {
    try {
      const response = await getInventoryLotByIdAPI(inventoryLotId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);
// Async thunk để lấy danh sách inventory lots với phân trang và tìm kiếm
export const fetchListInventoryLots = createAsyncThunk(
  "inventoryLot/fetchListInventoryLots",
  async (params: InventoryLotParams, { rejectWithValue }) => {
    try {
      const response = await getListInventoryLotsAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Lấy danh sách lot theo department + product (lọc qty_on_hand > 0 && expiry_date > now())
export const fetchInventoryLotsByDepartmentAndProduct = createAsyncThunk(
  "inventoryLot/fetchInventoryLotsByDepartmentAndProduct",
  async (
    {
      departmentId,
      productId,
      params,
    }: { departmentId: string; productId: string; params: InventoryLotParams },
    { rejectWithValue },
  ) => {
    try {
      const res = await findInventoryLotsInDepartmentByProductAPI(
        departmentId,
        productId,
        params,
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Tạo inventory lot mới (Admin, Manager)
export const createInventoryLot = createAsyncThunk(
  "inventoryLot/createInventoryLot",
  async (data: InventoryLotData, { rejectWithValue }) => {
    try {
      const response = await createInventoryLotAPI(data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Cập nhật thông tin inventory lot (Admin, Manager)
export const updateInventoryLot = createAsyncThunk(
  "inventoryLot/updateInventoryLot",
  async (
    {
      inventoryLotId,
      data,
    }: { inventoryLotId: string; data: InventoryLotData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateInventoryLotAPI(inventoryLotId, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Xóa inventory lot (Admin, Manager)
export const deleteInventoryLot = createAsyncThunk(
  "inventoryLot/deleteInventoryLot",
  async (inventoryLotId: string, { rejectWithValue }) => {
    try {
      await deleteInventoryLotAPI(inventoryLotId);
      return inventoryLotId; // Return ID to update state
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

// Lấy chi tiết inventory lot theo ID
export const fetchInventoryLotDetail = createAsyncThunk(
  "inventoryLot/fetchInventoryLotDetail",
  async (inventoryLotId: string, { rejectWithValue }) => {
    try {
      const response = await getInventoryLotDetailAPI(inventoryLotId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
      });
    }
  },
);

const inventoryLotSlice = createSlice({
  name: "inventoryLot",
  initialState,
  reducers: {
    resetInventoryLotDetail: (state) => {
      state.inventoryLotDetail = {};
      state.fetchDetailStatus = "idle";
      state.fetchDetailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory lots by product ID
      .addCase(fetchInventoryLots.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchInventoryLots.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        // state.inventoryLotsByProductId = action.payload;
        state.inventoryLotsByProductId = {
          data: action.payload.data,
          pagination: action.payload.pagination,
        };
      })
      .addCase(fetchInventoryLots.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = (action.payload as any)?.message || "Failed";
      })
      // Fetch inventory lot by ID
      .addCase(fetchInventoryLotById.pending, (state) => {
        state.fetchByIdStatus = "loading";
        state.fetchByIdError = null;
      })
      .addCase(fetchInventoryLotById.fulfilled, (state, action) => {
        state.fetchByIdStatus = "succeeded";
        state.inventoryLotsById = action.payload;
      })
      .addCase(fetchInventoryLotById.rejected, (state, action) => {
        state.fetchByIdStatus = "failed";
        state.fetchByIdError = (action.payload as any)?.message || "Failed";
      })
      // Fetch list of inventory lots
      .addCase(fetchListInventoryLots.pending, (state) => {
        state.fetchListStatus = "loading";
        state.fetchListError = null;
      })
      .addCase(fetchListInventoryLots.fulfilled, (state, action) => {
        state.fetchListStatus = "succeeded";
        state.inventoryLots = action.payload;
      })
      .addCase(fetchListInventoryLots.rejected, (state, action) => {
        state.fetchListStatus = "failed";
        state.fetchListError = (action.payload as any)?.message || "Failed";
      })

      // Fetch inventory lots by department + product
      .addCase(fetchInventoryLotsByDepartmentAndProduct.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(
        fetchInventoryLotsByDepartmentAndProduct.fulfilled,
        (state, action) => {
          state.fetchStatus = "succeeded";
          state.inventoryLotsByProductId = {
            data: action.payload?.data || [],
            pagination: action.payload?.pagination || {},
          };
        },
      )
      .addCase(
        fetchInventoryLotsByDepartmentAndProduct.rejected,
        (state, action) => {
          state.fetchStatus = "failed";
          state.fetchError = (action.payload as any)?.message || "Failed";
        },
      )

      // Create inventory lot
      .addCase(createInventoryLot.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createInventoryLot.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // support inventoryLots as array OR { data: [], pagination: {} }
        if (Array.isArray(state.inventoryLots)) {
          state.inventoryLots.unshift(action.payload);
        } else if (
          state.inventoryLots &&
          Array.isArray((state.inventoryLots as any).data)
        ) {
          (state.inventoryLots as any).data.unshift(action.payload);
          // bump total if pagination present
          if ((state.inventoryLots as any).pagination) {
            (state.inventoryLots as any).pagination.total =
              ((state.inventoryLots as any).pagination.total || 0) + 1;
          }
        } else {
          state.inventoryLots = [action.payload];
        }
      })
      .addCase(createInventoryLot.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = (action.payload as any)?.message || "Failed";
      })
      // Update inventory lot
      .addCase(updateInventoryLot.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateInventoryLot.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const payload = action.payload;
        if (Array.isArray(state.inventoryLots)) {
          const idx = state.inventoryLots.findIndex((l) => l.id === payload.id);
          if (idx !== -1) state.inventoryLots[idx] = payload;
        } else if (
          state.inventoryLots &&
          Array.isArray((state.inventoryLots as any).data)
        ) {
          const idx = (state.inventoryLots as any).data.findIndex(
            (l: InventoryLot) => l.id === payload.id,
          );
          if (idx !== -1) (state.inventoryLots as any).data[idx] = payload;
        }
      })
      .addCase(updateInventoryLot.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = (action.payload as any)?.message || "Failed";
      })
      // Delete inventory lot
      .addCase(deleteInventoryLot.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteInventoryLot.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        const deletedId = action.payload as unknown as string; // Payload returned from thunk
        if (!deletedId) return;
        if (Array.isArray(state.inventoryLots)) {
          state.inventoryLots = state.inventoryLots.filter(
            (lot) => lot.id !== deletedId,
          );
        } else if (
          state.inventoryLots &&
          Array.isArray((state.inventoryLots as any).data)
        ) {
          (state.inventoryLots as any).data = (
            state.inventoryLots as any
          ).data.filter((lot: InventoryLot) => lot.id !== deletedId);
          if ((state.inventoryLots as any).pagination) {
            (state.inventoryLots as any).pagination.total = Math.max(
              ((state.inventoryLots as any).pagination.total || 1) - 1,
              0,
            );
          }
        }
      })
      .addCase(deleteInventoryLot.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError = (action.payload as any)?.message || "Failed";
      })
      // Fetch inventory lot detail
      .addCase(fetchInventoryLotDetail.pending, (state) => {
        state.fetchDetailStatus = "loading";
        state.fetchDetailError = null;
      })
      .addCase(fetchInventoryLotDetail.fulfilled, (state, action) => {
        state.fetchDetailStatus = "succeeded";
        state.inventoryLotDetail = action.payload;
      })
      .addCase(fetchInventoryLotDetail.rejected, (state, action) => {
        state.fetchDetailStatus = "failed";
        state.fetchDetailError = (action.payload as any)?.message || "Failed";
      });
  },
});
export const { resetInventoryLotDetail } = inventoryLotSlice.actions;
export default inventoryLotSlice.reducer;
