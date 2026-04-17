import apiClient from "./apiClient";

export interface CustomerParams {
  q?: string;
  limit?: number;
  offset?: number;
  managedBy?: string;
}

export interface CustomerData {
  [key: string]: any;
}

export interface FinancialSummaryParams {
  managedBy?: string;
}

/**
 * @desc    Lấy danh sách khách hàng theo managedBy với phân trang
 * @route   GET /api/customers/managed-by/:managedBy
 * @access  Private (Admin, Seller)
 */
export const getListCustomers = async (
  managedBy: string,
  params: CustomerParams,
) => {
  const { q, limit, offset } = params;
  return apiClient.get(`/customers/managed-by/${managedBy}`, {
    params: {
      q: q || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

/**
 * ✅ NEW: Lấy danh sách customers với thống kê số lượng invoices theo trạng thái
 * @route   GET /api/customers/with-invoice-stats
 * @access  Private (Admin, Seller, Accountant)
 */
export const getListCustomersWithInvoiceStats = (
  params: CustomerParams = {},
) => {
  const { q, limit, offset } = params;
  return apiClient.get(`/customers/with-invoice-stats`, {
    params: {
      q: q || undefined,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0,
    },
  });
};

/**
 * @desc    Lấy danh sách khách hàng kèm tổng doanh số & công nợ
 * @route   GET /api/customers/with-money
 */
export const getListCustomersWithMoney = async (params: CustomerParams) => {
  const { q, managedBy, limit, offset } = params;
  return apiClient.get(`/customers/with-money`, {
    params: {
      q: q || undefined,
      managedBy: managedBy || undefined,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0,
    },
  });
};

/**
 * @desc    Lấy danh sách khách hàng (bản gốc)
 * @route   GET /api/customers
 */
export const listCustomers = (params: CustomerParams = {}) => {
  const { q, limit = 10, offset = 0 } = params;
  return apiClient.get("/customers", {
    params: { q, limit, offset },
  });
};

/**
 * @desc    Tạo mới một khách hàng
 * @route   POST /api/customers
 */
export const createCustomer = (customerData: CustomerData) => {
  return apiClient.post("/customers", customerData);
};

/**
 * @desc    Cập nhật thông tin khách hàng theo ID
 * @route   PUT /api/customers/:id
 */
export const updateCustomer = (
  customerId: string,
  customerData: CustomerData,
) => {
  return apiClient.put(`/customers/${customerId}`, customerData);
};

/**
 * @desc    Xóa khách hàng theo ID
 * @route   DELETE /api/customers/:id
 */
export const deleteCustomer = (customerId: string) => {
  return apiClient.delete(`/customers/${customerId}`);
};

/**
 * @desc    Lấy chi tiết khách hàng theo ID
 * @route   GET /api/customers/:id
 */
export const getCustomerById = (customerId: string) => {
  return apiClient.get(`/customers/${customerId}`);
};

/**
 * ✅ NEW: Lấy tổng hợp tài chính khách hàng
 * @route   GET /api/customers/financial-summary
 * @access  Private (Admin, Seller, Accountant)
 */
export const getCustomerFinancialSummary = (
  params: FinancialSummaryParams = {},
) => {
  const { managedBy } = params;
  return apiClient.get("/customers/financial-summary", {
    params: {
      managedBy: managedBy || undefined,
    },
  });
};

/**
 * @desc    Lấy lịch sử giao dịch theo customer
 * @route   GET /api/payments-combined/customer/:customerId/history
 * @access  Private (admin, accountant, seller)
 */
export const getCustomerTransactionHistory = (
  customerId: string,
  params: CustomerParams = {},
) => {
  const { limit = 10, offset = 0 } = params;
  return apiClient.get(`/payments-combined/customer/${customerId}/history`, {
    params: { limit, offset },
  });
};
