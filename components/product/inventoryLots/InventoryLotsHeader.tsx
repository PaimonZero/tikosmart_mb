import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface InventoryLotsHeaderProps {
    productName?: string;
}

export const InventoryLotsHeader: React.FC<InventoryLotsHeaderProps> = ({ productName }) => {
    const router = useRouter();

    return (
        <View className="bg-white border-b border-gray-200 px-5 py-2">
            <View className="flex-row items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3 p-2 -ml-2"
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">
                        Danh sách lô hàng
                    </Text>
                    {productName && (
                        <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                            {productName}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};
