export const getStatusStyles = (status: string) => {
    switch (status) {
        case "assigned":
            return {
                bg: "bg-gray-100",
                text: "text-gray-600",
                dot: "bg-gray-500",
                border: "border-gray-500",
                label: "Đã phân công",
            };
        case "in_progress":
            return {
                bg: "bg-blue-50",
                text: "text-blue-600",
                dot: "bg-blue-500",
                border: "border-blue-500",
                label: "Đang giao",
            };
        case "completed":
            return {
                bg: "bg-green-50",
                text: "text-green-600",
                dot: "bg-green-500",
                border: "border-green-500",
                label: "Hoàn thành",
            };
        case "cancelled":
            return {
                bg: "bg-red-50",
                text: "text-red-600",
                dot: "bg-red-500",
                border: "border-red-500",
                label: "Đã hủy",
            };
        default:
            return {
                bg: "bg-gray-50",
                text: "text-gray-500",
                dot: "bg-gray-400",
                border: "border-gray-400",
                label: status,
            };
    }
};