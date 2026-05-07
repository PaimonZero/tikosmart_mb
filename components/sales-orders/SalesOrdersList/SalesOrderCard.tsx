import { SalesOrder } from "@/store/salesOrdersSlice";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SalesOrderCardProps {
    order: SalesOrder;
    onPress: (order: SalesOrder) => void;
}

export const SalesOrderCard = ({ order, onPress }: SalesOrderCardProps) => {
    // Status mapping
    //'draft','pending_preparation','assigned_preparation',
    //'prepared','confirmed','delivering','delivered','completed','cancelled'
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "draft":
                return { label: "Đơn nháp", badgeClass: "bg-gray-100", textClass: "text-gray-600", borderColor: "#9CA3AF" };
            case "pending_preparation":
                return { label: "Chờ chuẩn bị", badgeClass: "bg-amber-100", textClass: "text-amber-700", borderColor: "#F59E0B" };
            case "assigned_preparation":
                return { label: "Đang chuẩn bị", badgeClass: "bg-blue-100", textClass: "text-blue-700", borderColor: "#3B82F6" };
            case "prepared":
                return { label: "Đã chuẩn bị", badgeClass: "bg-teal-100", textClass: "text-teal-700", borderColor: "#14B8A6" };
            case "confirmed":
                return { label: "Đã xác nhận", badgeClass: "bg-indigo-100", textClass: "text-indigo-700", borderColor: "#6366F1" };
            case "delivering":
                return { label: "Đang giao", badgeClass: "bg-purple-100", textClass: "text-purple-700", borderColor: "#8B5CF6" };
            case "delivered":
                return { label: "Đã giao", badgeClass: "bg-green-100", textClass: "text-green-700", borderColor: "#22C55E" };
            case "completed":
                return { label: "Hoàn thành", badgeClass: "bg-emerald-100", textClass: "text-emerald-700", borderColor: "#10B981" };
            case "cancelled":
                return { label: "Đã hủy", badgeClass: "bg-red-100", textClass: "text-red-600", borderColor: "#EF4444" };
            default:
                return { label: status, badgeClass: "bg-gray-100", textClass: "text-gray-800", borderColor: "#D1D5DB" };
        }
    };

    const statusConfig = getStatusConfig(order.status);

    return (
        <TouchableOpacity
            onPress={() => onPress(order)}
            activeOpacity={0.75}
            style={{
                backgroundColor: "#fff",
                marginHorizontal: 12,
                marginVertical: 6,
                borderRadius: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
                borderLeftWidth: 4,
                borderLeftColor: statusConfig.borderColor,
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "#F3F4F6",
                borderRightColor: "#F3F4F6",
                borderBottomColor: "#F3F4F6",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <View className="flex-row justify-between items-center px-4 pt-3 pb-2">
                <Text className="font-bold text-blue-600 text-base">
                    {order.orderNo || order.id?.substring(order.id.length - 8).toUpperCase() || "DH000000"}
                </Text>
                <View className={`px-3 py-1 rounded-full ${statusConfig.badgeClass}`}>
                    <Text className={`text-xs font-semibold ${statusConfig.textClass}`}>
                        {statusConfig.label}
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View className="mx-4 border-b border-gray-100" />

            {/* Body */}
            <View className="px-4 pt-3 pb-2 space-y-2">
                {/* Customer */}
                <View className="flex-row items-center mb-1">
                    <Ionicons name="person-circle-outline" size={18} color="#4B5563" />
                    <Text className="text-sm text-gray-800 font-semibold ml-2 flex-1 flex-wrap flex-shrink" numberOfLines={2}>
                        {order.customerName || "Khách hàng"}
                    </Text>
                </View>

                {/* Branch + Time */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-4">
                        <Ionicons name="storefront-outline" size={15} color="#9CA3AF" />
                        <Text className="text-xs text-gray-500 ml-1 flex-1" numberOfLines={1}>
                            NB: {order.sellerName || order.branchName || "—"}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={15} color="#9CA3AF" />
                        <Text className="text-xs text-gray-400 ml-1">
                            {order.createdAt ? dayjs(order.createdAt).format("HH:mm DD/MM/YYYY") : "—"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-between mx-4 pt-2 pb-3 border-t border-gray-100">
                <Text className="text-sm text-gray-500">
                    <Text className="font-bold text-gray-700">
                        {order.items?.length || order.totalItems || 0}
                    </Text>{" "}
                    mặt hàng
                </Text>
                <View className="flex-row items-center">
                    <Text className="text-sm font-semibold text-blue-600 mr-0.5">Xem chi tiết</Text>
                    <Ionicons name="chevron-forward" size={16} color="#2563EB" />
                </View>
            </View>
        </TouchableOpacity>
    );
};
