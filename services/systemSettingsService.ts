import apiClient from "./apiClient";

export interface SystemSetting {
  setting_key: string;
  setting_value: string;
  updated_at?: string;
}

/**
 * Lấy toàn bộ cấu hình hệ thống
 */
export const getSystemSettings = async () => {
  return apiClient.get("/system-settings");
};
