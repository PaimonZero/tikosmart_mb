import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as categoryService from "../services/categoryService";
import { CategoryData, CategoryParams } from "../services/categoryService";

export interface Category {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
}

interface CategoryState {
  categories: Category[];
  category: Category | null;
  selectedCategory: Category | null; // For identifying selected category in Add/Edit forms
  pagination: Pagination;

  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchByIdStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";

  fetchError: string | null;
  fetchByIdError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: CategoryState = {
  categories: [],
  category: null,
  selectedCategory: null,
  pagination: { total: 0, limit: 10, offset: 0 },

  fetchStatus: "idle",
  fetchByIdStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",

  fetchError: null,
  fetchByIdError: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

// Thunks
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (params: CategoryParams = {}, { rejectWithValue }) => {
    try {
      const response = await categoryService.listCategories(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (data: CategoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (
    { id, data }: { id: string; data: CategoryData },
    { rejectWithValue },
  ) => {
    try {
      const response = await categoryService.updateCategory(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id: string, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryErrors: (state) => {
      state.fetchError = null;
      state.fetchByIdError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder.addCase(fetchCategories.pending, (state) => {
      state.fetchStatus = "loading";
      state.fetchError = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.fetchStatus = "succeeded";
      const { data, pagination } = action.payload || {};
      const offset = action.meta.arg.offset || 0;

      // Append data if offset > 0 (loading more), otherwise replace
      if (offset === 0) {
        state.categories = data || [];
      } else {
        state.categories = [...state.categories, ...(data || [])];
      }

      if (pagination) {
        state.pagination = pagination;
      }
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.fetchStatus = "failed";
      state.fetchError = action.payload as string;
    });

    // Fetch By ID
    builder.addCase(fetchCategoryById.pending, (state) => {
      state.fetchByIdStatus = "loading";
      state.fetchByIdError = null;
    });
    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      state.fetchByIdStatus = "succeeded";
      state.category = action.payload?.data || action.payload;
    });
    builder.addCase(fetchCategoryById.rejected, (state, action) => {
      state.fetchByIdStatus = "failed";
      state.fetchByIdError = action.payload as string;
    });

    // Create
    builder.addCase(createCategory.pending, (state) => {
      state.createStatus = "loading";
      state.createError = null;
    });
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
      state.categories.unshift(action.payload?.data || action.payload);
      state.pagination.total += 1;
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.createStatus = "failed";
      state.createError = action.payload as string;
    });

    // Update
    builder.addCase(updateCategory.pending, (state) => {
      state.updateStatus = "loading";
      state.updateError = null;
    });
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.updateStatus = "succeeded";
      const updatedItem = action.payload?.data || action.payload;
      if (updatedItem) {
        const index = state.categories.findIndex(
          (c) => c.id === updatedItem.id,
        );
        if (index !== -1) {
          state.categories[index] = updatedItem;
        }
        if (state.category?.id === updatedItem.id) {
          state.category = updatedItem;
        }
      }
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.updateStatus = "failed";
      state.updateError = action.payload as string;
    });

    // Delete
    builder.addCase(deleteCategory.pending, (state) => {
      state.deleteStatus = "loading";
      state.deleteError = null;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
      const id = action.payload.id;
      state.categories = state.categories.filter((c) => c.id !== id);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.deleteStatus = "failed";
      state.deleteError = action.payload as string;
    });
  },
});

export const {
  clearCategoryErrors,
  setSelectedCategory,
  clearSelectedCategory,
} = categorySlice.actions;
export default categorySlice.reducer;
