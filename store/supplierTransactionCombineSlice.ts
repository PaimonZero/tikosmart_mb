import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createSupplierTransaction as createSupplierTransactionAPI,
  CreateSupplierTransactionData,
  CreateTransactionNoPriceData,
  createTransactionWithoutPrice as createTransactionWithoutPriceAPI,
  deleteSupplierTransaction as deleteSupplierTransactionAPI,
  getAvailableLotsForProduct as getAvailableLotsForProductAPI,
  getSupplierTransactionById as getSupplierTransactionByIdAPI,
  getTopSuppliers as getTopSuppliersAPI,
  getTransactionsByDepartment as getTransactionsByDepartmentAPI,
  getTransactionsBySupplier as getTransactionsBySupplierAPI,
  getTransactionStatsOverview as getTransactionStatsOverviewAPI,
  listSupplierTransactions as listSupplierTransactionsAPI,
  setTransactionAdminLock as setTransactionAdminLockAPI,
  SupplierTransactionParams,
  TransactionStatsParams,
  UpdateItemCostData,
  updateItemCostInTransaction as updateItemCostInTransactionAPI,
  updateSupplierTransaction as updateSupplierTransactionAPI,
  UpdateSupplierTransactionData,
  UpdateTransactionNoPriceData,
  updateTransactionWithoutPrice as updateTransactionWithoutPriceAPI,
  validateStockAvailability as validateStockAvailabilityAPI,
  ValidateStockData,
} from "../services/supplierTransactionCombineService";

/* ============================================================
   INTERFACES
   ============================================================ */

export interface TransactionItem {
  productId: string;
  unitPrice?: number;
  qty?: number;
  [key: string]: any;
}

export interface SupplierTransaction {
  id: string;
  items: TransactionItem[];
  [key: string]: any;
}

export interface Pagination {
  total?: number;
  limit?: number;
  offset?: number;
  [key: string]: any;
}

