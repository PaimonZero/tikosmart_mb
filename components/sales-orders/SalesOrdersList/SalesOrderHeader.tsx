import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SalesOrderHeaderProps {
    title?: string;
    onAddPress?: () => void;
}

export const SalesOrderHeader = ({
    title = "Danh sách đơn hàng",
    onAddPress,
}: SalesOrderHeaderProps) => {
    return (
        <View
            className="px-4 pt-3 pb-4 bg-gray-100 flex-row items-center justify-between"
        >
            {/* Left: icon + title */}
            <View className="flex-row items-center gap-2 flex-1">
                <View className="bg-blue-100 rounded-xl p-2">
                    <Ionicons name="receipt-outline" size={20} color="#2563EB" />
                </View>
                <View>
                    <Text className="text-gray-400 text-sm font-medium">Quản lý</Text>
                    <Text className="text-gray-800 text-lg font-bold leading-tight">
                        {title}
                    </Text>
                </View>
            </View>

            {/* Right: Add button */}
            <TouchableOpacity
                onPress={onAddPress}
                activeOpacity={0.8}
                style={{
                    backgroundColor: "#2563EB",
                    borderRadius: 12,
                    padding: 8,
                }}
            >
                <Ionicons name="add" size={22} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};
