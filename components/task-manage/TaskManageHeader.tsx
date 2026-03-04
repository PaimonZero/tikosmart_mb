import { Package } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

export default function TaskManageHeader() {
    return (
        <View className="px-4 py-4 bg-white border-b border-gray-100 flex-row items-center justify-between shadow-sm">
            <View className="flex-row items-center">
                <View className="bg-blue-100 p-2 rounded-xl mr-3">
                    <Package size={24} color="#2563EB" />
                </View>
                <View>
                    <Text className="text-xl font-bold text-gray-900">Soạn hàng</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">Danh sách nhiệm vụ lấy hàng</Text>
                </View>
            </View>
        </View>
    );
}
