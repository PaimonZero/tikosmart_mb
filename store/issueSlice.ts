import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addIssueComment as addIssueCommentAPI,
  addIssueTag as addIssueTagAPI,
  createIssue as createIssueAPI,
  CreateIssueData,
  deleteIssue as deleteIssueAPI,
  deleteIssueComment as deleteIssueCommentAPI,
  getIssueById as getIssueByIdAPI,
  getIssueCommentById as getIssueCommentByIdAPI,
  IssueCommentData,
  IssueParams,
  IssueTagData,
  listIssueComments as listIssueCommentsAPI,
  listIssues as listIssuesAPI,
  updateIssue as updateIssueAPI,
  updateIssueComment as updateIssueCommentAPI,
  UpdateIssueData,
  updateIssueStatus as updateIssueStatusAPI,
} from "../services/issueService";

export interface IssueComment {
  id: string;
  [key: string]: any;
}

export interface IssueTag {
  id: string;
  [key: string]: any;
}

export interface Issue {
  id: string;
  comments?: IssueComment[];
  tags?: IssueTag[];
  [key: string]: any;
}

export interface IssueState {
  issues: Issue[];
  selectedIssue: Issue | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  updateStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  commentStatus: "idle" | "loading" | "succeeded" | "failed";
  tagStatus: "idle" | "loading" | "succeeded" | "failed";
  fetchError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  commentError: string | null;
  tagError: string | null;
}

/* ============================================================
   INITIAL STATE
   ============================================================ */
const initialState: IssueState = {
  issues: [],
  selectedIssue: null,
  fetchStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  commentStatus: "idle",
  tagStatus: "idle",
  fetchError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  commentError: null,
  tagError: null,
};

/* ============================================================
   ASYNC THUNKS
   ============================================================ */

