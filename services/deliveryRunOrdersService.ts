import apiClient from "./apiClient";

export interface CompleteDeliveryRunOrderData {
  actualPay: number;
  evdUrl?: string;
  note?: string;
  [key: string]: any;
}

export interface CancelDeliveryRunOrderData {
  note?: string;
  [key: string]: any;
}

export interface FailDeliveryRunOrderData {
  note: string;
  [key: string]: any;
}

export interface ReopenDeliveryRunOrderData {
  [key: string]: any;
}

export interface DeliveryRunOrdersParams {
  q?: string;
  runId?: string;
  orderId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Bắt đầu giao hàng cho một order
 * @param orderId - ID của delivery run order
 */
export const startDeliveryRunOrder = async (orderId: string) => {
  try {
    const response = await apiClient.patch(
      `/delivery-run-orders/${orderId}/start`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Hoàn thành giao hàng cho một order
 * @param orderId - ID của delivery run order
 * @param data - Dữ liệu hoàn thành giao hàng
 */
export const completeDeliveryRunOrder = async (
  orderId: string,
  data: CompleteDeliveryRunOrderData = { actualPay: 0 },
) => {
  try {
    const response = await apiClient.patch(
      `/delivery-run-orders/${orderId}/complete`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Hủy giao hàng cho một order (chỉ admin)
 * @param orderId - ID của delivery run order
 * @param data - Dữ liệu hủy giao hàng
 */
export const cancelDeliveryRunOrder = async (
  orderId: string,
  data: CancelDeliveryRunOrderData = {},
) => {
  try {
    const response = await apiClient.patch(
      `/delivery-run-orders/${orderId}/cancel`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Đánh dấu giao hàng thất bại (chỉ admin)
 * @param orderId - ID của delivery run order
 * @param data - Dữ liệu thất bại
 */
export const failDeliveryRunOrder = async (
  orderId: string,
  data: FailDeliveryRunOrderData,
) => {
  try {
    const response = await apiClient.patch(
      `/delivery-run-orders/${orderId}/fail`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Lấy danh sách delivery run orders
 */
export const getDeliveryRunOrders = async (
  params: DeliveryRunOrdersParams = {},
) => {
  try {
    const response = await apiClient.get("/delivery-run-orders", { params });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Lấy thông tin chi tiết một delivery run order
 * @param orderId - ID của delivery run order
 */
export const getDeliveryRunOrderById = async (orderId: string) => {
  try {
    const response = await apiClient.get(`/delivery-run-orders/${orderId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Lấy danh sách orders theo delivery run ID
 * @param runId - ID của delivery run
 */
export const getDeliveryRunOrdersByRunId = async (runId: string) => {
  try {
    const response = await apiClient.get(`/delivery-run-orders/run/${runId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Lấy danh sách delivery runs theo sales order ID
 * @param orderId - ID của sales order
 */
export const getDeliveryRunOrdersByOrderId = async (orderId: string) => {
  try {
    const response = await apiClient.get(
      `/delivery-run-orders/order/${orderId}`,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Mở lại giao hàng cho một order đã hủy (chỉ admin, sup_shipper)
 * @param orderId - ID của delivery run order
 * @param data - Dữ liệu mở lại (optional)
 */
export const reopenDeliveryRunOrder = async (
  orderId: string,
  data: ReopenDeliveryRunOrderData = {},
) => {
  try {
    const response = await apiClient.patch(
      `/delivery-run-orders/${orderId}/reopen`,
      data,
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
