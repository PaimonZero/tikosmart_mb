import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SalesOrderHistoryRowProps {
    orderId: string;
}

export const SalesOrderHistoryRow = ({ orderId }: SalesOrderHistoryRowProps) => {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push({ pathname: "/(shared)/sales-orders/[id]/history", params: { id: orderId } } as any)}
            className="mx-4 mt-4 bg-white rounded-2xl px-4 py-4 flex-row items-center justify-between"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
            activeOpacity={0.75}
        >
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Ionicons name="time" size={20} color="#2563EB" />
                </View>
                <Text className="text-gray-800 font-semibold text-base">Xem lịch sử đơn hàng</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );
};
