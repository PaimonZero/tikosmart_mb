import apiClient from "./apiClient";

export interface IssueParams {
  q?: string;
  status?: string;
  severity?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface CreateIssueData {
  isPublic?: boolean;
  type: string;
  severity: string;
  description: string;
  mediaUrl?: string;
  tags?: string[];
  [key: string]: any;
}

export interface UpdateIssueData {
  isPublic?: boolean;
  type?: string;
  severity?: string;
  status?: string;
  description?: string;
  mediaUrl?: string;
  [key: string]: any;
}

export interface IssueCommentData {
  content: string;
  mediaUrl?: string;
  [key: string]: any;
}

export interface IssueTagData {
  userId: string;
}

/* ============================================================
   🔹 MAIN CRUD OPERATIONS
   ============================================================ */

/**
 * Lấy danh sách issues với filter & phân trang
 * @route GET /api/issues
 * @query q?, status?, severity?, type?, limit?, offset?
 */
export const listIssues = (params: IssueParams = {}) => {
  return apiClient.get("/issues", { params });
};

/**
 * Lấy chi tiết 1 issue (kèm comments & tags)
 * @route GET /api/issues/:id
 */
export const getIssueById = (id: string) => {
  return apiClient.get(`/issues/${id}`);
};

/**
 * Tạo issue mới
 * @route POST /api/issues
 * @body { isPublic, type, severity, description, mediaUrl?, tags? }
 */
export const createIssue = (data: CreateIssueData) => {
  return apiClient.post("/issues", data);
};

/**
 * Cập nhật issue
 * @route PUT /api/issues/:id
 * @body { isPublic?, type?, severity?, status?, description?, mediaUrl? }
 */
export const updateIssue = (id: string, data: UpdateIssueData) => {
  return apiClient.put(`/issues/${id}`, data);
};

/**
 * Cập nhật trạng thái issue
 * @route PATCH /api/issues/:id/status
 * @body { status }
 */
export const updateIssueStatus = (id: string, status: string) => {
  return apiClient.patch(`/issues/${id}/status`, { status });
};

/**
 * Xóa issue
 * @route DELETE /api/issues/:id
 */
export const deleteIssue = (id: string) => {
  return apiClient.delete(`/issues/${id}`);
};

/* ============================================================
   🔹 COMMENT & TAG OPERATIONS
   ============================================================ */

/**
 * Thêm comment vào issue
 * @route POST /api/issues/:id/comments
 * @body { content, mediaUrl? }
 */
export const addIssueComment = (issueId: string, data: IssueCommentData) => {
  return apiClient.post(`/issues/${issueId}/comments`, data);
};

/**
 * Thêm tag người dùng vào issue
 * @route POST /api/issues/:id/tags
 * @body { userId }
 */
export const addIssueTag = (issueId: string, data: IssueTagData) => {
  return apiClient.post(`/issues/${issueId}/tags`, data);
};

/* ============================================================
   💬 COMMENT CRUD OPERATIONS
   ============================================================ */

/**
 * Lấy danh sách comment của 1 issue
 * @route GET /api/issues/:issueId/comments
 */
export const listIssueComments = (issueId: string) => {
  return apiClient.get(`/issues/${issueId}/comments`);
};

/**
 * Lấy chi tiết 1 comment
 * @route GET /api/issues/:issueId/comments/:commentId
 */
export const getIssueCommentById = (issueId: string, commentId: string) => {
  return apiClient.get(`/issues/${issueId}/comments/${commentId}`);
};

/**
 * Cập nhật comment
 * @route PUT /api/issues/:issueId/comments/:commentId
 * @body { content?, mediaUrl? }
 */
export const updateIssueComment = (
  issueId: string,
  commentId: string,
  data: IssueCommentData,
) => {
  return apiClient.put(`/issues/${issueId}/comments/${commentId}`, data);
};

/**
 * Xóa comment
 * @route DELETE /api/issues/:issueId/comments/:commentId
 */
export const deleteIssueComment = (issueId: string, commentId: string) => {
  return apiClient.delete(`/issues/${issueId}/comments/${commentId}`);
};
