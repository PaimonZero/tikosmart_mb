import apiClient from "./apiClient";

export interface NotificationParams {
  status?: "read" | "unread";
  limit?: number;
  offset?: number;
}

export interface CreateNotificationData {
  [key: string]: any;
}

/** Lấy danh sách notifications của user hiện tại */
export const getNotifications = (params: NotificationParams = {}) => {
  return apiClient.get("/notifications", { params });
};

// Đánh dấu notification là đã đọc
export const markNotificationAsRead = (notificationId: string) => {
  return apiClient.put(`/notifications/${notificationId}/read`);
};

// Đánh dấu tất cả notifications là đã đọc
export const markAllNotificationsAsRead = () => {
  return apiClient.put("/notifications/read-all");
};

// Xóa notification
export const deleteNotification = (notificationId: string) => {
  return apiClient.delete(`/notifications/${notificationId}`);
};

// Tạo notification mới
export const createNotification = (
  notificationData: CreateNotificationData,
) => {
  return apiClient.post("/notifications", notificationData);
};
