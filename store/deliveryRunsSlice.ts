import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  cancelDeliveryRunOrder as cancelDeliveryRunOrderAPI,
  CancelDeliveryRunOrderData,
  completeDeliveryRunOrder as completeDeliveryRunOrderAPI,
  CompleteDeliveryRunOrderData,
  failDeliveryRunOrder as failDeliveryRunOrderAPI,
  FailDeliveryRunOrderData,
  reopenDeliveryRunOrder as reopenDeliveryRunOrderAPI,
  ReopenDeliveryRunOrderData,
  startDeliveryRunOrder as startDeliveryRunOrderAPI,
} from "../services/deliveryRunOrdersService";
import {
  cancelDeliveryRun as cancelDeliveryRunAPI,
  completeDeliveryOrder as completeDeliveryOrderAPI,
  CompleteDeliveryOrderData,
  completeDeliveryRun as completeDeliveryRunAPI,
  createDeliveryRun as createDeliveryRunAPI,
  CreateDeliveryRunData,
  deleteDeliveryRun as deleteDeliveryRunAPI,
  DeliveryRunParams,
  failDeliveryOrder as failDeliveryOrderAPI,
  getDeliveryRunById as getDeliveryRunByIdAPI,
  getDeliveryRunOrdersByRunId as getDeliveryRunOrdersByRunIdAPI,
  getListDeliveryRuns as getListDeliveryRunsAPI,
  startDeliveryOrder as startDeliveryOrderAPI,
  startDeliveryRun as startDeliveryRunAPI,
  updateDeliveryRun as updateDeliveryRunAPI,
  UpdateDeliveryRunData,
} from "../services/deliveryRunsService";

export interface DeliveryRun {
  id: string;
  [key: string]: any;
}

