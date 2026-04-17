import apiClient from "./apiClient";

export interface SupplierParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface SupplierData {
  [key: string]: any;
}

// Lấy danh sách nhà cung cấp với phân trang và tìm kiếm
export const listSuppliers = (params: SupplierParams = {}) => {
  const { q, limit = 10, offset = 0 } = params;
  return apiClient.get("/suppliers", {
    params: {
      q: q || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

// Tạo mới nhà cung cấp
export const createSupplier = (supplierData: SupplierData) => {
  return apiClient.post("/suppliers", supplierData);
};

// Cập nhật nhà cung cấp
export const updateSupplier = (
  supplierId: string,
  supplierData: SupplierData,
) => {
  return apiClient.put(`/suppliers/${supplierId}`, supplierData);
};

// Xoá nhà cung cấp
export const deleteSupplier = (supplierId: string) => {
  return apiClient.delete(`/suppliers/${supplierId}`);
};

// Xoá nhiều nhà cung cấp cùng lúc
export const deleteBulkSuppliers = (ids: string[]) => {
  return apiClient.delete("/suppliers/bulk", { data: { ids } });
};

// Lấy chi tiết nhà cung cấp theo ID hoặc code
export const getSupplierById = (supplierId: string) => {
  return apiClient.get(`/suppliers/${supplierId}`);
};

// Lấy chi tiết nhà cung cấp theo mã code
export const getSupplierByCode = (code: string) => {
  return apiClient.get(`/suppliers/code/${code}`);
};

// Tìm kiếm nhà cung cấp (dùng cho autocomplete, dropdown, ...)
export const searchSuppliers = (params: SupplierParams = {}) => {
  return apiClient.get("/suppliers/search", { params });
};

// Lấy danh sách nhà cung cấp mới tạo gần đây
export const getRecentSuppliers = (limit: number = 5) => {
  return apiClient.get("/suppliers/recent", { params: { limit } });
};

// Thống kê số lượng nhà cung cấp theo ngày tạo (trong 30 ngày gần nhất)
export const getSupplierCreationStats = () => {
  return apiClient.get("/suppliers/stats/creation");
};
