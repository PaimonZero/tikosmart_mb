import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Text, View } from "react-native";

interface SalesOrderOrderInfoProps {
    sellerName?: string;
    departmentName?: string;
    slaDeliveryAt?: string;
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
        <View className="flex-row items-center">
            {icon}
            <Text className="text-gray-500 ml-2 text-sm">{label}</Text>
        </View>
        <Text className="text-gray-800 font-semibold text-sm">{value}</Text>
    </View>
);

export const SalesOrderOrderInfo = ({ sellerName, departmentName, slaDeliveryAt }: SalesOrderOrderInfoProps) => {
    const slaFormatted = slaDeliveryAt ? dayjs(slaDeliveryAt).format("HH:mm DD/MM/YYYY") : "—";

    return (
        <View className="mx-4 mt-4">
            <Text className="text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">Thông tin đơn hàng</Text>
            <View className="bg-white rounded-2xl px-4"
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
            >
                <InfoRow
                    icon={<Ionicons name="storefront-outline" size={18} color="#6B7280" />}
                    label="Người bán"
                    value={sellerName || "—"}
                />
                <InfoRow
                    icon={<Ionicons name="business-outline" size={18} color="#6B7280" />}
                    label="Kho xuất"
                    value={departmentName || "—"}
                />
                <View className="flex-row items-center justify-between py-3">
                    <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={18} color="#6B7280" />
                        <Text className="text-gray-500 ml-2 text-sm">SLA giao hàng</Text>
                    </View>
                    <Text className="text-gray-800 font-semibold text-sm">{slaFormatted}</Text>
                </View>
            </View>
        </View>
    );
};
