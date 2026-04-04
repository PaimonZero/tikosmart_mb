import apiClient from "./apiClient";

export interface DeliveryRunParams {
  q?: string;
  supervisorId?: string;
  shipperId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface CreateDeliveryRunData {
  deliveryNo?: string;
  supervisorId?: string;
  shipperId?: string;
  vehicleNo?: string;
  status?: string;
  orders?: any[];
  [key: string]: any;
}

export interface UpdateDeliveryRunData {
  deliveryNo?: string;
  supervisorId?: string;
  shipperId?: string;
  vehicleNo?: string;
  status?: string;
  [key: string]: any;
}

export interface DeliveryRunOrderParams {
  q?: string;
  runId?: string;
  orderId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface CompleteDeliveryOrderData {
  actualPay?: number;
  evdUrl?: string;
  note?: string;
  [key: string]: any;
}

/**
 * [GET] /api/delivery-runs
 * Query: q, supervisorId, shipperId, status, limit, offset
 * Access: authenticated users
 */
export const getListDeliveryRuns = async (params: DeliveryRunParams = {}) => {
  const { q, supervisorId, shipperId, status, limit = 10, offset = 0 } = params;
  return apiClient.get("/delivery-runs", {
    params: {
      q: q || undefined,
      supervisorId: supervisorId || undefined,
      shipperId: shipperId || undefined,
      status: status || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

/**
 * [GET] /api/delivery-runs/:id
 * Access: authenticated users
 */
export const getDeliveryRunById = async (id: string) => {
  return apiClient.get(`/delivery-runs/${id}`);
};

/**
 * [POST] /api/delivery-runs
 * Body: deliveryNo, supervisorId, shipperId, vehicleNo, status, orders
 * Access: admin, sup_shipper
 */
export const createDeliveryRun = async (data: CreateDeliveryRunData) => {
  return apiClient.post("/delivery-runs", data);
};

/**
 * [PUT] /api/delivery-runs/:id
 * Body: deliveryNo, supervisorId, shipperId, vehicleNo, status
 * Access: admin, sup_shipper
 */
export const updateDeliveryRun = async (
  id: string,
  data: UpdateDeliveryRunData,
) => {
  return apiClient.put(`/delivery-runs/${id}`, data);
};

/**
 * [DELETE] /api/delivery-runs/:id
 * Access: admin
 */
export const deleteDeliveryRun = async (id: string) => {
  return apiClient.delete(`/delivery-runs/${id}`);
};

/**
 * [PATCH] /api/delivery-runs/:id/start
 * Start delivery run (assigned -> in_progress)
 * Access: sup_shipper, shipper
 */
export const startDeliveryRun = async (id: string, data: any = {}) => {
  return apiClient.patch(`/delivery-runs/${id}/start`, data);
};

/**
 * [PATCH] /api/delivery-runs/:id/complete
 * Complete delivery run (in_progress -> completed)
 * Access: sup_shipper, shipper
 */
export const completeDeliveryRun = async (id: string) => {
  return apiClient.patch(`/delivery-runs/${id}/complete`);
};

/**
 * [PATCH] /api/delivery-runs/:id/cancel
 * Cancel delivery run
 * Access: admin, sup_shipper
 */
export const cancelDeliveryRun = async (id: string) => {
  return apiClient.patch(`/delivery-runs/${id}/cancel`);
};

// ============================================================
// DELIVERY RUN ORDERS
// ============================================================

/**
 * [GET] /api/delivery-run-orders
 * Query: q, runId, orderId, status, limit, offset
 * Access: authenticated users
 */
export const getListDeliveryRunOrders = async (
  params: DeliveryRunOrderParams = {},
) => {
  const { q, runId, orderId, status, limit = 10, offset = 0 } = params;
  return apiClient.get("/delivery-run-orders", {
    params: {
      q: q || undefined,
      runId: runId || undefined,
      orderId: orderId || undefined,
      status: status || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

/**
 * [GET] /api/delivery-run-orders/run/:runId
 * Get all orders of a specific delivery run
 * Access: authenticated users
 */
export const getDeliveryRunOrdersByRunId = async (runId: string) => {
  return apiClient.get(`/delivery-run-orders/run/${runId}`);
};

/**
 * [PATCH] /api/delivery-run-orders/:id/start
 * Start delivery (pending -> in_progress)
 * Access: sup_shipper, shipper
 */
export const startDeliveryOrder = async (id: string) => {
  return apiClient.patch(`/delivery-run-orders/${id}/start`);
};

/**
 * [PATCH] /api/delivery-run-orders/:id/complete
 * Complete delivery (in_progress -> completed)
 * Body: actualPay, evdUrl, note
 * Access: sup_shipper, shipper
 */
export const completeDeliveryOrder = async (
  id: string,
  data: CompleteDeliveryOrderData = {},
) => {
  return apiClient.patch(`/delivery-run-orders/${id}/complete`, data);
};

/**
 * [PATCH] /api/delivery-run-orders/:id/fail
 * Mark delivery as failed
 * Body: note (required)
 * Access: sup_shipper, shipper
 */
export const failDeliveryOrder = async (id: string, note: string) => {
  return apiClient.patch(`/delivery-run-orders/${id}/fail`, { note });
};

/**
 * [POST] /api/delivery-runs/:id/recalculate
 * Dynamic route recalculation mid-run (warehouse-aware)
 * Body: new_start_lat, new_start_lng
 * Access: sup_shipper, shipper
 */
export const recalculateDeliveryRoute = async (
  id: string,
  data: { new_start_lat: number; new_start_lng: number }
) => {
  return apiClient.post(`/delivery-runs/${id}/recalculate`, data);
};
