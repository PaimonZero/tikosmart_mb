import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createOrderReturn as createOrderReturnAPI,
  getOrderReturnsByOrderId as getOrderReturnsByOrderIdAPI,
  OrderReturnData,
  updateOrderReturn as updateOrderReturnAPI,
} from "../services/orderReturnsService";

export interface OrderReturn {
  id: string;
  [key: string]: any;
}

export interface OrderReturnsState {
  orderReturnsByOrderId: { [key: string]: OrderReturn } | OrderReturn[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createOrderReturnStatus: "idle" | "loading" | "succeeded" | "failed";
  createOrderReturnError: string | null;
  updateOrderReturnStatus: "idle" | "loading" | "succeeded" | "failed";
  updateOrderReturnError: string | null;
}

const initialState: OrderReturnsState = {
  orderReturnsByOrderId: {},
  fetchStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  fetchError: null,
  createOrderReturnStatus: "idle",
  createOrderReturnError: null,
  updateOrderReturnStatus: "idle",
  updateOrderReturnError: null,
};

export const fetchOrderReturnsByOrderId = createAsyncThunk(
  "orderReturns/fetchByOrderId",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await getOrderReturnsByOrderIdAPI(orderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const createOrderReturn = createAsyncThunk(
  "orderReturns/create",
  async (orderReturnData: OrderReturnData, { rejectWithValue }) => {
    try {
      const response = await createOrderReturnAPI(orderReturnData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const updateOrderReturn = createAsyncThunk(
  "orderReturns/update",
  async (
    { id, orderReturnData }: { id: string; orderReturnData: OrderReturnData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateOrderReturnAPI(id, orderReturnData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const orderReturnsSlice = createSlice({
  name: "orderReturns",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderReturnsByOrderId.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchOrderReturnsByOrderId.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.orderReturnsByOrderId = action.payload.data;
      })
      .addCase(fetchOrderReturnsByOrderId.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })
      .addCase(createOrderReturn.pending, (state) => {
        state.createOrderReturnStatus = "loading";
        state.createOrderReturnError = null;
      })
      .addCase(createOrderReturn.fulfilled, (state, action) => {
        state.createOrderReturnStatus = "succeeded";
        // Optionally, add the new order return to the state
      })
      .addCase(createOrderReturn.rejected, (state, action) => {
        state.createOrderReturnStatus = "failed";
        state.createOrderReturnError =
          (action.payload as any)?.message || action.error.message;
      })
      .addCase(updateOrderReturn.pending, (state) => {
        state.updateOrderReturnStatus = "loading";
        state.updateOrderReturnError = null;
      })
      .addCase(updateOrderReturn.fulfilled, (state, action) => {
        state.updateOrderReturnStatus = "succeeded";
        // Update the order return in the state
        if (
          state.orderReturnsByOrderId &&
          typeof state.orderReturnsByOrderId === "object" &&
          !Array.isArray(state.orderReturnsByOrderId)
        ) {
          state.orderReturnsByOrderId = {
            ...state.orderReturnsByOrderId,
            ...(action.payload?.data || {}),
          };
        } else if (Array.isArray(state.orderReturnsByOrderId)) {
          // Handle array case if necessary, though logic suggests object map
          // For now, assume it stays reasonably structured.
          // If payload.data is a single item, we might need to find/replace
        }
      })
      .addCase(updateOrderReturn.rejected, (state, action) => {
        state.updateOrderReturnStatus = "failed";
        state.updateOrderReturnError =
          (action.payload as any)?.message || action.error.message;
      });
  },
});

export const {} = orderReturnsSlice.actions;
export default orderReturnsSlice.reducer;
