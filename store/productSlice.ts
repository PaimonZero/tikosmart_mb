import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as productService from "../services/productService";
import { ProductData, ProductParams } from "../services/productService";

// Define generic Product type (can be improved with actual fields later)
export interface Product {
  id: string;
  name: string;
  code?: string;
  [key: string]: any;
}
export interface CountsByStatus {
  active: number;
  warning: number;
  disable: number;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
}

interface ProductState {
  // Single Product
  product: Product | null;

  // Main List (Management)
  products: Product[];
  countsByStatus: CountsByStatus;
  productsPagination: Pagination;

  // Select List (Infinite Scroll)
  selectProducts: Product[];
  selectProductsPagination: Pagination;
  selectProductsQuery: string;

  // Other Lists
  productsInDepartment: Product[];
  productsBySupplier: Product[];

  // Statuses
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchProductByIdStatus: "idle" | "loading" | "succeeded" | "failed";

  // Select Statuses
  selectProductsStatus: "idle" | "loading" | "succeeded" | "failed"; // Initial load
  selectProductsLoadMoreStatus: "idle" | "loading" | "succeeded" | "failed"; // Load more

  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";

  refreshStatus: "idle" | "loading" | "succeeded" | "failed";
  refreshAllStatus: "idle" | "loading" | "succeeded" | "failed";

  findProductsInDepartmentStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchProductsBySupplierIdStatus: "idle" | "loading" | "succeeded" | "failed";

  // Errors
  fetchError: string | null;
  fetchProductByIdError: string | null;
  selectProductsError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  refreshError: string | null;
  refreshAllError: string | null;
  findProductsInDepartmentError: string | null;
  fetchProductsBySupplierIdError: string | null;
}

const initialState: ProductState = {
  product: null,
  products: [],
  countsByStatus: { active: 0, warning: 0, disable: 0 },
  productsPagination: { total: 0, limit: 10, offset: 0 },

  selectProducts: [],
  selectProductsPagination: { total: 0, limit: 20, offset: 0 },
  selectProductsQuery: "",

  productsInDepartment: [],
  productsBySupplier: [],

  fetchStatus: "idle",
  fetchProductByIdStatus: "idle",
  selectProductsStatus: "idle",
  selectProductsLoadMoreStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  refreshStatus: "idle",
  refreshAllStatus: "idle",
  findProductsInDepartmentStatus: "idle",
  fetchProductsBySupplierIdStatus: "idle",

  fetchError: null,
  fetchProductByIdError: null,
  selectProductsError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  refreshError: null,
  refreshAllError: null,
  findProductsInDepartmentError: null,
  fetchProductsBySupplierIdError: null,
};

// --- Async Thunks ---

