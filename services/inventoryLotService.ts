import apiClient from "./apiClient";

export interface InventoryLotParams {
  productId?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export interface InventoryLotData {
  [key: string]: any;
}

// Lấy inventory lots theo product ID
export const getListInventoryLotsByProductId = (
  productId: string,
  params: InventoryLotParams = {},
) => {
  const { limit = 10, offset = 0 } = params;
  return apiClient.get(`/inventory-lots`, {
    params: {
      productId,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

// Lấy chi tiết inventory lot theo ID
export const getInventoryLotById = (inventoryLotId: string) => {
  return apiClient.get(`/inventory-lots/${inventoryLotId}`);
};

// Lấy danh sách inventory lots với phân trang và tìm kiếm
export const getListInventoryLots = (params: InventoryLotParams = {}) => {
  const { q, limit = 10, offset = 0 } = params;
  return apiClient.get("/inventory-lots", {
    params: {
      q: q || undefined,
      limit: parseInt(String(limit)),
      offset: parseInt(String(offset)),
    },
  });
};

// [GET] /inventory-lots/:id/detail - Lấy chi tiết đầy đủ của lô hàng (bao gồm transactions)
export const getInventoryLotDetail = (inventoryLotId: string) => {
  return apiClient.get(`/inventory-lots/${inventoryLotId}/detail`);
};

// Tạo inventory lot mới (Admin, Manager)
export const createInventoryLot = (data: InventoryLotData) => {
  return apiClient.post("/inventory-lots", data);
};

// Cập nhật thông tin inventory lot (Admin, Manager)
export const updateInventoryLot = (
  inventoryLotId: string,
  data: InventoryLotData,
) => {
  return apiClient.put(`/inventory-lots/${inventoryLotId}`, data);
};

// Xóa inventory lot (Admin, Manager)
export const deleteInventoryLot = (inventoryLotId: string) => {
  return apiClient.delete(`/inventory-lots/${inventoryLotId}`);
};

// Cập nhật số lượng tồn kho (Admin, Manager, Picker, Sup_Picker) (hiện tại chưa dùng)
export const updateInventoryLotQuantity = (
  inventoryLotId: string,
  quantity: number,
) => {
  return apiClient.put(`/inventory-lots/${inventoryLotId}/quantity`, {
    quantity,
  });
};

/**
 * @route   GET /inventory-lots/find-with-department-product/:departmentId/:productId
 * @desc    Lấy chi tiết các lô hàng (inventory lots) của một sản phẩm cụ thể
 * trong một phòng ban cụ thể. Dùng để xem chi tiết hạn sử dụng, số lô...
 * @access  Private (All authenticated users)
 */
export const findInventoryLotsInDepartmentByProduct = (
  departmentId: string,
  productId: string,
  params: InventoryLotParams = {},
) => {
  const { q, limit = 10, offset = 0 } = params;
  return apiClient.get(
    `/inventory-lots/find-with-department-product/${departmentId}/${productId}`,
    {
      params: {
        q: q || undefined,
        limit: parseInt(String(limit)),
        offset: parseInt(String(offset)),
      },
    },
  );
};
