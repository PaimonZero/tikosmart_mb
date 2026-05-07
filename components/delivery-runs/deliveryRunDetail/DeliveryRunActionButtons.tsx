import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

interface DeliveryRunActionButtonsProps {
    status: string;
    isAllOrdersProcessed: boolean;
    isAdminOrSup: boolean;
    isShipper: boolean;
    onStart: () => void;
    onComplete: () => void;
    onCancel: () => void;
}

export const DeliveryRunActionButtons = ({
    status,
    isAllOrdersProcessed,
    isAdminOrSup,
    isShipper,
    onStart,
    onComplete,
    onCancel
}: DeliveryRunActionButtonsProps) => {
    return (
        <View className="mb-4 mt-4">
            {/* Start Trip Button for Assigned status */}
            {status === 'assigned' && (isShipper || isAdminOrSup) && (
                <TouchableOpacity
                    onPress={onStart}
                    className="bg-blue-600 p-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-blue-200 mb-4"
                >
                    <Ionicons name="play" size={20} color="#fff" />
                    <Text className="text-white font-black text-base ml-2">Bắt đầu chuyến đi</Text>
                </TouchableOpacity>
            )}

            {/* In Progress Status Indicator & Complete Button */}
            {status === 'in_progress' && (
                <View className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4 items-center">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                        <Text className="text-blue-700 text-xs font-bold uppercase tracking-wider">Chuyến đi đang diễn ra</Text>
                    </View>
                    
                    {/* Complete Trip Button */}
                    {isAllOrdersProcessed && (
                        <TouchableOpacity
                            onPress={onComplete}
                            className="w-full bg-green-600 p-4 rounded-xl flex-row items-center justify-center shadow-lg shadow-green-100"
                        >
                            <Ionicons name="checkmark-done" size={20} color="#fff" />
                            <Text className="text-white font-black text-base ml-2">Kết thúc chuyến đi</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Admin/Supervisor Cancel Button */}
            {isAdminOrSup && (status === 'assigned' || status === 'in_progress') && (
                <TouchableOpacity
                    onPress={onCancel}
                    className="p-3 mb-2 rounded-xl border border-red-100 items-center justify-center"
                >
                    <Text className="text-red-500 font-bold text-xs">Hủy chuyến giao hàng</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