export interface Pagination {
  total?: number;
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface DeliveryRunSummary {
  total: number;
  inProgress: number;
  completed: number;
}

const deliveryRunsAdapter = createEntityAdapter<DeliveryRun>();

const initialState = deliveryRunsAdapter.getInitialState({
  pagination: {} as Pagination,
  deliveryRunById: {} as DeliveryRun | {},
  fetchStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  fetchError: null as string | null,
  createStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  createError: null as string | null,
  updateStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  updateError: null as string | null,
  deleteStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  deleteError: null as string | null,
  startStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  startError: null as string | null,
  completeStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  completeError: null as string | null,
  cancelStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  cancelError: null as string | null,
  // Delivery run orders status
  orderStartStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  orderStartError: null as string | null,
  orderCompleteStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  orderCompleteError: null as string | null,
  orderCancelStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  orderCancelError: null as string | null,
  orderFailStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  orderFailError: null as string | null,
  orderReopenStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
  orderReopenError: null as string | null,
  summary: { total: 0, inProgress: 0, completed: 0 } as DeliveryRunSummary,
  // Real-time shipper tracking
  shipperLocation: null as { lat: number; lng: number; lastUpdate: string; vehicle_type?: string } | null,
});

export type DeliveryRunsState = typeof initialState;

// Lấy danh sách delivery runs
export const fetchDeliveryRuns = createAsyncThunk(
  "deliveryRuns/fetchDeliveryRuns",
  async (params: DeliveryRunParams, { rejectWithValue }) => {
    try {
      const response = await getListDeliveryRunsAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Lấy thông tin delivery run theo ID
export const fetchDeliveryRunById = createAsyncThunk(
  "deliveryRuns/fetchDeliveryRunById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getDeliveryRunByIdAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Tạo delivery run mới
export const createDeliveryRun = createAsyncThunk(
  "deliveryRuns/createDeliveryRun",
  async (data: CreateDeliveryRunData, { rejectWithValue }) => {
    try {
      const response = await createDeliveryRunAPI(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Cập nhật delivery run
export const updateDeliveryRun = createAsyncThunk(
  "deliveryRuns/updateDeliveryRun",
  async (
    { id, data }: { id: string; data: UpdateDeliveryRunData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateDeliveryRunAPI(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Xóa delivery run
export const deleteDeliveryRun = createAsyncThunk(
  "deliveryRuns/deleteDeliveryRun",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteDeliveryRunAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Bắt đầu delivery run
export const startDeliveryRun = createAsyncThunk(
  "deliveryRuns/startDeliveryRun",
  async (
    { id, data }: { id: string; data: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await startDeliveryRunAPI(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Hoàn thành delivery run
export const completeDeliveryRun = createAsyncThunk(
  "deliveryRuns/completeDeliveryRun",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await completeDeliveryRunAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Hủy delivery run
export const cancelDeliveryRun = createAsyncThunk(
  "deliveryRuns/cancelDeliveryRun",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await cancelDeliveryRunAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Lấy danh sách orders của một delivery run
export const fetchDeliveryRunOrders = createAsyncThunk(
  "deliveryRuns/fetchDeliveryRunOrders",
  async (runId: string, { rejectWithValue }) => {
    try {
      const response = await getDeliveryRunOrdersByRunIdAPI(runId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Bắt đầu giao hàng (delivery order)
export const startDeliveryOrder = createAsyncThunk(
  "deliveryRuns/startDeliveryOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await startDeliveryOrderAPI(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Hoàn thành giao hàng (delivery order)
export const completeDeliveryOrder = createAsyncThunk(
  "deliveryRuns/completeDeliveryOrder",
  async (
    { id, data }: { id: string; data: CompleteDeliveryOrderData },
    { rejectWithValue },
  ) => {
    try {
      const response = await completeDeliveryOrderAPI(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Đánh dấu giao hàng thất bại (delivery order)
export const failDeliveryOrder = createAsyncThunk(
  "deliveryRuns/failDeliveryOrder",
  async ({ id, note }: { id: string; note: string }, { rejectWithValue }) => {
    try {
      const response = await failDeliveryOrderAPI(id, note);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// ===== NEW DELIVERY RUN ORDERS ACTIONS =====

// Bắt đầu giao hàng cho một order (new service)
export const startDeliveryRunOrder = createAsyncThunk(
  "deliveryRuns/startDeliveryRunOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await startDeliveryRunOrderAPI(orderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Hoàn thành giao hàng cho một order (new service)
export const completeDeliveryRunOrder = createAsyncThunk(
  "deliveryRuns/completeDeliveryRunOrder",
  async (
    { orderId, data }: { orderId: string; data: CompleteDeliveryRunOrderData },
    { rejectWithValue },
  ) => {
    try {
      const response = await completeDeliveryRunOrderAPI(orderId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Hủy giao hàng cho một order (new service - admin only)
export const cancelDeliveryRunOrder = createAsyncThunk(
  "deliveryRuns/cancelDeliveryRunOrder",
  async (
    { orderId, data }: { orderId: string; data: CancelDeliveryRunOrderData },
    { rejectWithValue },
  ) => {
    try {
      const response = await cancelDeliveryRunOrderAPI(orderId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Đánh dấu giao hàng thất bại cho một order (new service - admin only)
export const failDeliveryRunOrder = createAsyncThunk(
  "deliveryRuns/failDeliveryRunOrder",
  async (
    { orderId, data }: { orderId: string; data: FailDeliveryRunOrderData },
    { rejectWithValue },
  ) => {
    try {
      const response = await failDeliveryRunOrderAPI(orderId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// ✅ Thêm thunk mở lại giao hàng cho một order
export const reopenDeliveryRunOrder = createAsyncThunk(
  "deliveryRuns/reopenDeliveryRunOrder",
  async (
    { orderId, data }: { orderId: string; data: ReopenDeliveryRunOrderData },
    { rejectWithValue },
  ) => {
    try {
      const response = await reopenDeliveryRunOrderAPI(orderId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const deliveryRunsSlice = createSlice({
  name: "deliveryRuns",
  initialState,
  reducers: {
    resetDeliveryRuns: (state) => {
      deliveryRunsAdapter.removeAll(state);
      state.pagination = {};
      state.summary = { total: 0, inProgress: 0, completed: 0 };
      state.fetchStatus = "idle";
      state.fetchError = null;
    },
    resetDeliveryRunById: (state) => {
      state.deliveryRunById = {};
    },
    // Real-time actions
    addDeliveryRunRealtime: (state, action) => {
      deliveryRunsAdapter.addOne(state, action.payload);
      if (state.pagination.total !== undefined) {
        state.pagination.total += 1;
      }
    },
    updateDeliveryRunRealtime: (state, action) => {
      deliveryRunsAdapter.upsertOne(state, action.payload);
      if (
        state.deliveryRunById &&
        (state.deliveryRunById as any).id === action.payload.id
      ) {
        state.deliveryRunById = { ...state.deliveryRunById, ...action.payload };
      }
    },
    deleteDeliveryRunRealtime: (state, action) => {
      deliveryRunsAdapter.removeOne(state, action.payload.id);
      if (state.pagination.total !== undefined) {
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      }
    },
    updateShipperLocation: (state, action) => {
       const lat = Number(action.payload.lat);
       const lng = Number(action.payload.lng);
       
       if (Number.isFinite(lat) && Number.isFinite(lng)) {
         state.shipperLocation = {
            lat,
            lng,
            lastUpdate: action.payload.timestamp || new Date().toISOString(),
            vehicle_type: action.payload.vehicle_type || (state.deliveryRunById as any)?.vehicle_type
         };
       }
    },
    clearShipperLocation: (state) => {
       state.shipperLocation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDeliveryRuns
      .addCase(fetchDeliveryRuns.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchDeliveryRuns.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        const { data, pagination, summary } = action.payload;
        if (pagination?.offset && pagination.offset > 0) {
          deliveryRunsAdapter.addMany(state, data);
        } else {
          deliveryRunsAdapter.setAll(state, data);
        }
        state.pagination = pagination;
        if (summary) {
          state.summary = summary;
        }
      })
      .addCase(fetchDeliveryRuns.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as string) || action.error.message || null;
      })
      // fetchDeliveryRunById
      .addCase(fetchDeliveryRunById.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchDeliveryRunById.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.deliveryRunById = action.payload.data;
        deliveryRunsAdapter.upsertOne(state, action.payload.data);

        // Sync shipper location from the fetched detail if available
        const { shipperLastLat, shipperLastLng, status } = action.payload.data || {};
        if (status === 'in_progress' && shipperLastLat && shipperLastLng) {
           state.shipperLocation = {
              lat: Number(shipperLastLat),
              lng: Number(shipperLastLng),
              lastUpdate: new Date().toISOString(),
              vehicle_type: action.payload.data.vehicle_type
           };
        }
      })
      .addCase(fetchDeliveryRunById.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as string) || action.error.message || null;
      })
      // createDeliveryRun
      .addCase(createDeliveryRun.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createDeliveryRun.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        if (action.payload) {
          deliveryRunsAdapter.addOne(state, action.payload);
        }
      })
      .addCase(createDeliveryRun.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as string) || action.error.message || null;
      })
      // updateDeliveryRun
      .addCase(updateDeliveryRun.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateDeliveryRun.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        if (action.payload) {
          deliveryRunsAdapter.upsertOne(state, action.payload);
        }
      })
      .addCase(updateDeliveryRun.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as string) || action.error.message || null;
      })
      // deleteDeliveryRun
      .addCase(deleteDeliveryRun.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteDeliveryRun.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        // Assuming action.meta.arg is the ID
        deliveryRunsAdapter.removeOne(state, action.meta.arg);
      })
      .addCase(deleteDeliveryRun.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as string) || action.error.message || null;
      })
      // startDeliveryRun
      .addCase(startDeliveryRun.pending, (state) => {
        state.startStatus = "loading";
        state.startError = null;
      })
      .addCase(startDeliveryRun.fulfilled, (state, action) => {
        state.startStatus = "succeeded";
        // Also sync location if provided in the start response
        const { shipperLastLat, shipperLastLng } = action.payload.data || {};
        if (shipperLastLat && shipperLastLng) {
           state.shipperLocation = {
              lat: Number(shipperLastLat),
              lng: Number(shipperLastLng),
              lastUpdate: new Date().toISOString(),
              vehicle_type: action.payload.data.vehicle_type
           };
        }
      })
      .addCase(startDeliveryRun.rejected, (state, action) => {
        state.startStatus = "failed";
        state.startError =
          (action.payload as string) || action.error.message || null;
      })
      // completeDeliveryRun
      .addCase(completeDeliveryRun.pending, (state) => {
        state.completeStatus = "loading";
        state.completeError = null;
      })
      .addCase(completeDeliveryRun.fulfilled, (state) => {
        state.completeStatus = "succeeded";
      })
      .addCase(completeDeliveryRun.rejected, (state, action) => {
        state.completeStatus = "failed";
        state.completeError =
          (action.payload as string) || action.error.message || null;
      })
      // cancelDeliveryRun
      .addCase(cancelDeliveryRun.pending, (state) => {
        state.cancelStatus = "loading";
        state.cancelError = null;
      })
      .addCase(cancelDeliveryRun.fulfilled, (state) => {
        state.cancelStatus = "succeeded";
      })
      .addCase(cancelDeliveryRun.rejected, (state, action) => {
        state.cancelStatus = "failed";
        state.cancelError =
          (action.payload as string) || action.error.message || null;
      })
      // startDeliveryRunOrder
      .addCase(startDeliveryRunOrder.pending, (state) => {
        state.orderStartStatus = "loading";
        state.orderStartError = null;
      })
      .addCase(startDeliveryRunOrder.fulfilled, (state) => {
        state.orderStartStatus = "succeeded";
      })
      .addCase(startDeliveryRunOrder.rejected, (state, action) => {
        state.orderStartStatus = "failed";
        state.orderStartError =
          (action.payload as string) || action.error.message || null;
      })
      // completeDeliveryRunOrder
      .addCase(completeDeliveryRunOrder.pending, (state) => {
        state.orderCompleteStatus = "loading";
        state.orderCompleteError = null;
      })
      .addCase(completeDeliveryRunOrder.fulfilled, (state) => {
        state.orderCompleteStatus = "succeeded";
      })
      .addCase(completeDeliveryRunOrder.rejected, (state, action) => {
        state.orderCompleteStatus = "failed";
        state.orderCompleteError =
          (action.payload as string) || action.error.message || null;
      })
      // cancelDeliveryRunOrder
      .addCase(cancelDeliveryRunOrder.pending, (state) => {
        state.orderCancelStatus = "loading";
        state.orderCancelError = null;
      })
      .addCase(cancelDeliveryRunOrder.fulfilled, (state) => {
        state.orderCancelStatus = "succeeded";
      })
      .addCase(cancelDeliveryRunOrder.rejected, (state, action) => {
        state.orderCancelStatus = "failed";
        state.orderCancelError =
          (action.payload as string) || action.error.message || null;
      })
      // failDeliveryRunOrder
      .addCase(failDeliveryRunOrder.pending, (state) => {
        state.orderFailStatus = "loading";
        state.orderFailError = null;
      })
      .addCase(failDeliveryRunOrder.fulfilled, (state) => {
        state.orderFailStatus = "succeeded";
      })
      .addCase(failDeliveryRunOrder.rejected, (state, action) => {
        state.orderFailStatus = "failed";
        state.orderFailError =
          (action.payload as string) || action.error.message || null;
      })
      // ✅ Thêm cases cho reopenDeliveryRunOrder
      .addCase(reopenDeliveryRunOrder.pending, (state) => {
        state.orderReopenStatus = "loading";
        state.orderReopenError = null;
      })
      .addCase(reopenDeliveryRunOrder.fulfilled, (state) => {
        state.orderReopenStatus = "succeeded";
      })
      .addCase(reopenDeliveryRunOrder.rejected, (state, action) => {
        state.orderReopenStatus = "failed";
        state.orderReopenError =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export const {
  resetDeliveryRuns,
  resetDeliveryRunById,
  addDeliveryRunRealtime,
  updateDeliveryRunRealtime,
  deleteDeliveryRunRealtime,
  updateShipperLocation,
  clearShipperLocation
} = deliveryRunsSlice.actions;

export const deliveryRunsSelectors = deliveryRunsAdapter.getSelectors(
  (state: any) => state.deliveryRuns,
);

export default deliveryRunsSlice.reducer;
