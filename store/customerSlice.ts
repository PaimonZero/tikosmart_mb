import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createCustomer as createCustomerAPI,
  CustomerData,
  CustomerParams,
  deleteCustomer as deleteCustomerAPI,
  getCustomerFinancialSummary as getCustomerFinancialSummaryAPI,
  getCustomerTransactionHistory as getCustomerTransactionHistoryAPI,
  getListCustomersWithMoney,
  listCustomers as listCustomersAPI,
  updateCustomer as updateCustomerAPI,
} from "../services/customerService";

interface Pagination {
  total: number;
  limit?: number;
  offset?: number;
}

interface CustomerState {
  customers: {
    data: CustomerData[];
    pagination: Pagination;
  };
  financialSummary: any; // Can be improved with specific type if properties are known
  customerTransactions: {
    data: any[];
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

  financialSummaryStatus: "idle" | "loading" | "succeeded" | "failed";
  financialSummaryError: string | null;

  customerTransactionsStatus: "idle" | "loading" | "succeeded" | "failed";
  customerTransactionsError: string | null;
}

const initialState: CustomerState = {
  customers: { data: [], pagination: { total: 0 } },
  financialSummary: {},
  customerTransactions: { data: [], pagination: { total: 0 } },

  fetchStatus: "idle",
  fetchError: null,

  createStatus: "idle",
  createError: null,

  updateStatus: "idle",
  updateError: null,

  deleteStatus: "idle",
  deleteError: null,

  financialSummaryStatus: "idle",
  financialSummaryError: null,

  customerTransactionsStatus: "idle",
  customerTransactionsError: null,
};

// Thunk: Lấy danh sách (đã có)
export const fetchCustomerWithMoney = createAsyncThunk(
  "customer/fetchCustomerWithMoney",
  async (params: CustomerParams = {}, { rejectWithValue }) => {
    try {
      const response = await getListCustomersWithMoney(params);
      return response.data; // Expected { data: [], pagination: {} }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi không xác định",
      );
    }
  },
);

// Thunk: Tạo mới
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (customerData: CustomerData, { rejectWithValue }) => {
    try {
      const response = await createCustomerAPI(customerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo khách hàng",
      );
    }
  },
);

// Thunk: Cập nhật
export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (
    {
      customerId,
      customerData,
    }: { customerId: string; customerData: CustomerData },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateCustomerAPI(customerId, customerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật",
      );
    }
  },
);

// Thunk: Xóa
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (customerId: string, { rejectWithValue }) => {
    try {
      await deleteCustomerAPI(customerId);
      return customerId; // Trả về ID để xử lý trong state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa");
    }
  },
);

// Rút gọn: fetchListCustomers
export const fetchListCustomers = createAsyncThunk(
  "customer/fetchListCustomers",
  async (params: CustomerParams = {}, { rejectWithValue }) => {
    try {
      const response = await listCustomersAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Lấy tổng hợp tài chính khách hàng
export const fetchCustomerFinancialSummary = createAsyncThunk(
  "customer/fetchCustomerFinancialSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCustomerFinancialSummaryAPI();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Lấy lịch sử giao dịch theo customer
export const fetchCustomerTransactions = createAsyncThunk(
  "customer/fetchCustomerTransactions",
  async (
    {
      customerId,
      params = {},
    }: { customerId: string; params?: CustomerParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await getCustomerTransactionHistoryAPI(
        customerId,
        params,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCustomerWithMoney (List)
      .addCase(fetchCustomerWithMoney.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchCustomerWithMoney.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.customers = action.payload; // Payload là { data: [], pagination: {} }
      })
      .addCase(fetchCustomerWithMoney.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as string) || action.error.message || null;
      })

      // createCustomer
      .addCase(createCustomer.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // Không cần thêm vào list vì list sẽ được fetch lại hoặc logic khác
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as string) || action.error.message || null;
      })

      // updateCustomer
      .addCase(updateCustomer.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        // Cập nhật item trong list (nếu cần)
        const updatedItem = action.payload?.data || action.payload;
        if (updatedItem?.id) {
          const index = state.customers.data.findIndex(
            (c) => c.id === updatedItem.id,
          );
          if (index !== -1) {
            state.customers.data[index] = updatedItem;
          }
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as string) || action.error.message || null;
      })

      // deleteCustomer
      .addCase(deleteCustomer.pending, (state) => {
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        // Xóa item khỏi list
        state.customers.data = state.customers.data.filter(
          (c) => c.id !== action.payload,
        );
        state.customers.pagination.total = Math.max(
          0,
          state.customers.pagination.total - 1,
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as string) || action.error.message || null;
      })

      // Lấy tổng hợp tài chính khách hàng
      .addCase(fetchCustomerFinancialSummary.pending, (state) => {
        state.financialSummaryStatus = "loading";
        state.financialSummaryError = null;
      })
      .addCase(fetchCustomerFinancialSummary.fulfilled, (state, action) => {
        state.financialSummaryStatus = "succeeded";
        state.financialSummary = action.payload;
      })
      .addCase(fetchCustomerFinancialSummary.rejected, (state, action) => {
        state.financialSummaryStatus = "failed";
        state.financialSummaryError =
          (action.payload as string) || action.error.message || null;
      })

      // Lấy lịch sử giao dịch khách hàng
      .addCase(fetchCustomerTransactions.pending, (state) => {
        state.customerTransactionsStatus = "loading";
        state.customerTransactionsError = null;
      })
      .addCase(fetchCustomerTransactions.fulfilled, (state, action) => {
        state.customerTransactionsStatus = "succeeded";
        state.customerTransactions = action.payload;
      })
      .addCase(fetchCustomerTransactions.rejected, (state, action) => {
        state.customerTransactionsStatus = "failed";
        state.customerTransactionsError =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export default customerSlice.reducer;
