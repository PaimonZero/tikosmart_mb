import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface EmptyOrderListProps {
    onRefresh: () => void;
}

export default function EmptyOrderList({ onRefresh }: EmptyOrderListProps) {
    return (
        <View className="items-center justify-center py-24">
            <Text className="text-4xl mb-3">📦</Text>
            <Text className="text-base font-semibold text-gray-500">Không có đơn hàng</Text>
            <Text className="text-sm text-gray-400 mt-1 text-center px-8">
                Không tìm thấy đơn hàng cần chuẩn bị
            </Text>
            <TouchableOpacity
                onPress={onRefresh}
                className="mt-4 px-5 py-2 bg-blue-600 rounded-lg"
            >
                <Text className="text-white text-sm font-semibold">Thử lại</Text>
            </TouchableOpacity>
        </View>
    );
}
