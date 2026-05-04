export const STATUS_MAP = {
  assigned: { color: "blue", text: "Đã phân công", icon: "ClockCircleOutlined" },
  in_progress: { color: "processing", text: "Đang giao", icon: "CarOutlined" },
  completed: { color: "success", text: "Hoàn thành", icon: "CheckCircleOutlined" },
  cancelled: { color: "error", text: "Đã hủy", icon: "CloseCircleOutlined" },
  temp_cancelled: { color: "warning", text: "Tạm hủy", icon: "ExclamationCircleOutlined" },
  book_grab: { color: "purple", text: "Book Grab", icon: "CarOutlined" },
  pending: { color: "default", text: "Chờ xử lý", icon: "ClockCircleOutlined" },
  failed: { color: "error", text: "Thất bại", icon: "ExclamationCircleOutlined" },
};

export const ORDER_STATUS_UI = {
  assigned: { label: "Đã phân công", tagColor: "geekblue", border: "#2f54eb" },
  in_progress: { label: "Đang giao", tagColor: "processing", border: "#1890ff" },
  completed: { label: "Hoàn thành", tagColor: "success", border: "#52c41a" },
  cancelled: { label: "Đã hủy", tagColor: "error", border: "#ff4d4f" },
  temp_cancelled: { label: "Tạm hủy", tagColor: "warning", border: "#faad14" },
  book_grab: { label: "Book Grab", tagColor: "purple", border: "#722ed1" },
};

export const getStatusStyles = (status: string) => {
    switch (status) {
        case "pending":
        case "assigned":
            return {
                bg: "bg-blue-50",
                text: "text-blue-600",
                dot: "bg-blue-500",
                border: "border-blue-200",
                label: status === "pending" ? STATUS_MAP.pending.text : STATUS_MAP.assigned.text,
            };
        case "in_progress":
            return {
                bg: "bg-blue-500",
                text: "text-white",
                dot: "bg-white",
                border: "border-blue-600",
                label: STATUS_MAP.in_progress.text,
            };
        case "completed":
            return {
                bg: "bg-green-50",
                text: "text-green-600",
                dot: "bg-green-500",
                border: "border-green-200",
                label: STATUS_MAP.completed.text,
            };
        case "cancelled":
        case "failed":
            return {
                bg: "bg-red-50",
                text: "text-red-600",
                dot: "bg-red-500",
                border: "border-red-200",
                label: status === "failed" ? STATUS_MAP.failed.text : STATUS_MAP.cancelled.text,
            };
        case "temp_cancelled":
            return {
                bg: "bg-orange-50",
                text: "text-orange-600",
                dot: "bg-orange-500",
                border: "border-orange-200",
                label: STATUS_MAP.temp_cancelled.text,
            };
        case "book_grab":
            return {
                bg: "bg-purple-50",
                text: "text-purple-600",
                dot: "bg-purple-500",
                border: "border-purple-200",
                label: STATUS_MAP.book_grab.text,
            };
        default:
            return {
                bg: "bg-gray-50",
                text: "text-gray-500",
                dot: "bg-gray-400",
                border: "border-gray-200",
                label: status,
            };
    }
};