import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AvailableDeliveryRunsParams,
  CodRemittanceTicketParams,
  createCodRemittanceTicket as createCodRemittanceTicketAPI,
  CreateTicketData,
  deleteCodRemittanceTicket as deleteCodRemittanceTicketAPI,
  getAvailableDeliveryRuns as getAvailableDeliveryRunsAPI,
  getCodRemittanceTicketById as getCodRemittanceTicketByIdAPI,
  getCodRemittanceTicketDetails as getCodRemittanceTicketDetailsAPI,
  getCodRemittanceTickets as getCodRemittanceTicketsAPI,
  updateCodRemittanceTicket as updateCodRemittanceTicketAPI,
  UpdateTicketData,
} from "../services/codRemittanceTicketsService";

// Define Types
export interface CodRemittanceTicket {
  id: string;
  code?: string;
  status?: string;
  receivedAmount?: number;
  [key: string]: any;
}

export interface DeliveryRun {
  id: string;
  [key: string]: any;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
}

interface CodRemittanceTicketsState {
  tickets: {
    data: CodRemittanceTicket[];
    pagination: Pagination;
  };
  currentTicket: CodRemittanceTicket | null;
  availableDeliveryRuns: {
    data: DeliveryRun[];
    pagination: Pagination;
  };

  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;

  fetchTicketStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchTicketError: string | null;

  fetchTicketDetailsStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchTicketDetailsError: string | null;

  fetchAvailableRunsStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchAvailableRunsError: string | null;

  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;

  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  updateError: string | null;

  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
}

const initialState: CodRemittanceTicketsState = {
  tickets: { data: [], pagination: { total: 0, limit: 20, offset: 0 } },
  currentTicket: null,
  availableDeliveryRuns: {
    data: [],
    pagination: { total: 0, limit: 50, offset: 0 },
  },

  fetchStatus: "idle",
  fetchError: null,

  fetchTicketStatus: "idle",
  fetchTicketError: null,

  fetchTicketDetailsStatus: "idle",
  fetchTicketDetailsError: null,

  fetchAvailableRunsStatus: "idle",
  fetchAvailableRunsError: null,

  createStatus: "idle",
  createError: null,

  updateStatus: "idle",
  updateError: null,

  deleteStatus: "idle",
  deleteError: null,
};

// ============================================================
// ASYNC THUNKS
// ============================================================

// Thunk: Lấy danh sách COD remittance tickets
export const fetchCodRemittanceTickets = createAsyncThunk(
  "codRemittanceTickets/fetchCodRemittanceTickets",
  async (params: CodRemittanceTicketParams = {}, { rejectWithValue }) => {
    try {
      const response = await getCodRemittanceTicketsAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định",
      );
    }
  },
);

// Thunk: Lấy chi tiết ticket theo ID (cơ bản)
export const fetchCodRemittanceTicketById = createAsyncThunk(
  "codRemittanceTickets/fetchCodRemittanceTicketById",
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const response = await getCodRemittanceTicketByIdAPI(ticketId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy chi tiết ticket",
      );
    }
  },
);

// ✅ Thunk lấy chi tiết ticket với đầy đủ thông tin (bao gồm orders)
export const fetchCodRemittanceTicketDetails = createAsyncThunk(
  "codRemittanceTickets/fetchCodRemittanceTicketDetails",
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const response = await getCodRemittanceTicketDetailsAPI(ticketId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy chi tiết đầy đủ ticket",
      );
    }
  },
);

// Thunk: Lấy danh sách delivery runs khả dụng
export const fetchAvailableDeliveryRuns = createAsyncThunk(
  "codRemittanceTickets/fetchAvailableDeliveryRuns",
  async (params: AvailableDeliveryRunsParams = {}, { rejectWithValue }) => {
    try {
      const response = await getAvailableDeliveryRunsAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi lấy delivery runs khả dụng",
      );
    }
  },
);

// Thunk: Tạo mới COD remittance ticket
export const createCodRemittanceTicket = createAsyncThunk(
  "codRemittanceTickets/createCodRemittanceTicket",
  async (ticketData: CreateTicketData, { rejectWithValue }) => {
    try {
      const response = await createCodRemittanceTicketAPI(ticketData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo COD remittance ticket",
      );
    }
  },
);

// Thunk: Cập nhật COD remittance ticket
export const updateCodRemittanceTicket = createAsyncThunk(
  "codRemittanceTickets/updateCodRemittanceTicket",
  async (
    {
      ticketId,
      ticketData,
    }: { ticketId: string; ticketData: UpdateTicketData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateCodRemittanceTicketAPI(ticketId, ticketData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật ticket",
      );
    }
  },
);

