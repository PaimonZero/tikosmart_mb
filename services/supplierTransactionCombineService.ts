import apiClient from "./apiClient";

export interface SupplierTransactionParams {
  q?: string;
  supplierId?: string;
  departmentId?: string;
  type?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
  includeItems?: boolean | string;
  [key: string]: any;
}

export interface TransactionItem {
  productId: string;
  unitPrice?: number;
  [key: string]: any;
}

export interface CreateSupplierTransactionData {
  supplierId: string;
  departmentId: string;
  type: string;
  note?: string;
  items: any[];
  [key: string]: any;
}

export interface UpdateSupplierTransactionData {
  [key: string]: any;
}

export interface ValidateStockData {
  departmentId: string;
  items: any[];
}

export interface TransactionStatsParams {
  months?: number;
  limit?: number;
  [key: string]: any;
}

export interface UpdateItemCostData {
  items: { productId: string; unitPrice: number }[];
}

export interface CreateTransactionNoPriceData {
  supplierId: string;
  departmentId: string;
  transDate?: string;
  type?: string;
  dueDate?: string;
  note?: string;
  items: any[];
  [key: string]: any;
}

export interface UpdateTransactionNoPriceData {
  supplierId?: string;
  departmentId?: string;
  transDate?: string;
  type?: string;
  dueDate?: string;
  note?: string;
  status?: string;
  items?: any[];
  [key: string]: any;
}

/* ============================================================
   🔹 MAIN CRUD OPERATIONS
   ============================================================ */

/**
 * Lấy danh sách transactions với phân trang & filter
 * @route GET /api/supplier-transactions-combined
 * @query q, supplierId, departmentId, type, status, fromDate, toDate, limit, offset, includeItems
 */
export const listSupplierTransactions = (
  params: SupplierTransactionParams = {},
) => {
  return apiClient.get("/supplier-transactions-combined", { params });
};

/**
 * Lấy transaction theo ID
 * @route GET /api/supplier-transactions-combined/:id
 */
export const getSupplierTransactionById = (id: string) => {
  return apiClient.get(`/supplier-transactions-combined/${id}`);
};

/**
 * Tạo transaction mới (tự động xử lý lot nhập/xuất)
 * @route POST /api/supplier-transactions-combined
 * @body { supplierId, departmentId, type, note, items[] }
 */
export const createSupplierTransaction = (
  transactionData: CreateSupplierTransactionData,
) => {
  return apiClient.post("/supplier-transactions-combined", transactionData);
};

/**
 * Cập nhật transaction kèm items
 * @route PUT /api/supplier-transactions-combined/:id
 */
export const updateSupplierTransaction = (
  id: string,
  transactionData: UpdateSupplierTransactionData,
) => {
  return apiClient.put(
    `/supplier-transactions-combined/${id}`,
    transactionData,
  );
};

/**
 * Xóa transaction (revert inventory changes)
 * @route DELETE /api/supplier-transactions-combined/:id
 */
export const deleteSupplierTransaction = (id: string) => {
  return apiClient.delete(`/supplier-transactions-combined/${id}`);
};

/* ============================================================
   🔹 INVENTORY MANAGEMENT
   ============================================================ */

/**
 * Lấy danh sách các lô hàng có sẵn cho sản phẩm để xuất kho
 * @route GET /api/supplier-transactions-combined/available-lots/:productId/:departmentId
 * @query requiredQty? (optional)
 */
export const getAvailableLotsForProduct = (
  productId: string,
  departmentId: string,
  requiredQty?: number,
) => {
  return apiClient.get(
    `/supplier-transactions-combined/available-lots/${productId}/${departmentId}`,
    { params: requiredQty ? { requiredQty } : {} },
  );
};

/**
 * Validate tồn kho trước khi tạo phiếu xuất
 * @route POST /api/supplier-transactions-combined/validate-stock
 * @body { departmentId, items[] }
 */
export const validateStockAvailability = (data: ValidateStockData) => {
  return apiClient.post("/supplier-transactions-combined/validate-stock", data);
};

/* ============================================================
   🔹 ANALYTICS / DASHBOARD
   ============================================================ */

/**
 * Lấy thống kê tổng quan transactions theo tháng
 * @route GET /api/supplier-transactions-combined/stats/overview
 * @query months?
 */
export const getTransactionStatsOverview = (
  params: TransactionStatsParams = {},
) => {
  return apiClient.get("/supplier-transactions-combined/stats/overview", {
    params,
  });
};

/**
 * Lấy top nhà cung cấp theo tổng giá trị giao dịch
 * @route GET /api/supplier-transactions-combined/stats/top-suppliers
 * @query limit?
 */
export const getTopSuppliers = (params: TransactionStatsParams = {}) => {
  return apiClient.get("/supplier-transactions-combined/stats/top-suppliers", {
    params,
  });
};

/**
 * Test timezone conversion (debug)
 * @route GET /api/supplier-transactions-combined/test-timezone
 */
export const testTimezoneConversion = () => {
  return apiClient.get("/supplier-transactions-combined/test-timezone");
};

/* ============================================================
   🔹 HELPER / SHORTCUT QUERIES
   ============================================================ */

/**
 * Lấy danh sách transactions theo nhà cung cấp
 * ⚠️ (Frontend có thể filter qua params thay vì route riêng)
 */
export const getTransactionsBySupplier = (
  supplierId: string,
  params: SupplierTransactionParams = {},
) => {
  return apiClient.get("/supplier-transactions-combined", {
    params: { supplierId, ...params },
  });
};

/**
 * Lấy danh sách transactions theo phòng ban / kho
 */
export const getTransactionsByDepartment = (
  departmentId: string,
  params: SupplierTransactionParams = {},
) => {
  return apiClient.get("/supplier-transactions-combined", {
    params: { departmentId, ...params },
  });
};

/**
 * Cập nhật giá nhập của các items trong transaction (Dành cho Accountant)
 * body: { items: [{ productId, unitPrice }] }
 */
export const updateItemCostInTransaction = (
  transactionId: string,
  items: UpdateItemCostData["items"],
) => {
  return apiClient.put(
    `/supplier-transactions-combined/${transactionId}/item-prices`,
    { items },
  );
};

/**
 * Tạo transaction với items không chứa giá (Dành cho Manager)
 * body: supplierId, departmentId, transDate?, type?, dueDate?, note?, items[]
 */
export const createTransactionWithoutPrice = (
  transactionData: CreateTransactionNoPriceData,
) => {
  return apiClient.post(
    "/supplier-transactions-combined/manager",
    transactionData,
  );
};

/**
 * Cập nhật transaction với items không chứa giá (Dành cho Manager)
 * param: ID của transaction cần cập nhật
 * body: supplierId?, departmentId?, transDate?, type?, dueDate?, note?, status?, items[]?
 */
export const updateTransactionWithoutPrice = (
  id: string,
  transactionData: UpdateTransactionNoPriceData,
) => {
  return apiClient.put(
    `/supplier-transactions-combined/manager/${id}`,
    transactionData,
  );
};

/**
 * @desc Cập nhật trường adminLocked của transaction
 * @route PATCH /api/supplier-transactions-combined/:id/admin-lock
 * @body { adminLocked: boolean }
 * @access Private (Admin only)
 */
export const setTransactionAdminLock = (id: string, adminLocked: boolean) => {
  return apiClient.patch(`/supplier-transactions-combined/${id}/admin-lock`, {
    adminLocked,
  });
};
