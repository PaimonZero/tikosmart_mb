import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface InventoryLotsEmptyStateProps {
    type: 'loading' | 'error' | 'search-empty' | 'empty';
    errorMessage?: string;
    onRetry?: () => void;
}

export const InventoryLotsEmptyState: React.FC<InventoryLotsEmptyStateProps> = ({
    type,
    errorMessage,
    onRetry,
}) => {
    if (type === 'loading') {
        return (
            <View className="items-center justify-center py-12">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="text-sm text-gray-500 mt-3">Đang tải...</Text>
            </View>
        );
    }

    if (type === 'error') {
        return (
            <View className="items-center justify-center py-12 px-5">
                <Feather name="alert-circle" size={48} color="#EF4444" />
                <Text className="text-base text-red-600 mt-4 text-center font-semibold">
                    Không thể tải danh sách lô hàng
                </Text>
                <Text className="text-sm text-gray-500 mt-2 text-center">
                    {errorMessage || 'Vui lòng thử lại sau'}
                </Text>
                {onRetry && (
                    <TouchableOpacity
                        onPress={onRetry}
                        className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
                    >
                        <Text className="text-white font-semibold">Thử lại</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    if (type === 'search-empty') {
        return (
            <View className="items-center justify-center py-12 px-5">
                <Feather name="search" size={48} color="#9CA3AF" />
                <Text className="text-base text-gray-700 mt-4 font-semibold">
                    Không tìm thấy kết quả
                </Text>
                <Text className="text-sm text-gray-500 mt-2 text-center">
                    Thử tìm kiếm với từ khóa khác
                </Text>
            </View>
        );
    }

    // type === 'empty'
    return (
        <View className="items-center justify-center py-12 px-5">
            <Feather name="inbox" size={48} color="#9CA3AF" />
            <Text className="text-base text-gray-700 mt-4 font-semibold">
                Chưa có lô hàng nào
            </Text>
            <Text className="text-sm text-gray-500 mt-2 text-center">
                Sản phẩm này chưa có lô hàng trong kho
            </Text>
        </View>
    );
};