// Thunk: Xóa COD remittance ticket
export const deleteCodRemittanceTicket = createAsyncThunk(
  "codRemittanceTickets/deleteCodRemittanceTicket",
  async (ticketId: string, { rejectWithValue }) => {
    try {
      await deleteCodRemittanceTicketAPI(ticketId);
      return ticketId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi xóa ticket",
      );
    }
  },
);

// ============================================================
// SLICE
// ============================================================

export const codRemittanceTicketsSlice = createSlice({
  name: "codRemittanceTickets",
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.updateError = null;
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "idle";
      state.deleteError = null;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.fetchTicketDetailsStatus = "idle";
      state.fetchTicketDetailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH COD REMITTANCE TICKETS
      .addCase(fetchCodRemittanceTickets.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchCodRemittanceTickets.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.tickets = action.payload; // Type safety might warn here if payload structure differs slightly, but typically data is flexible
      })
      .addCase(fetchCodRemittanceTickets.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as string) || action.error.message || null;
      })

      // FETCH SINGLE TICKET BY ID
      .addCase(fetchCodRemittanceTicketById.pending, (state) => {
        state.fetchTicketStatus = "loading";
        state.fetchTicketError = null;
      })
      .addCase(fetchCodRemittanceTicketById.fulfilled, (state, action) => {
        state.fetchTicketStatus = "succeeded";
        state.currentTicket = action.payload;
      })
      .addCase(fetchCodRemittanceTicketById.rejected, (state, action) => {
        state.fetchTicketStatus = "failed";
        state.fetchTicketError =
          (action.payload as string) || action.error.message || null;
      })

      // ✅ FETCH TICKET DETAILS (Đầy đủ thông tin)
      .addCase(fetchCodRemittanceTicketDetails.pending, (state) => {
        state.fetchTicketDetailsStatus = "loading";
        state.fetchTicketDetailsError = null;
      })
      .addCase(fetchCodRemittanceTicketDetails.fulfilled, (state, action) => {
        state.fetchTicketDetailsStatus = "succeeded";
        state.currentTicket = action.payload;
      })
      .addCase(fetchCodRemittanceTicketDetails.rejected, (state, action) => {
        state.fetchTicketDetailsStatus = "failed";
        state.fetchTicketDetailsError =
          (action.payload as string) || action.error.message || null;
      })

      // FETCH AVAILABLE DELIVERY RUNS
      .addCase(fetchAvailableDeliveryRuns.pending, (state) => {
        state.fetchAvailableRunsStatus = "loading";
        state.fetchAvailableRunsError = null;
      })
      .addCase(fetchAvailableDeliveryRuns.fulfilled, (state, action) => {
        state.fetchAvailableRunsStatus = "succeeded";
        state.availableDeliveryRuns = action.payload;
      })
      .addCase(fetchAvailableDeliveryRuns.rejected, (state, action) => {
        state.fetchAvailableRunsStatus = "failed";
        state.fetchAvailableRunsError =
          (action.payload as string) || action.error.message || null;
      })

      // CREATE COD REMITTANCE TICKET
      .addCase(createCodRemittanceTicket.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createCodRemittanceTicket.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // Optimistic update
        if (state.tickets.data) {
          state.tickets.data.unshift(action.payload);
          state.tickets.pagination.total += 1;
        }
      })
      .addCase(createCodRemittanceTicket.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as string) || action.error.message || null;
      })

      // UPDATE COD REMITTANCE TICKET
      .addCase(updateCodRemittanceTicket.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateCodRemittanceTicket.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const index = state.tickets.data.findIndex(
          (ticket) => ticket.id === action.payload.id,
        );
        if (index !== -1) {
          state.tickets.data[index] = action.payload;
        }
        if (
          state.currentTicket &&
          state.currentTicket.id === action.payload.id
        ) {
          state.currentTicket = action.payload;
        }
      })
      .addCase(updateCodRemittanceTicket.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as string) || action.error.message || null;
      })

      // DELETE COD REMITTANCE TICKET
      .addCase(deleteCodRemittanceTicket.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteCodRemittanceTicket.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        state.tickets.data = state.tickets.data.filter(
          (ticket) => ticket.id !== action.payload,
        );
        state.tickets.pagination.total -= 1;
        if (state.currentTicket && state.currentTicket.id === action.payload) {
          state.currentTicket = null;
        }
      })
      .addCase(deleteCodRemittanceTicket.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export const {
  resetCreateStatus,
  resetUpdateStatus,
  resetDeleteStatus,
  clearCurrentTicket,
} = codRemittanceTicketsSlice.actions;

export default codRemittanceTicketsSlice.reducer;
