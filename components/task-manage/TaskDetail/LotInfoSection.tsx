import React from "react";
import { Text, View } from "react-native";

interface LotInfoSectionProps {
    lot: any;
}

export default function LotInfoSection({ lot }: LotInfoSectionProps) {
    return (
        <View className="mb-4">
            <Text className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">
                Lô Hàng Xuất
            </Text>
            {lot ? (
                <View className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Text className="text-base font-bold text-gray-800">
                        Lô: {lot.lotNo || "—"}
                    </Text>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-sm font-medium text-gray-600">
                            Tồn: {lot.qtyOnHand ?? 0} {lot.packUnit || lot.mainUnit || ""}
                        </Text>
                        <Text className="text-sm font-medium text-gray-600">
                            HSD: {lot.expiryDate ? new Date(lot.expiryDate).toLocaleDateString("vi-VN") : "—"}
                        </Text>
                    </View>
                </View>
            ) : (
                <Text className="text-base text-gray-400 italic">Không có thông tin lô hàng</Text>
            )}
        </View>
    );
}