export interface SupplierTransactionCombinedState {
  transactions:
    | {
        data: SupplierTransaction[];
        pagination: Pagination;
      }
    | SupplierTransaction[];
  transactionsIn: {
    data: SupplierTransaction[];
    pagination: Pagination;
  } | null;
  selectedTransaction: SupplierTransaction | null;
  availableLots: any[];
  statsOverview: any[];
  topSuppliers: any[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  transactionsInStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createTransactionWithoutPriceStatus:
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";
  updateTransactionWithoutPriceStatus:
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";
  updateItemCostInTransactionStatus:
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";
  setTransactionAdminLockStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  statsStatus: "idle" | "loading" | "succeeded" | "failed";
  topSupplierStatus: "idle" | "loading" | "succeeded" | "failed";
  lotsStatus: "idle" | "loading" | "succeeded" | "failed";
  validateStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  transactionsInError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  statsError: string | null;
  topSupplierError: string | null;
  lotsError: string | null;
  validateError: string | null;
  createTransactionWithoutPriceError: string | null;
  updateTransactionWithoutPriceError: string | null;
  updateItemCostInTransactionError: string | null;
  setTransactionAdminLockError: string | null;
}

/* ============================================================
   INITIAL STATE
   ============================================================ */
const initialState: SupplierTransactionCombinedState = {
  transactions: { data: [], pagination: {} },
  transactionsIn: null,
  selectedTransaction: null,
  availableLots: [],
  statsOverview: [],
  topSuppliers: [],
  fetchStatus: "idle",
  transactionsInStatus: "idle",
  createStatus: "idle",
  createTransactionWithoutPriceStatus: "idle",
  updateTransactionWithoutPriceStatus: "idle",
  updateItemCostInTransactionStatus: "idle",
  setTransactionAdminLockStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  statsStatus: "idle",
  topSupplierStatus: "idle",
  lotsStatus: "idle",
  validateStatus: "idle",
  fetchError: null,
  transactionsInError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  statsError: null,
  topSupplierError: null,
  lotsError: null,
  validateError: null,
  createTransactionWithoutPriceError: null,
  updateTransactionWithoutPriceError: null,
  updateItemCostInTransactionError: null,
  setTransactionAdminLockError: null,
};

/* ============================================================
   ASYNC THUNKS
   ============================================================ */

// 📦 Lấy danh sách transactions
export const fetchSupplierTransactions = createAsyncThunk(
  "supplierTransactionCombined/fetchList",
  async (params: SupplierTransactionParams = {}, { rejectWithValue }) => {
    try {
      const res = await listSupplierTransactionsAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📥 Lấy danh sách phiếu nhập
export const fetchSupplierTransactionsIn = createAsyncThunk(
  "supplierTransactionCombined/fetchSupplierTransactionsIn",
  async (params: SupplierTransactionParams, { rejectWithValue }) => {
    try {
      const response = await listSupplierTransactionsAPI(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// 🔍 Lấy chi tiết transaction theo ID
export const fetchSupplierTransactionById = createAsyncThunk(
  "supplierTransactionCombined/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getSupplierTransactionByIdAPI(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ➕ Tạo transaction mới
export const createSupplierTransaction = createAsyncThunk(
  "supplierTransactionCombined/create",
  async (data: CreateSupplierTransactionData, { rejectWithValue }) => {
    try {
      const res = await createSupplierTransactionAPI(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ✏️ Cập nhật transaction
export const updateSupplierTransaction = createAsyncThunk(
  "supplierTransactionCombined/update",
  async (
    { id, data }: { id: string; data: UpdateSupplierTransactionData },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateSupplierTransactionAPI(id, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ❌ Xóa transaction
export const deleteSupplierTransaction = createAsyncThunk(
  "supplierTransactionCombined/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await deleteSupplierTransactionAPI(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🧾 Lấy danh sách theo nhà cung cấp
export const fetchTransactionsBySupplier = createAsyncThunk(
  "supplierTransactionCombined/fetchBySupplier",
  async (
    {
      supplierId,
      params = {},
    }: { supplierId: string; params?: SupplierTransactionParams },
    { rejectWithValue },
  ) => {
    try {
      const res = await getTransactionsBySupplierAPI(supplierId, params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🏢 Lấy danh sách theo phòng ban / kho
export const fetchTransactionsByDepartment = createAsyncThunk(
  "supplierTransactionCombined/fetchByDepartment",
  async (
    {
      departmentId,
      params = {},
    }: { departmentId: string; params?: SupplierTransactionParams },
    { rejectWithValue },
  ) => {
    try {
      const res = await getTransactionsByDepartmentAPI(departmentId, params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📊 Lấy thống kê tổng quan
export const fetchTransactionStatsOverview = createAsyncThunk(
  "supplierTransactionCombined/fetchStatsOverview",
  async (params: TransactionStatsParams = {}, { rejectWithValue }) => {
    try {
      const res = await getTransactionStatsOverviewAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🏆 Lấy top nhà cung cấp
export const fetchTopSuppliers = createAsyncThunk(
  "supplierTransactionCombined/fetchTopSuppliers",
  async (params: TransactionStatsParams = {}, { rejectWithValue }) => {
    try {
      const res = await getTopSuppliersAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 📦 Lấy lô hàng sẵn sàng xuất kho
export const fetchAvailableLots = createAsyncThunk(
  "supplierTransactionCombined/fetchAvailableLots",
  async (
    {
      productId,
      departmentId,
      requiredQty,
    }: { productId: string; departmentId: string; requiredQty: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await getAvailableLotsForProductAPI(
        productId,
        departmentId,
        requiredQty,
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ✅ Kiểm tra tồn kho trước khi xuất
export const validateStockAvailability = createAsyncThunk(
  "supplierTransactionCombined/validateStock",
  async (data: ValidateStockData, { rejectWithValue }) => {
    try {
      const res = await validateStockAvailabilityAPI(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ➕ Tạo phiếu nhập không có giá
export const createTransactionWithoutPrice = createAsyncThunk(
  "supplierTransactionCombined/createWithoutPrice",
  async (
    transactionData: CreateTransactionNoPriceData,
    { rejectWithValue },
  ) => {
    try {
      const res = await createTransactionWithoutPriceAPI(transactionData);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ✏️ Cập nhật phiếu nhập không có giá
export const updateTransactionWithoutPrice = createAsyncThunk(
  "supplierTransactionCombined/updateWithoutPrice",
  async (
    { id, data }: { id: string; data: UpdateTransactionNoPriceData },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateTransactionWithoutPriceAPI(id, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 💲 Cập nhật giá nhập cho từng mặt hàng trong phiếu
/**
 * Cập nhật giá nhập của các items trong transaction (Dành cho Accountant)
 * body: { items: [{ productId, unitPrice }] }
 */
export const updateItemCostInTransaction = createAsyncThunk(
  "supplierTransactionCombined/updateItemCost",
  async (
    {
      transactionId,
      items,
    }: { transactionId: string; items: UpdateItemCostData["items"] },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateItemCostInTransactionAPI(transactionId, items);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);
// 🔒 Cập nhật trạng thái khoá admin của phiếu
export const setTransactionAdminLock = createAsyncThunk(
  "supplierTransactionCombined/setAdminLock",
  async (
    { id, adminLocked }: { id: string; adminLocked: boolean },
    { rejectWithValue },
  ) => {
    try {
      const res = await setTransactionAdminLockAPI(id, adminLocked);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

/* ============================================================
   SLICE
   ============================================================ */

const supplierTransactionCombinedSlice = createSlice({
  name: "supplierTransactionCombined",
  initialState,
  reducers: {
    clearSelectedTransaction: (state) => {
      state.selectedTransaction = null;
    },
    clearTransactionInList: (state) => {
      state.transactionsIn = null;
      state.transactionsInStatus = "idle";
      state.transactionsInError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------- FETCH LIST -------- */
      .addCase(fetchSupplierTransactions.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(fetchSupplierTransactions.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.transactions = action.payload;
      })
      .addCase(fetchSupplierTransactions.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
      })
      /* -------- FETCH TRANSACTION IN LIST -------- */
      .addCase(fetchSupplierTransactionsIn.pending, (state) => {
        state.transactionsInStatus = "loading";
        state.transactionsInError = null;
      })
      .addCase(fetchSupplierTransactionsIn.fulfilled, (state, action) => {
        state.transactionsInStatus = "succeeded";
        state.transactionsIn = action.payload;
      })
      .addCase(fetchSupplierTransactionsIn.rejected, (state, action) => {
        state.transactionsInStatus = "failed";
        state.transactionsInError =
          (action.payload as any)?.message || action.error.message;
      })
      /* -------- FETCH BY ID -------- */
      .addCase(fetchSupplierTransactionById.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
        state.selectedTransaction = null;
      })
      .addCase(fetchSupplierTransactionById.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.selectedTransaction = action.payload?.data || ({} as any); // ✅ lấy đúng tầng dữ liệu
      })
      .addCase(fetchSupplierTransactionById.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message;
        state.selectedTransaction = null;
      })

      /* -------- CREATE -------- */
      .addCase(createSupplierTransaction.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createSupplierTransaction.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        if (Array.isArray(state.transactions)) {
          state.transactions.push(action.payload);
        } else if ((state.transactions as any).data) {
          (state.transactions as any).data.push(action.payload);
        }
      })
      .addCase(createSupplierTransaction.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- UPDATE -------- */
      .addCase(updateSupplierTransaction.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateSupplierTransaction.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        let index = -1;
        if ((state.transactions as any).data) {
          index = (state.transactions as any).data.findIndex(
            (t: SupplierTransaction) => t.id === action.payload.id,
          );
          if (index !== -1) {
            (state.transactions as any).data[index] = action.payload;
          }
        } else if (Array.isArray(state.transactions)) {
          index = state.transactions.findIndex(
            (t) => t.id === action.payload.id,
          );
          if (index !== -1) {
            state.transactions[index] = action.payload;
          }
        }
      })
      .addCase(updateSupplierTransaction.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- DELETE -------- */
      .addCase(deleteSupplierTransaction.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteSupplierTransaction.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        if ((state.transactions as any).data) {
          (state.transactions as any).data = (
            state.transactions as any
          ).data.filter((t: SupplierTransaction) => t.id !== action.payload.id);
        } else if (Array.isArray(state.transactions)) {
          state.transactions = state.transactions.filter(
            (t) => t.id !== action.payload.id,
          );
        }
      })
      .addCase(deleteSupplierTransaction.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- FETCH STATS -------- */
      .addCase(fetchTransactionStatsOverview.pending, (state) => {
        state.statsStatus = "loading";
      })
      .addCase(fetchTransactionStatsOverview.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.statsOverview = action.payload;
      })
      .addCase(fetchTransactionStatsOverview.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- FETCH TOP SUPPLIERS -------- */
      .addCase(fetchTopSuppliers.pending, (state) => {
        state.topSupplierStatus = "loading";
      })
      .addCase(fetchTopSuppliers.fulfilled, (state, action) => {
        state.topSupplierStatus = "succeeded";
        state.topSuppliers = action.payload;
      })
      .addCase(fetchTopSuppliers.rejected, (state, action) => {
        state.topSupplierStatus = "failed";
        state.topSupplierError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- AVAILABLE LOTS -------- */
      .addCase(fetchAvailableLots.pending, (state) => {
        state.lotsStatus = "loading";
      })
      .addCase(fetchAvailableLots.fulfilled, (state, action) => {
        state.lotsStatus = "succeeded";
        state.availableLots = action.payload;
      })
      .addCase(fetchAvailableLots.rejected, (state, action) => {
        state.lotsStatus = "failed";
        state.lotsError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- VALIDATE STOCK -------- */
      .addCase(validateStockAvailability.pending, (state) => {
        state.validateStatus = "loading";
      })
      .addCase(validateStockAvailability.fulfilled, (state) => {
        state.validateStatus = "succeeded";
      })
      .addCase(validateStockAvailability.rejected, (state, action) => {
        state.validateStatus = "failed";
        state.validateError =
          (action.payload as any)?.message || action.error.message;
      })

      /* -------- CREATE WITHOUT PRICE -------- */
      .addCase(createTransactionWithoutPrice.pending, (state) => {
        state.createTransactionWithoutPriceStatus = "loading";
        state.createTransactionWithoutPriceError = null;
      })
      .addCase(createTransactionWithoutPrice.fulfilled, (state, action) => {
        state.createTransactionWithoutPriceStatus = "succeeded";
        if ((state.transactions as any).data) {
          (state.transactions as any).data.push(action.payload);
        } else if (Array.isArray(state.transactions)) {
          state.transactions.push(action.payload);
        }
      })
      .addCase(createTransactionWithoutPrice.rejected, (state, action) => {
        state.createTransactionWithoutPriceStatus = "failed";
        state.createTransactionWithoutPriceError =
          (action.payload as any)?.message || action.error.message;
      })
      /* -------- UPDATE WITHOUT PRICE -------- */
      .addCase(updateTransactionWithoutPrice.pending, (state) => {
        state.updateTransactionWithoutPriceStatus = "loading";
        state.updateTransactionWithoutPriceError = null;
      })
      .addCase(updateTransactionWithoutPrice.fulfilled, (state, action) => {
        state.updateTransactionWithoutPriceStatus = "succeeded";
        let index = -1;
        if ((state.transactions as any).data) {
          index = (state.transactions as any).data.findIndex(
            (t: SupplierTransaction) => t.id === action.payload.id,
          );
          if (index !== -1) {
            (state.transactions as any).data[index] = action.payload;
          }
        } else if (Array.isArray(state.transactions)) {
          index = state.transactions.findIndex(
            (t) => t.id === action.payload.id,
          );
          if (index !== -1) {
            state.transactions[index] = action.payload;
          }
        }
      })
      .addCase(updateTransactionWithoutPrice.rejected, (state, action) => {
        state.updateTransactionWithoutPriceStatus = "failed";
        state.updateTransactionWithoutPriceError =
          (action.payload as any)?.message || action.error.message;
      })
      /* -------- UPDATE ITEM COST -------- */
      .addCase(updateItemCostInTransaction.pending, (state) => {
        state.updateItemCostInTransactionStatus = "loading";
        state.updateItemCostInTransactionError = null;
      })
      .addCase(updateItemCostInTransaction.fulfilled, (state, action) => {
        state.updateItemCostInTransactionStatus = "succeeded";
        const { transactionId, items } = action.meta.arg; // Access args from meta
        // Helper to find transaction
        let transaction: SupplierTransaction | undefined;
        if ((state.transactions as any).data) {
          transaction = (state.transactions as any).data.find(
            (t: SupplierTransaction) => t.id === transactionId,
          );
        } else if (Array.isArray(state.transactions)) {
          transaction = state.transactions.find((t) => t.id === transactionId);
        }

        if (transaction && transaction.items) {
          transaction.items = transaction.items.map((item) => {
            const updatedItem = items.find(
              (i) => i.productId === item.productId,
            );
            return updatedItem
              ? { ...item, unitPrice: updatedItem.unitPrice }
              : item;
          });
        }
      })
      .addCase(updateItemCostInTransaction.rejected, (state, action) => {
        state.updateItemCostInTransactionStatus = "failed";
        state.updateItemCostInTransactionError =
          (action.payload as any)?.message || action.error.message;
      })
      /* -------- SET ADMIN LOCK -------- */
      .addCase(setTransactionAdminLock.pending, (state) => {
        state.setTransactionAdminLockStatus = "loading";
        state.setTransactionAdminLockError = null;
      })
      .addCase(setTransactionAdminLock.fulfilled, (state, action) => {
        state.setTransactionAdminLockStatus = "succeeded";
        const updatedTransaction = action.payload;
        let index = -1;
        if ((state.transactions as any).data) {
          index = (state.transactions as any).data.findIndex(
            (t: SupplierTransaction) => t.id === updatedTransaction.id,
          );
          if (index !== -1) {
            (state.transactions as any).data[index] = updatedTransaction;
          }
        } else if (Array.isArray(state.transactions)) {
          index = state.transactions.findIndex(
            (t) => t.id === updatedTransaction.id,
          );
          if (index !== -1) {
            state.transactions[index] = updatedTransaction;
          }
        }
        if (state.selectedTransaction?.id === updatedTransaction.id) {
          state.selectedTransaction = updatedTransaction;
        }
      })
      .addCase(setTransactionAdminLock.rejected, (state, action) => {
        state.setTransactionAdminLockStatus = "failed";
        state.setTransactionAdminLockError =
          (action.payload as any)?.message || action.error.message;
      });
  },
});

export const { clearSelectedTransaction, clearTransactionInList } =
  supplierTransactionCombinedSlice.actions;
export default supplierTransactionCombinedSlice.reducer;
