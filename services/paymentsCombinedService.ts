import apiClient from "./apiClient";

export interface PaymentCombinedParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface PaymentCombinedData {
  [key: string]: any;
}

/**
 * @desc    Lấy danh sách payments
 * @route   GET /api/payments-combined
 * @access  Private (admin, accountant, seller)
 */
export const fetchPaymentsCombined = (params: PaymentCombinedParams = {}) => {
  const { q, limit = 10, offset = 0 } = params;
  return apiClient.get("/payments-combined", {
    params: {
      q: q || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

/**
 * @desc    Lấy thống kê payments theo phương thức thanh toán
 * @route   GET /api/payments-combined/stats/by-method
 * @access  Private (Admin, Accountant)
 */
export const fetchPaymentStatsByMethod = () => {
  return apiClient.get("/payments-combined/stats/by-method");
};

/**
 * @desc    Lấy tổng số tiền đã nhận cho một invoice
 * @route   GET /api/payments-combined/invoice/:invoiceId/total-received
 * @access  Private (Admin, Seller, Accountant)
 */
export const fetchTotalReceivedForInvoice = (invoiceId: string) => {
  return apiClient.get(
    `/payments-combined/invoice/${invoiceId}/total-received`,
  );
};

/**
 * @desc    Lấy allocations của một invoice
 * @route   GET /api/payments-combined/invoice/:invoiceId/allocations
 * @access  Private (Admin, Seller, Accountant)
 */
export const fetchAllocationsForInvoice = (invoiceId: string) => {
  return apiClient.get(`/payments-combined/invoice/${invoiceId}/allocations`);
};

/**
 * @desc    Tạo payment mới
 * @route   POST /api/payments-combined
 * @access  Private (Admin, Accountant)
 */
export const createPaymentCombined = (paymentData: PaymentCombinedData) => {
  return apiClient.post("/payments-combined", paymentData);
};

/**
 * @desc    Lấy chi tiết payment
 * @route   GET /api/payments-combined/:id
 * @access  Private (Admin, Seller, Accountant)
 */
export const fetchPaymentCombinedById = (id: string) => {
  return apiClient.get(`/payments-combined/${id}`);
};

/**
 * @desc    Cập nhật payment
 * @route   PUT /api/payments-combined/:id
 * @access  Private (Admin, Accountant)
 */
export const updatePaymentCombined = (
  id: string,
  paymentData: PaymentCombinedData,
) => {
  return apiClient.put(`/payments-combined/${id}`, paymentData);
};
