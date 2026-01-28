// Type definitions for User Management components

export interface User {
  id: string;
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  role: string;
  status?: string;
  avatar?: string;
  online?: boolean;
}

export interface RoleOption {
  value: string;
  label: string;
  color: string;
}

export interface StatusOption {
  value: string;
  label: string;
  color: string;
}

export interface UserFilters {
  roles: string[];
  status: string | null;
  onlineStatus: "all" | "online" | "offline";
}

export interface UserFormData {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  password: string;
  warehouseId?: string; // Cơ sở/Kho
}

export const ROLE_OPTIONS: RoleOption[] = [
  { value: "admin", label: "Quản trị viên", color: "#EF4444" },
  { value: "manager", label: "Quản lý", color: "#3B82F6" },
  { value: "accountant", label: "Kế toán", color: "#8B5CF6" },
  { value: "picker", label: "Nhân viên lấy hàng", color: "#10B981" },
  { value: "sup_picker", label: "Giám sát lấy hàng", color: "#06B6D4" },
  { value: "shipper", label: "Nhân viên giao hàng", color: "#F59E0B" },
  { value: "sup_shipper", label: "Giám sát giao hàng", color: "#F97316" },
  { value: "seller", label: "Nhân viên bán hàng", color: "#EC4899" },
];

export const STATUS_OPTIONS: StatusOption[] = [
  { value: "active", label: "Hoạt động", color: "#10B981" },
  { value: "disable", label: "Vô hiệu hóa", color: "#EF4444" },
];