// 📋 Lấy danh sách issues
export const fetchIssues = createAsyncThunk(
  "issues/fetchList",
  async (params: IssueParams = {}, { rejectWithValue }) => {
    try {
      const res = await listIssuesAPI(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🔍 Lấy chi tiết issue
export const fetchIssueById = createAsyncThunk(
  "issues/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getIssueByIdAPI(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ➕ Tạo issue mới
export const createIssue = createAsyncThunk(
  "issues/create",
  async (data: CreateIssueData, { rejectWithValue }) => {
    try {
      const res = await createIssueAPI(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ✏️ Cập nhật issue
export const updateIssue = createAsyncThunk(
  "issues/update",
  async (
    { id, data }: { id: string; data: UpdateIssueData },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateIssueAPI(id, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🔄 Cập nhật trạng thái issue
export const updateIssueStatus = createAsyncThunk(
  "issues/updateStatus",
  async (
    { id, status }: { id: string; status: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateIssueStatusAPI(id, status);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ❌ Xóa issue
export const deleteIssue = createAsyncThunk(
  "issues/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await deleteIssueAPI(id);
      return { id, ...res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 💬 Thêm comment
export const addIssueComment = createAsyncThunk(
  "issues/addComment",
  async (
    { issueId, data }: { issueId: string; data: IssueCommentData },
    { rejectWithValue },
  ) => {
    try {
      const res = await addIssueCommentAPI(issueId, data);
      return { issueId, comment: res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🏷️ Thêm tag
export const addIssueTag = createAsyncThunk(
  "issues/addTag",
  async (
    { issueId, data }: { issueId: string; data: IssueTagData },
    { rejectWithValue },
  ) => {
    try {
      const res = await addIssueTagAPI(issueId, data);
      return { issueId, tag: res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

/* ============================================================
   💬 COMMENT CRUD THUNKS
   ============================================================ */

// 📋 Lấy danh sách comment của issue
export const fetchIssueComments = createAsyncThunk(
  "issues/fetchComments",
  async (issueId: string, { rejectWithValue }) => {
    try {
      const res = await listIssueCommentsAPI(issueId);
      return { issueId, comments: res.data?.data || res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// 🔍 Lấy chi tiết 1 comment
export const fetchIssueCommentById = createAsyncThunk(
  "issues/fetchCommentById",
  async (
    { issueId, commentId }: { issueId: string; commentId: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await getIssueCommentByIdAPI(issueId, commentId);
      return res.data?.data || res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ✏️ Cập nhật comment
export const updateIssueComment = createAsyncThunk(
  "issues/updateComment",
  async (
    {
      issueId,
      commentId,
      data,
    }: { issueId: string; commentId: string; data: IssueCommentData },
    { rejectWithValue },
  ) => {
    try {
      const res = await updateIssueCommentAPI(issueId, commentId, data);
      return { issueId, comment: res.data?.data || res.data };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

// ❌ Xóa comment
export const deleteIssueComment = createAsyncThunk(
  "issues/deleteComment",
  async (
    { issueId, commentId }: { issueId: string; commentId: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await deleteIssueCommentAPI(issueId, commentId);
      return { issueId, commentId };
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  },
);

/* ============================================================
   SLICE
   ============================================================ */

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    clearSelectedIssue: (state) => {
      state.selectedIssue = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------- FETCH LIST -------- */
      .addCase(fetchIssues.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.issues = action.payload?.data || action.payload;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message || null;
      })

      /* -------- FETCH BY ID -------- */
      .addCase(fetchIssueById.pending, (state) => {
        state.fetchStatus = "loading";
        state.selectedIssue = null;
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.selectedIssue = action.payload?.data || action.payload;
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError =
          (action.payload as any)?.message || action.error.message || null;
        state.selectedIssue = null;
      })

      /* -------- CREATE -------- */
      .addCase(createIssue.pending, (state) => {
        state.createStatus = "loading";
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        const newIssue = action.payload?.data || action.payload;
        if (Array.isArray(state.issues)) state.issues.unshift(newIssue);
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError =
          (action.payload as any)?.message || action.error.message || null;
      })

      /* -------- UPDATE -------- */
      .addCase(updateIssue.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const updated = action.payload?.data || action.payload;
        if (!updated?.id) return;

        // Update in list
        const idx = state.issues.findIndex((i) => i.id === updated.id);
        if (idx !== -1)
          state.issues[idx] = { ...state.issues[idx], ...updated };

        // Update selected
        if (state.selectedIssue?.id === updated.id) {
          state.selectedIssue = { ...state.selectedIssue, ...updated };
        }
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message || null;
      })

      /* -------- UPDATE STATUS -------- */
      .addCase(updateIssueStatus.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        const updated = action.payload?.data || action.payload;
        if (!updated?.id) return;

        // Update trong danh sách
        const idx = state.issues.findIndex((i) => i.id === updated.id);
        if (idx !== -1)
          state.issues[idx] = { ...state.issues[idx], ...updated };

        // Update selectedIssue nếu đang mở
        if (state.selectedIssue?.id === updated.id) {
          state.selectedIssue = { ...state.selectedIssue, ...updated };
        }
      })
      .addCase(updateIssueStatus.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError =
          (action.payload as any)?.message || action.error.message || null;
      })

      /* -------- DELETE -------- */
      .addCase(deleteIssue.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.deleteStatus = "succeeded";
        const id = action.payload?.id;
        if (id) {
          state.issues = state.issues.filter((i) => i.id !== id);
        }
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.deleteError =
          (action.payload as any)?.message || action.error.message || null;
      })

      /* -------- ADD COMMENT -------- */
      .addCase(addIssueComment.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(addIssueComment.fulfilled, (state, action) => {
        state.commentStatus = "succeeded";
        const { issueId, comment } = action.payload;
        if (state.selectedIssue?.id === issueId) {
          state.selectedIssue.comments = [
            ...(state.selectedIssue.comments || []),
            comment,
          ];
        }
      })
      .addCase(addIssueComment.rejected, (state, action) => {
        state.commentStatus = "failed";
        state.commentError =
          (action.payload as any)?.message || action.error.message || null;
      })

      /* -------- ADD TAG -------- */
      .addCase(addIssueTag.pending, (state) => {
        state.tagStatus = "loading";
      })
      .addCase(addIssueTag.fulfilled, (state, action) => {
        state.tagStatus = "succeeded";
        const { issueId, tag } = action.payload;
        if (state.selectedIssue?.id === issueId) {
          state.selectedIssue.tags = [...(state.selectedIssue.tags || []), tag];
        }
      })
      .addCase(addIssueTag.rejected, (state, action) => {
        state.tagStatus = "failed";
        state.tagError =
          (action.payload as any)?.message || action.error.message || null;
      })
      /* -------- FETCH COMMENTS -------- */
      .addCase(fetchIssueComments.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(fetchIssueComments.fulfilled, (state, action) => {
        state.commentStatus = "succeeded";
        const { issueId, comments } = action.payload;
        if (state.selectedIssue?.id === issueId) {
          state.selectedIssue.comments = comments;
        }
      })
      .addCase(fetchIssueComments.rejected, (state, action) => {
        state.commentStatus = "failed";
        state.commentError =
          (action.payload as any)?.message || action.error.message || null;
      })

      /* -------- UPDATE COMMENT -------- */
      .addCase(updateIssueComment.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(updateIssueComment.fulfilled, (state, action) => {
        state.commentStatus = "succeeded";
        const { issueId, comment } = action.payload;
        if (
          state.selectedIssue?.id === issueId &&
          state.selectedIssue.comments
        ) {
          const idx = state.selectedIssue.comments.findIndex(
            (c) => c.id === comment.id,
          );
          if (idx !== -1) {
            state.selectedIssue.comments[idx] = {
              ...state.selectedIssue.comments[idx],
              ...comment,
            };
          }
        }
      })
      .addCase(updateIssueComment.rejected, (state, action) => {
        state.commentStatus = "failed";
        state.commentError =
          (action.payload as any)?.message || action.error.message || null;
      })

      /* -------- DELETE COMMENT -------- */
      .addCase(deleteIssueComment.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(deleteIssueComment.fulfilled, (state, action) => {
        state.commentStatus = "succeeded";
        const { issueId, commentId } = action.payload;
        if (
          state.selectedIssue?.id === issueId &&
          state.selectedIssue.comments
        ) {
          state.selectedIssue.comments = state.selectedIssue.comments.filter(
            (c) => c.id !== commentId,
          );
        }
      })
      .addCase(deleteIssueComment.rejected, (state, action) => {
        state.commentStatus = "failed";
        state.commentError =
          (action.payload as any)?.message || action.error.message || null;
      });
  },
});

export const { clearSelectedIssue } = issueSlice.actions;
export default issueSlice.reducer;
