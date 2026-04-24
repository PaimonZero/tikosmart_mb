import apiClient from "./apiClient";

export interface CodRemittanceTicketParams {
  q?: string;
  shipperId?: string;
  deliveryRunId?: string;
  status?: string;
  createdBy?: string;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
}

export interface AvailableDeliveryRunsParams {
  shipperId?: string;
  limit?: number;
  offset?: number;
}

export interface CreateTicketData {
  deliveryRunId: string;
  receivedAmount: number;
  status?: string;
  note?: string;
}

export interface UpdateTicketData {
  receivedAmount?: number;
  status?: string;
  note?: string;
}

/**
 * @desc    Lấy danh sách COD remittance tickets với phân trang
 * @route   GET /api/cod-remittance-tickets
 * @access  Private (Admin, Accountant, Sup_Shipper)
 */
export const getCodRemittanceTickets = (
  params: CodRemittanceTicketParams = {},
) => {
  const {
    q,
    shipperId,
    deliveryRunId,
    status,
    createdBy,
    fromDate,
    toDate,
    limit,
    offset,
  } = params;

  return apiClient.get("/cod-remittance-tickets", {
    params: {
      q: q || undefined,
      shipperId: shipperId || undefined,
      deliveryRunId: deliveryRunId || undefined,
      status: status || undefined,
      createdBy: createdBy || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      limit: Number(limit) || 20,
      offset: Number(offset) || 0,
    },
  });
};

/**
 * @desc    Lấy thông tin ticket theo ID
 * @route   GET /api/cod-remittance-tickets/:id
 * @access  Private (Admin, Accountant, Sup_Shipper)
 */
export const getCodRemittanceTicketById = (ticketId: string) => {
  return apiClient.get(`/cod-remittance-tickets/${ticketId}`);
};

/**
 * @desc    Lấy danh sách delivery runs khả dụng (completed và chưa có ticket)
 * @route   GET /api/cod-remittance-tickets/available-delivery-runs
 * @access  Private (Admin, Accountant, Sup_Shipper)
 */
export const getAvailableDeliveryRuns = (
  params: AvailableDeliveryRunsParams = {},
) => {
  const { shipperId, limit, offset } = params;

  return apiClient.get("/cod-remittance-tickets/available-delivery-runs", {
    params: {
      shipperId: shipperId || undefined,
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
    },
  });
};

/**
 * @desc    Tạo COD remittance ticket mới
 * @route   POST /api/cod-remittance-tickets
 * @access  Private (Admin, Accountant, Sup_Shipper)
 */
export const createCodRemittanceTicket = (ticketData: CreateTicketData) => {
  return apiClient.post("/cod-remittance-tickets", ticketData);
};

/**
 * @desc    Cập nhật thông tin ticket
 * @route   PUT /api/cod-remittance-tickets/:id
 * @access  Private (Admin, Accountant)
 */
export const updateCodRemittanceTicket = (
  ticketId: string,
  ticketData: UpdateTicketData,
) => {
  return apiClient.put(`/cod-remittance-tickets/${ticketId}`, ticketData);
};

/**
 * @desc    Xóa ticket
 * @route   DELETE /api/cod-remittance-tickets/:id
 * @access  Private (Admin only)
 */
export const deleteCodRemittanceTicket = (ticketId: string) => {
  return apiClient.delete(`/cod-remittance-tickets/${ticketId}`);
};

/**
 * ✅ NEW: Lấy thông tin chi tiết ticket theo ID (bao gồm orders)
 * @route   GET /api/cod-remittance-tickets/:id/details
 * @access  Private (Admin, Accountant, Sup_Shipper)
 */
export const getCodRemittanceTicketDetails = (ticketId: string) => {
  return apiClient.get(`/cod-remittance-tickets/${ticketId}/details`);
};
