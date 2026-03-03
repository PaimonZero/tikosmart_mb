import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SalesOrderBottomBarProps {
    onPrint?: () => void;
    onEdit?: () => void;
}

export const SalesOrderBottomBar = ({ onPrint, onEdit }: SalesOrderBottomBarProps) => {
    return (
        <View
            className="bg-white flex-row items-center px-4 py-3 border-t border-gray-100"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 6 }}
        >
            {/* In hóa đơn */}
            <TouchableOpacity onPress={onPrint}
                className="flex-1 flex-row items-center justify-center py-3 border border-gray-200 rounded-xl mr-2"
                activeOpacity={0.7}
            >
                <Ionicons name="print-outline" size={20} color="#4B5563" />
                <Text className="text-gray-700 text-xs font-medium mt-1 ms-1">In hóa đơn</Text>
            </TouchableOpacity>

            {/* Chỉnh sửa */}
            <TouchableOpacity onPress={onEdit}
                className="flex-1 flex-row items-center justify-center py-3 bg-blue-600 rounded-xl"
                activeOpacity={0.8}
            >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text className="text-white text-xs font-bold mt-1 ms-1">Chỉnh sửa</Text>
            </TouchableOpacity>
        </View>
    );
};
