import apiClient from "./apiClient";

export interface SalesInvoiceParams {
  q?: string;
  sellerId?: string;
  customerId?: string;
  orderId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface SalesInvoiceData {
  [key: string]: any;
}

/**
 * Lấy danh sách hóa đơn
 * [GET] /api/sales-invoices
 * Query: q, customerId, orderId, status, limit, offset
 * Access: Admin, accountant, seller (sellers can see invoices for their orders only)
 * Hiện tại chưa sử dụng
 */
export const getSalesInvoices = async (params: SalesInvoiceParams = {}) => {
  const { q, sellerId, limit = 10, offset = 0 } = params;
  return apiClient.get("/sales-invoices", {
    params: {
      q: q || undefined,
      sellerId: sellerId || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

/**
 * Lấy danh sách hóa đơn theo customerId và trạng thái
 * [GET] /api/sales-invoices
 * Query: q, customerId, status, limit, offset
 * Access: Admin, accountant
 */
export const getSalesInvoicesByCustomerAndStatus = async (
  params: SalesInvoiceParams = {},
) => {
  const { q, customerId, status, limit = 10, offset = 0 } = params;
  return apiClient.get("/sales-invoices", {
    params: {
      q: q || undefined,
      customerId: customerId || undefined,
      status: status || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

/**
 * Lấy thông tin hóa đơn theo ID
 * [GET] /api/sales-invoices/:id
 * Access:  Admin, accountant, seller (sellers can see invoices for their orders only)
 * chỉ sử dụng để list hết sales invoice của 1 sales order thôi
 */
export const getSalesInvoiceById = async (id: string) => {
  return apiClient.get(`/sales-invoices/${id}`);
};

/**
 * @desc     Lấy thông tin hóa đơn theo order_id
 * @route    GET /api/sales-invoices/order/:orderId
 * Access: Admin, accountant, seller (sellers can see invoices for their orders only)
 */
export const getSalesInvoiceByOrderId = async (orderId: string) => {
  return apiClient.get(`/sales-invoices/order/${orderId}`);
};

/**
 * Tạo hóa đơn mới
 * [POST] /api/sales-invoices
 * Body: orderId, taxAmount, discountAmount, items
 * Items: array of { orderItemId, unitPrice }
 * Access: admin, accountant
 */
export const createSalesInvoice = async (data: SalesInvoiceData) => {
  return apiClient.post("/sales-invoices", data);
};

/**
 * Cập nhật hóa đơn
 * [PUT] /api/sales-invoices/:id
 * Body: invoiceNo, taxAmount, discountAmount, items
 * Items: array of { id (optional), unitPrice }
 * Access: admin
 */
export const updateSalesInvoice = async (
  id: string,
  data: SalesInvoiceData,
) => {
  return apiClient.put(`/sales-invoices/${id}`, data);
};
