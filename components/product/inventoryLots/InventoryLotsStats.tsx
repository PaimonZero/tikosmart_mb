import React from 'react';
import { Text, View } from 'react-native';

interface InventoryLotsStatsProps {
    totalQtyOnHand: number;
    totalLots: number;
    mainUnit: string;
    searchQuery: string;
    filteredCount: number;
}

export const InventoryLotsStats: React.FC<InventoryLotsStatsProps> = ({
    totalQtyOnHand,
    totalLots,
    mainUnit,
    searchQuery,
    filteredCount,
}) => {
    return (
        <View className="bg-white px-5 py-3">
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-xs text-blue-600 mb-1">TỔNG TỒN KHO</Text>
                        <View className="flex-row items-baseline">
                            <Text className="text-2xl font-bold text-blue-900 mr-1">
                                {totalQtyOnHand.toLocaleString('vi-VN')}
                            </Text>
                            <Text className="text-sm text-blue-700">{mainUnit}</Text>
                        </View>
                    </View>
                    <View className="items-end">
                        <Text className="text-xs text-blue-600 mb-1">SỐ LÔ HÀNG</Text>
                        <Text className="text-2xl font-bold text-blue-900">{totalLots}</Text>
                    </View>
                </View>
            </View>

            {searchQuery && (
                <Text className="text-sm text-gray-600 mt-3">
                    Tìm thấy {filteredCount} kết quả
                </Text>
            )}
        </View>
    );
};
