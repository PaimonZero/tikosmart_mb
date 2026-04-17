import apiClient from "./apiClient";

export interface PaymentQueryParams {
  limit?: number;
  offset?: number;
  from?: string;
  to?: string;
  period?: string;
  timezone?: string;
  [key: string]: any;
}

export interface PaymentParams {
  q?: string;
  transId?: string;
  supplierId?: string;
  departmentId?: string;
  paidBy?: string;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
}

export interface CreatePaymentData {
  transId: string;
  amount: number;
  paidAt?: string;
  paidBy?: string;
  evdUrl?: string;
  note?: string;
  [key: string]: any;
}

export interface UpdatePaymentData {
  amount?: number;
  paidAt?: string;
  paidBy?: string;
  evdUrl?: string;
  note?: string;
  [key: string]: any;
}

//Lấy tất cả payments của một transaction
// Access: Admin, Manager, Accountant
export const getAllPaymentsByTransactionId = async (transactionId: string) => {
  return apiClient.get(
    `/supplier-transaction-payments/transaction/${transactionId}`,
  );
};

//Lấy payments theo người thanh toán
// Query params: limit, offset
//Access: Admin, Manager, Accountant
export const getPaymentsByPayer = async (
  paidBy: string,
  queryParams: PaymentQueryParams,
) => {
  return apiClient.get(`/supplier-transaction-payments/paid-by/${paidBy}`, {
    params: queryParams,
  });
};

//Lấy payments theo người tạo
// Query params: limit, offset
//Access: Admin, Manager, Accountant
export const getPaymentsByCreator = async (
  createdBy: string,
  queryParams: PaymentQueryParams,
) => {
  return apiClient.get(
    `/supplier-transaction-payments/created-by/${createdBy}`,
    {
      params: queryParams,
    },
  );
};

//Lấy thống kê thanh toán theo user
//Query params: from, to, period, timezone
//Access: Admin, Manager, Accountant
export const getPaymentStatsByUser = async (
  userId: string,
  queryParams: PaymentQueryParams,
) => {
  return apiClient.get(
    `/supplier-transaction-payments/stats/by-user/${userId}`,
    {
      params: queryParams,
    },
  );
};

//Lấy thống kê thanh toán theo tháng
//Access: Admin và Manager, Accountant
export const getPaymentStatsByMonth = async () => {
  return apiClient.get(`/supplier-transaction-payments/stats/by-month`);
};

//Lấy danh sách payments với phân trang và tìm kiếm
//Query params: q, transId, supplierId, departmentId, paidBy, createdBy, fromDate, toDate, limit, offset
//Access: Admin, Manager, Accountant
export const getPayments = async (params: PaymentParams = {}) => {
  const {
    q,
    transId,
    supplierId,
    departmentId,
    paidBy,
    createdBy,
    fromDate,
    toDate,
    limit = 10,
    offset = 0,
  } = params;

  const queryParams = {
    q: q || undefined,
    transId: transId || undefined,
    supplierId: supplierId || undefined,
    departmentId: departmentId || undefined,
    paidBy: paidBy || undefined,
    createdBy: createdBy || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    limit: Number(limit),
    offset: Number(offset),
  };
  return apiClient.get(`/supplier-transaction-payments`, {
    params: queryParams,
  });
};

//Tạo mới payment
//Body: {transId, amount, paidAt, paidBy, evdUrl, note}
//Access: Admin, Manager, Accountant
export const createPayment = async (paymentData: CreatePaymentData) => {
  return apiClient.post(`/supplier-transaction-payments`, paymentData);
};

//Lấy thông tin payment theo ID
//Access: Admin, Manager, Accountant
export const getPaymentById = async (paymentId: string) => {
  return apiClient.get(`/supplier-transaction-payments/${paymentId}`);
};

//Cập nhật thông tin payment
//Body: {amount, paidAt, paidBy, evdUrl, note}
//Access: Admin, Manager, Accountant
export const updatePayment = async (
  paymentId: string,
  updateData: UpdatePaymentData,
) => {
  return apiClient.put(
    `/supplier-transaction-payments/${paymentId}`,
    updateData,
  );
};

//Xoá payment
//Access: Admin, Manager
export const deletePayment = async (paymentId: string) => {
  return apiClient.delete(`/supplier-transaction-payments/${paymentId}`);
};

//Xóa tất cả payments của một transaction
//Access: Admin, Manager
export const deletePaymentsByTransactionId = async (transactionId: string) => {
  return apiClient.delete(
    `/supplier-transaction-payments/transaction/${transactionId}`,
  );
};

//Tính tổng số tiền đã thanh toán cho một transaction
//Access: Admin, Manager, Accountant
export const getTotalPaidAmountByTransactionId = async (
  transactionId: string,
) => {
  return apiClient.get(
    `/supplier-transaction-payments/transaction/${transactionId}/total`,
  );
};
