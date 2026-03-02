import { SalesOrder } from "@/store/salesOrdersSlice";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Text, View } from "react-native";

interface SalesOrderInfoSectionProps {
    order: SalesOrder;
}

export const SalesOrderInfoSection = ({ order }: SalesOrderInfoSectionProps) => {
    // Status mapping
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "pending":
                return { label: "Chờ xác nhận", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" };
            case "processing":
                return { label: "Đang xử lý", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" };
            case "delivering":
                return { label: "Đang giao", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" };
            case "delivered":
                return { label: "Đã giao", color: "text-green-600", bg: "bg-green-50 border-green-200" };
            case "cancelled":
                return { label: "Đã hủy", color: "text-red-600", bg: "bg-red-50 border-red-200" };
            default:
                return { label: status, color: "text-gray-600", bg: "bg-gray-50 border-gray-200" };
        }
    };

    const statusConfig = getStatusConfig(order.status || "");

    return (
        <View className="bg-white p-4 mb-2">
            {/* Trạng thái đơn hàng */}
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 border ${statusConfig.bg}`}>
                        <Ionicons name="cube-outline" size={20} className={statusConfig.color} />
                    </View>
                    <View>
                        <Text className="text-gray-500 text-xs mb-0.5">Trạng thái</Text>
                        <Text className={`font-bold text-base ${statusConfig.color}`}>
                            {statusConfig.label}
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-gray-500 text-xs mb-0.5">Ngày tạo</Text>
                    <Text className="text-gray-800 font-medium">
                        {order.createdAt ? dayjs(order.createdAt).format("DD/MM/YYYY HH:mm") : "--"}
                    </Text>
                </View>
            </View>

            {/* Thông tin giao hàng */}
            <Text className="font-bold text-gray-800 text-base mb-3 flex-row items-center">
                <Ionicons name="location" size={18} color="#EF4444" /> Thông tin nhận hàng
            </Text>

            <View className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <View className="flex-row items-start mb-2">
                    <Ionicons name="person-circle-outline" size={20} color="#6B7280" className="mt-0.5 mr-2" />
                    <View className="flex-1">
                        <Text className="text-gray-500 text-xs">Khách hàng</Text>
                        <Text className="text-gray-800 font-medium mt-0.5">
                            {order.customer?.name || order.customerId || "N/A"}
                        </Text>
                    </View>
                </View>

                {order.customer?.phone && (
                    <View className="flex-row items-start mb-2">
                        <Ionicons name="call-outline" size={20} color="#6B7280" className="mt-0.5 mr-2" />
                        <View className="flex-1">
                            <Text className="text-gray-500 text-xs">Số điện thoại</Text>
                            <Text className="text-gray-800 font-medium mt-0.5">{order.customer.phone}</Text>
                        </View>
                    </View>
                )}

                <View className="flex-row items-start">
                    <Ionicons name="map-outline" size={20} color="#6B7280" className="mt-0.5 mr-2" />
                    <View className="flex-1">
                        <Text className="text-gray-500 text-xs">Địa chỉ giao hàng</Text>
                        <Text className="text-gray-800 font-medium mt-0.5 leading-5">
                            {order.address || "Chưa cung cấp địa chỉ"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Người phụ trách */}
            {order.seller && (
                <View className="flex-row items-center mt-4">
                    <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2 border border-blue-200">
                        <Ionicons name="headset-outline" size={16} color="#2563EB" />
                    </View>
                    <View>
                        <Text className="text-gray-500 text-xs">Nhân viên phụ trách</Text>
                        <Text className="text-gray-800 font-medium text-sm">{order.seller.username || order.seller.id}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};
