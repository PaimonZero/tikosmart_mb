import apiClient from "./apiClient";

export interface ProductParams {
  q?: string;
  limit?: number;
  offset?: number;
  supplierId?: string;
  status?: string;
  categoryId?: string;
}

export interface ProductData {
  [key: string]: any;
}

export const listProducts = (params: ProductParams = {}) => {
  const { q, limit = 10, offset = 0, supplierId, status, categoryId } = params;
  return apiClient.get("/products", {
    params: {
      q: q || undefined,
      limit: Number(limit),
      offset: Number(offset),
      supplierId: supplierId || undefined,
      status: status || undefined,
      categoryId: categoryId || undefined,
    },
  });
};

export const createProduct = (productData: ProductData) => {
  return apiClient.post("/products", productData);
};

export const updateProduct = (productId: string, productData: ProductData) => {
  return apiClient.put(`/products/${productId}`, productData);
};

// Thêm function update status riêng
export const updateProductStatus = (productId: string, status: string) => {
  return apiClient.put(`/products/${productId}`, { status });
};

export const getProductById = (productId: string) => {
  return apiClient.get(`/products/${productId}`);
};

export const deleteProduct = (productId: string) => {
  return apiClient.delete(`/products/${productId}`);
};

// Cập nhật trạng thái adminLocked
export const updateProductAdminLocked = (
  productId: string,
  adminLocked: boolean,
) => {
  return apiClient.put(`/products/${productId}`, { adminLocked });
};

// Refresh status single product (admin, manager)
export const refreshProductStatus = (productId: string) => {
  return apiClient.post(`/products/${productId}/refresh-status`);
};

// Refresh status all products (admin)
export const refreshAllProductStatuses = () => {
  return apiClient.post(`/products/refresh-all-status`);
};

/**
 * @route   GET /inventory-lots/find-products-in-department/:departmentId
 * @desc    Lấy danh sách các sản phẩm (đã gom nhóm) có tồn kho trong một phòng ban.
 * Hàm này hữu ích để hiển thị tổng quan những mặt hàng nào đang có trong kho.
 * @access  Private (All authenticated users)
 * @params  departmentId (UUID)
 * @query   q, limit, offset
 * @returns { items, pagination }
 */
export const findProductsInDepartment = (
  departmentId: string,
  params: ProductParams = {},
) => {
  const { q, limit = 10, offset = 0 } = params;
  return apiClient.get(
    `/inventory-lots/find-products-in-department/${departmentId}`,
    {
      params: {
        q: q || undefined,
        limit: Number(limit),
        offset: Number(offset),
      },
    },
  );
};

/**
 * [GET] /products/supplier/:supplierId - Lấy products theo supplier ID
 * Params: supplierId (UUID)
 * Query params: limit, offset
 */
export const getProductsBySupplierId = (
  supplierId: string,
  params: ProductParams = {},
) => {
  const { limit = 10, offset = 0 } = params;
  return apiClient.get(`/products/supplier/${supplierId}`, {
    params: {
      limit: Number(limit),
      offset: Number(offset),
    },
  });
};

/**
 * Upload Image to R2 via Backend
 * @param uri Local file URI from ImagePicker
 * @returns Promise<{ url: string }>
 */
export const uploadImage = async (uri: string) => {
  const formData = new FormData();

  // Extract filename and type
  const filename = uri.split("/").pop() || "upload.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("file", {
    uri,
    name: filename,
    type,
  } as any);

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // Expected { url: "..." }
};
