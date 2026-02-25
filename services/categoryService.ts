import apiClient from "./apiClient";

export interface CategoryParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface CategoryData {
  [key: string]: any;
}

export const listCategories = (params: CategoryParams = {}) => {
  const { q, limit = 10, offset = 0 } = params;
  return apiClient.get("/product-categories", {
    params: {
      q: q || undefined,
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

// Lấy thông tin product category theo ID
export const getCategoryById = (id: string) => {
  return apiClient.get(`/product-categories/${id}`);
};

// [POST] /product-categories - Tạo product category mới
export const createCategory = (data: CategoryData) => {
  return apiClient.post("/product-categories", data);
};

// [PUT] /product-categories/:id - Cập nhật thông tin product category
export const updateCategory = (id: string, data: CategoryData) => {
  return apiClient.put(`/product-categories/${id}`, data);
};

// [DELETE] /product-categories/:id - Xóa product category
export const deleteCategory = (id: string) => {
  return apiClient.delete(`/product-categories/${id}`);
};