// Fetch products for Select (Infinite Scroll)
export const fetchSelectProducts = createAsyncThunk(
  "product/fetchSelectProducts",
  async (params: ProductParams = {}, { rejectWithValue }) => {
    try {
      const response = await productService.listProducts(params);
      return response.data; // Expected { data: Product[], pagination: Pagination }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// Fetch Main List Products
export const fetchListProducts = createAsyncThunk(
  "product/fetchListProducts",
  async (params: ProductParams = {}, { rejectWithValue }) => {
    try {
      const response = await productService.listProducts(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(productId);
      // Assuming response.data wraps the product or is the product
      return response.data?.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData: ProductData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    { productId, productData }: { productId: string; productData: ProductData },
    { rejectWithValue },
  ) => {
    try {
      const response = await productService.updateProduct(
        productId,
        productData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateProductStatus = createAsyncThunk(
  "product/updateProductStatus",
  async (
    { productId, status }: { productId: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await productService.updateProductStatus(
        productId,
        status,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(productId);
      return { id: productId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateProductAdminLocked = createAsyncThunk(
  "product/updateProductAdminLocked",
  async (
    { productId, adminLocked }: { productId: string; adminLocked: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await productService.updateProductAdminLocked(
        productId,
        adminLocked,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const refreshProductStatus = createAsyncThunk(
  "product/refreshProductStatus",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await productService.refreshProductStatus(productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const refreshAllProductStatuses = createAsyncThunk(
  "product/refreshAllProductStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.refreshAllProductStatuses();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const findProductsInDepartment = createAsyncThunk(
  "product/findProductsInDepartment",
  async (
    {
      departmentId,
      params = {},
    }: { departmentId: string; params?: ProductParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await productService.findProductsInDepartment(
        departmentId,
        params,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchProductsBySupplierId = createAsyncThunk(
  "product/fetchProductsBySupplierId",
  async (
    { supplierId, params = {} }: { supplierId: string; params?: ProductParams },
    { rejectWithValue },
  ) => {
    try {
      const response = await productService.getProductsBySupplierId(
        supplierId,
        params,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetSelectProducts: (state) => {
      state.selectProducts = [];
      state.selectProductsPagination = { total: 0, limit: 20, offset: 0 };
      state.selectProductsStatus = "idle";
      state.selectProductsLoadMoreStatus = "idle";
      state.selectProductsError = null;
    },
    clearProducts: (state) => {
      state.products = [];
      state.productsPagination = { total: 0, limit: 10, offset: 0 };
      state.fetchStatus = "loading"; // Change status to loading immediately
      state.fetchError = null;
    },
    clearProductErrors: (state) => {
      state.fetchError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    // Real-time actions
    addProduct: (state, action) => {
      const newProduct = action.payload;
      if (state.products && Array.isArray(state.products)) {
        state.products.unshift(newProduct);
        state.productsPagination.total += 1;
      }
    },
    updateProductRealtime: (state, action) => {
      const updatedProduct = action.payload;
      // Update in list
      const index = state.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updatedProduct };
      }
      // Update single product if viewing
      if (state.product && state.product.id === updatedProduct.id) {
        state.product = { ...state.product, ...updatedProduct };
      }
    },
    removeProductRealtime: (state, action) => {
      const deletedId = action.payload;
      const initialLength = state.products.length;
      state.products = state.products.filter((p) => p.id !== deletedId);
      if (state.products.length < initialLength) {
        state.productsPagination.total -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    // --- Select Products (Infinite Scroll) ---
    builder.addCase(fetchSelectProducts.pending, (state, action) => {
      const offset = action.meta.arg.offset ?? 0;
      const q = action.meta.arg.q ?? "";

      state.selectProductsQuery = q;

      if (offset === 0) {
        state.selectProductsStatus = "loading";
        state.selectProductsError = null;
      } else {
        state.selectProductsLoadMoreStatus = "loading";
        state.selectProductsError = null;
      }
    });
    builder.addCase(fetchSelectProducts.fulfilled, (state, action) => {
      const offset = action.meta.arg.offset ?? 0;
      // API Response: { success: true, data: [...], pagination: { total, limit, offset, hasMore } }
      const incomingItems = action.payload?.data || [];
      const incomingPagination = action.payload?.pagination;

      if (offset === 0) {
        state.selectProductsStatus = "succeeded";
        state.selectProducts = incomingItems;
      } else {
        state.selectProductsLoadMoreStatus = "succeeded";
        // Avoid duplicates using Set
        const existingIds = new Set(state.selectProducts.map((p) => p.id));
        const newItems = incomingItems.filter(
          (p: Product) => !existingIds.has(p.id),
        );
        state.selectProducts = [...state.selectProducts, ...newItems];
      }

      if (incomingPagination) {
        state.selectProductsPagination = incomingPagination;
      } else {
        // Fallback logic
        state.selectProductsPagination = {
          limit: action.meta.arg.limit ?? 20,
          offset: offset,
          total: incomingPagination?.total ?? state.selectProducts.length,
          hasMore:
            incomingPagination?.hasMore ??
            state.selectProducts.length < (incomingPagination?.total ?? 0),
        };
      }
    });
    builder.addCase(fetchSelectProducts.rejected, (state, action) => {
      const offset = action.meta.arg.offset ?? 0;
      if (offset === 0) {
        state.selectProductsStatus = "failed";
      } else {
        state.selectProductsLoadMoreStatus = "failed";
      }
      state.selectProductsError = action.payload as string;
    });

    // --- Fetch List Products (Management) ---
    builder.addCase(fetchListProducts.pending, (state) => {
      state.fetchStatus = "loading";
      state.fetchError = null;
    });
    builder.addCase(fetchListProducts.fulfilled, (state, action) => {
      state.fetchStatus = "succeeded";
      const offset = action.meta.arg.offset ?? 0;
      const incomingItems = action.payload?.data || [];
      const incomingCountsByStatus = action.payload?.countsByStatus;
      const incomingPagination = action.payload?.pagination;

      if (offset === 0) {
        state.products = incomingItems;
        state.countsByStatus = incomingCountsByStatus;
      } else {
        // Avoid duplicates
        const existingIds = new Set(state.products.map((p) => p.id));
        const newItems = incomingItems.filter(
          (p: Product) => !existingIds.has(p.id),
        );
        state.products = [...state.products, ...newItems];
        state.countsByStatus = incomingCountsByStatus;
      }

      if (incomingPagination) {
        state.productsPagination = incomingPagination;
      } else {
        state.productsPagination = {
          ...state.productsPagination,
          limit: action.meta.arg.limit ?? 10,
          offset: offset,
          total: incomingPagination?.total ?? state.products.length,
        };
      }
    });
    builder.addCase(fetchListProducts.rejected, (state, action) => {
      state.fetchStatus = "failed";
      state.fetchError = action.payload as string;
    });

    // --- Fetch Single Product ---
    builder.addCase(fetchProductById.pending, (state) => {
      state.fetchProductByIdStatus = "loading";
      state.fetchProductByIdError = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.fetchProductByIdStatus = "succeeded";
      state.product = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.fetchProductByIdStatus = "failed";
      state.fetchProductByIdError = action.payload as string;
    });

    // --- Create Product ---
    builder.addCase(createProduct.pending, (state) => {
      state.createStatus = "loading";
      state.createError = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
      // Optimistically update list if needed
      const newItem = action.payload?.data || action.payload;
      if (newItem) {
        state.products.unshift(newItem);
        state.productsPagination.total += 1;
      }
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.createStatus = "failed";
      state.createError = action.payload as string;
    });

    // --- Update Product & Update Status & Admin Locked ---
    // Helper to update local state
    const handleUpdateSuccess = (state: ProductState, action: any) => {
      const updatedItem = action.payload?.data || action.payload;
      if (!updatedItem) return;

      // Update single product if selected
      if (state.product && state.product.id === updatedItem.id) {
        state.product = updatedItem;
      }

      // Update in list
      const index = state.products.findIndex((p) => p.id === updatedItem.id);
      if (index !== -1) {
        state.products[index] = updatedItem;
      }
    };

    const updateOperations = [
      updateProduct,
      updateProductStatus,
      updateProductAdminLocked,
    ];

    updateOperations.forEach((op) => {
      builder.addCase(op.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      });
      builder.addCase(op.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        handleUpdateSuccess(state, action);
      });
      builder.addCase(op.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload as string;
      });
    });

    // --- Delete Product ---
    builder.addCase(deleteProduct.pending, (state) => {
      state.deleteStatus = "loading";
      state.deleteError = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
      const id = action.payload.id;
      state.products = state.products.filter((p) => p.id !== id);
      state.productsPagination.total = Math.max(
        0,
        state.productsPagination.total - 1,
      );
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.deleteStatus = "failed";
      state.deleteError = action.payload as string;
    });

    // --- Refresh Status ---
    builder.addCase(refreshProductStatus.pending, (state) => {
      state.refreshStatus = "loading";
      state.refreshError = null;
    });
    builder.addCase(refreshProductStatus.fulfilled, (state, action) => {
      state.refreshStatus = "succeeded";
      handleUpdateSuccess(state, action);
    });
    builder.addCase(refreshProductStatus.rejected, (state, action) => {
      state.refreshStatus = "failed";
      state.refreshError = action.payload as string;
    });

    // --- Refresh All Status ---
    builder.addCase(refreshAllProductStatuses.pending, (state) => {
      state.refreshAllStatus = "loading";
      state.refreshAllError = null;
    });
    builder.addCase(refreshAllProductStatuses.fulfilled, (state) => {
      state.refreshAllStatus = "succeeded";
    });
    builder.addCase(refreshAllProductStatuses.rejected, (state, action) => {
      state.refreshAllStatus = "failed";
      state.refreshAllError = action.payload as string;
    });

    // --- Find Products In Department ---
    builder.addCase(findProductsInDepartment.pending, (state) => {
      state.findProductsInDepartmentStatus = "loading";
      state.findProductsInDepartmentError = null;
    });
    builder.addCase(findProductsInDepartment.fulfilled, (state, action) => {
      state.findProductsInDepartmentStatus = "succeeded";
      state.productsInDepartment = action.payload?.data || [];
    });
    builder.addCase(findProductsInDepartment.rejected, (state, action) => {
      state.findProductsInDepartmentStatus = "failed";
      state.findProductsInDepartmentError = action.payload as string;
    });

    // --- Fetch Products By Supplier Id ---
    builder.addCase(fetchProductsBySupplierId.pending, (state) => {
      state.fetchProductsBySupplierIdStatus = "loading";
      state.fetchProductsBySupplierIdError = null;
    });
    builder.addCase(fetchProductsBySupplierId.fulfilled, (state, action) => {
      state.fetchProductsBySupplierIdStatus = "succeeded";
      state.productsBySupplier = action.payload?.data || [];
    });
    builder.addCase(fetchProductsBySupplierId.rejected, (state, action) => {
      state.fetchProductsBySupplierIdStatus = "failed";
      state.fetchProductsBySupplierIdError = action.payload as string;
    });
  },
});

export const {
  resetSelectProducts,
  clearProductErrors,
  clearProducts,
  addProduct,
  updateProductRealtime,
  removeProductRealtime,
} = productSlice.actions;

export default productSlice.reducer;
