import { SalesOrder } from "@/store/salesOrdersSlice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SalesOrderDetailHeaderProps {
    order: SalesOrder | null;
}

export const SalesOrderDetailHeader = ({ order }: SalesOrderDetailHeaderProps) => {
    const router = useRouter();

    return (
        <View className="bg-white px-4 py-3 border-b border-gray-100 flex-row items-center justify-between shadow-sm z-10">
            <View className="flex-row items-center flex-1">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3 p-1 rounded-full active:bg-gray-100"
                >
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800" numberOfLines={1}>
                    CHI TIẾT ĐƠN HÀNG
                </Text>
            </View>
            <View className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                <Text className="text-blue-700 font-bold text-sm">
                    {order?.orderNo || (order?.id ? `MDH-${order.id.substring(order.id.length - 6).toUpperCase()}` : "...")}
                </Text>
            </View>
        </View>
    );
};
