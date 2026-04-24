import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPayment,
  CreatePaymentData,
  deletePayment,
  deletePaymentsByTransactionId,
  getAllPaymentsByTransactionId,
  getPaymentById,
  getPayments,
  getPaymentsByCreator,
  getPaymentsByPayer,
  getPaymentStatsByMonth,
  getPaymentStatsByUser,
  getTotalPaidAmountByTransactionId,
  PaymentParams,
  PaymentQueryParams,
  updatePayment,
  UpdatePaymentData,
} from "../services/supTransactionPaymentService";

/* ============================================================
   INTERFACES
   ============================================================ */

export interface PaymentItem {
  id: string;
  [key: string]: any;
}

export interface Pagination {
  total?: number;
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface SupTransactionPaymentState {
  supTransactionPayments: {
    data: PaymentItem[];
    pagination: Pagination;
  };
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
  statsByUser: any | null;
  statsByMonth: any | null;
  totalPaidAmount: number | null;
  currentPayment: PaymentItem | null;
}

const initialState: SupTransactionPaymentState = {
  supTransactionPayments: {
    data: [],
    pagination: {},
  },
  fetchStatus: "idle", // idle | loading | succeeded | failed
  fetchError: null,
  createStatus: "idle", // idle | loading | succeeded | failed
  createError: null,
  updateStatus: "idle", // idle | loading | succeeded | failed
  updateError: null,
  deleteStatus: "idle", // idle | loading | succeeded | failed
  deleteError: null,
  statsByUser: null,
  statsByMonth: null,
  totalPaidAmount: null,
  currentPayment: null,
};

export const fetchListSupTransactionPayments = createAsyncThunk(
  "supTransactionPayment/fetchListSupTransactionPayments",
  async (params: PaymentParams = {}, { rejectWithValue }) => {
    try {
      const response = await getPayments(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createSupTransactionPayment = createAsyncThunk(
  "supTransactionPayment/createSupTransactionPayment",
  async (paymentData: CreatePaymentData, { rejectWithValue }) => {
    try {
      const response = await createPayment(paymentData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating payment:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateSupTransactionPayment = createAsyncThunk(
  "supTransactionPayment/updateSupTransactionPayment",
  async (
    {
      paymentId,
      paymentData,
    }: { paymentId: string; paymentData: UpdatePaymentData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updatePayment(paymentId, paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteSupTransactionPayment = createAsyncThunk(
  "supTransactionPayment/deleteSupTransactionPayment",
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await deletePayment(paymentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

/* FETCH ALL BY TRANSACTION */
export const fetchAllPaymentsByTransactionId = createAsyncThunk(
  "supTransactionPayment/fetchAllByTransactionId",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await getAllPaymentsByTransactionId(transactionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

/* FETCH BY PAYER */
export const fetchPaymentsByPayer = createAsyncThunk(
  "supTransactionPayment/fetchByPayer",
  async (
    {
      paidBy,
      queryParams,
    }: { paidBy: string; queryParams: PaymentQueryParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await getPaymentsByPayer(paidBy, queryParams);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

/* FETCH BY CREATOR */
export const fetchPaymentsByCreator = createAsyncThunk(
  "supTransactionPayment/fetchByCreator",
  async (
    {
      createdBy,
      queryParams,
    }: { createdBy: string; queryParams: PaymentQueryParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await getPaymentsByCreator(createdBy, queryParams);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

/* FETCH PAYMENT BY ID */
export const fetchPaymentById = createAsyncThunk(
  "supTransactionPayment/fetchPaymentById",
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await getPaymentById(paymentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

/* FETCH TOTAL PAID AMOUNT BY TRANSACTION */
export const fetchTotalPaidAmountByTransactionId = createAsyncThunk(
  "supTransactionPayment/fetchTotalPaidAmountByTransactionId",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await getTotalPaidAmountByTransactionId(transactionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

/* FETCH STATS BY USER */
export const fetchPaymentStatsByUser = createAsyncThunk(
  "supTransactionPayment/fetchStatsByUser",
  async (
    {
      userId,
      queryParams,
    }: { userId: string; queryParams: PaymentQueryParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await getPaymentStatsByUser(userId, queryParams);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

/* FETCH STATS BY MONTH */
export const fetchPaymentStatsByMonth = createAsyncThunk(
  "supTransactionPayment/fetchStatsByMonth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPaymentStatsByMonth();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

/* DELETE ALL PAYMENTS BY TRANSACTION */
export const deletePaymentsByTransaction = createAsyncThunk(
  "supTransactionPayment/deletePaymentsByTransaction",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      const response = await deletePaymentsByTransactionId(transactionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// -----Slice-----
const supTransactionPaymentSlice = createSlice({
  name: "supTransactionPayment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch list payments
      .addCase(fetchListSupTransactionPayments.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchListSupTransactionPayments.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.supTransactionPayments = {
          data: action.payload.data,
          pagination: action.payload.pagination,
        };
      })
      .addCase(fetchListSupTransactionPayments.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })
      // Create payment
      .addCase(createSupTransactionPayment.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createSupTransactionPayment.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.supTransactionPayments.data.push(action.payload);
        if (state.supTransactionPayments.pagination.total !== undefined) {
          state.supTransactionPayments.pagination.total += 1;
        }
      })
      .addCase(createSupTransactionPayment.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as any)?.message || action.error.message;
      })
      // Update payment
      .addCase(updateSupTransactionPayment.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateSupTransactionPayment.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.supTransactionPayments.data.findIndex(
          (payment) => payment.id === action.payload.id,
        );
        if (index !== -1) {
          state.supTransactionPayments.data[index] = action.payload;
        }
      })
      .addCase(updateSupTransactionPayment.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message;
      })
      // Delete payment
      .addCase(deleteSupTransactionPayment.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteSupTransactionPayment.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.supTransactionPayments.data =
          state.supTransactionPayments.data.filter(
            (payment) => payment.id !== action.payload.id,
          );
        if (state.supTransactionPayments.pagination.total !== undefined) {
          state.supTransactionPayments.pagination.total -= 1;
        }
      })
      .addCase(deleteSupTransactionPayment.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as any)?.message || action.error.message;
      })

      /* --- Fetch single payment --- */
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.currentPayment = action.payload.data;
      })

      /* --- Fetch all by transaction --- */
      .addCase(fetchAllPaymentsByTransactionId.fulfilled, (state, action) => {
        state.supTransactionPayments.data = action.payload.data || [];
      })

      /* --- Fetch by payer / creator --- */
      .addCase(fetchPaymentsByPayer.fulfilled, (state, action) => {
        state.supTransactionPayments.data = action.payload.data || [];
      })
      .addCase(fetchPaymentsByCreator.fulfilled, (state, action) => {
        state.supTransactionPayments.data = action.payload.data || [];
      })

      /* --- Fetch stats --- */
      .addCase(fetchPaymentStatsByUser.fulfilled, (state, action) => {
        state.statsByUser = action.payload.data;
      })
      .addCase(fetchPaymentStatsByMonth.fulfilled, (state, action) => {
        state.statsByMonth = action.payload.data;
      })

      /* --- Fetch total paid --- */
      .addCase(
        fetchTotalPaidAmountByTransactionId.fulfilled,
        (state, action) => {
          state.totalPaidAmount = action.payload.data?.total || 0;
        },
      )

      /* --- Delete all by transaction --- */
      .addCase(deletePaymentsByTransaction.fulfilled, (state, action) => {
        state.supTransactionPayments.data = [];
      });
  },
});

export const {} = supTransactionPaymentSlice.actions;

export default supTransactionPaymentSlice.reducer;
