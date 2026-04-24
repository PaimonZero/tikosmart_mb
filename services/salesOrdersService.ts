import apiClient from "./apiClient";

export interface SalesOrderParams {
  q?: string;
  customerId?: string;
  sellerId?: string;
  status?: string | string[];
  adminLocked?: boolean | string;
  limit?: number;
  offset?: number;
  departmentId?: string; // Used in getListSalesOrdersWithInvoice
  [key: string]: any;
}

export interface SalesOrderItem {
  productId: string;
  qty: number;
  note?: string;
  id?: string;
  unitPrice?: number;
  [key: string]: any;
}

export interface CreateSalesOrderData {
  orderNo?: string;
  customerId: string;
  slaDeliveryAt?: string;
  address?: string;
  items: SalesOrderItem[];
  [key: string]: any;
}

export interface UpdateSalesOrderData {
  orderNo?: string;
  customerId?: string;
  sellerId?: string;
  status?: string | string[];
  slaDeliveryAt?: string;
  address?: string;
  adminLocked?: boolean | string;
  items?: SalesOrderItem[];
  [key: string]: any;
}

/**
 * [GET] /api/sales-orders
 * Query: q, customerId, sellerId, status, adminLocked, limit, offset
 * Access: any authenticated user
 */
export const getListSalesOrders = async (params: SalesOrderParams = {}) => {
  const defaultParams = {
    limit: 10,
    offset: 0,
    ...params,
  };

  return apiClient.get("/sales-orders", {
    params: defaultParams,
  });
};

/**
 * [GET] /api/sales-orders/with-invoice
 * Query: q, customerId, sellerId, departmentId, status, adminLocked, limit, offset
 * Access: any authenticated user
 */
export const getListSalesOrdersWithInvoice = async (
  params: SalesOrderParams = {},
) => {
  const defaultParams = {
    limit: 10,
    offset: 0,
    ...params,
  };
  return apiClient.get("/sales-orders/with-invoice", {
    params: defaultParams,
  });
};

/**
 * [GET] /api/sales-orders/:id
 * Access: any authenticated user
 */
export const getSalesOrderById = async (id: string) => {
  return apiClient.get(`/sales-orders/${id}`);
};

/**
 * [POST] /api/sales-orders
 * Body: orderNo, customerId, slaDeliveryAt, address, items
 * Items: array of { productId, qty, note }
 * Access: seller (sellerId taken from req.user in controller)
 */
export const createSalesOrder = async (data: CreateSalesOrderData) => {
  return apiClient.post("/sales-orders", data);
};

/**
 * [PUT] /api/sales-orders/:id
 * Body: orderNo, customerId, sellerId (ignored for sellers), status, slaDeliveryAt, address, adminLocked, items
 * Items: array of { id, productId, qty, note }
 * Access: admin, seller
 * Note: controller ensures sellerId comes from req.user for callers with role 'seller'
 */
export const updateSalesOrder = async (
  id: string,
  data: UpdateSalesOrderData,
) => {
  return apiClient.put(`/sales-orders/${id}`, data);
};

/**
 * [PATCH] /api/sales-orders/:id/admin-lock
 * Body: { adminLocked: boolean }
 * Access: admin, seller
 */
export const setSalesOrderAdminLock = async (
  id: string,
  adminLocked: boolean,
) => {
  return apiClient.patch(`/sales-orders/${id}/admin-lock`, { adminLocked });
};
