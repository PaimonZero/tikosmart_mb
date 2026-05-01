import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

interface SalesOrderCustomerCardProps {
    customerName?: string;
    phone?: string;
    address?: string;
}

export const SalesOrderCustomerCard = ({ customerName, phone, address }: SalesOrderCustomerCardProps) => {
    const handleCall = () => {
        if (phone) Linking.openURL(`tel:${phone}`);
    };

    return (
        <View className="bg-white mx-4 mt-4 rounded-2xl overflow-hidden"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
        >
            {/* Customer name */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Ionicons name="person" size={20} color="#2563EB" />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base flex-shrink flex-wrap">{customerName || "—"}</Text>
                    <Text className="text-gray-400 text-xs">Khách hàng</Text>
                </View>
            </View>

            {/* Phone */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                        <Ionicons name="call" size={18} color="#2563EB" />
                    </View>
                    <View>
                        <Text className="text-gray-800 font-semibold">{phone || "—"}</Text>
                        <Text className="text-gray-400 text-xs">Số điện thoại</Text>
                    </View>
                </View>
                {phone && (
                    <TouchableOpacity onPress={handleCall}
                        className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl"
                    >
                        <Text className="text-blue-600 font-semibold text-sm">Gọi điện</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Address */}
            <View className="flex-row items-center justify-between px-4 py-3">
                <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                        <Ionicons name="location" size={18} color="#2563EB" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-800 font-semibold leading-snug" numberOfLines={2}>{address || "Chưa có địa chỉ"}</Text>
                        <Text className="text-gray-400 text-xs">Địa chỉ giao hàng</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="navigate" size={22} color="#2563EB" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
