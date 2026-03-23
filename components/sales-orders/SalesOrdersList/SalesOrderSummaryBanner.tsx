import React from "react";
import { Text, View } from "react-native";

interface SalesOrderSummaryBannerProps {
    total: number;
}

export const SalesOrderSummaryBanner = ({ total }: SalesOrderSummaryBannerProps) => {
    return (
        <View className="flex-row justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
            <Text className="text-blue-600 font-medium text-sm">Tổng quan hôm nay</Text>
            <Text className="text-blue-600 font-bold text-sm">
                {total} đơn hàng
            </Text>
        </View>
    );
};
