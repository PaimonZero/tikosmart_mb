import { useRouter } from 'expo-router';
import { ArrowLeft, ClipboardCheck } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TaskFormHeaderProps {
    orderNo?: string;
}

const TaskFormHeader = ({ orderNo }: TaskFormHeaderProps) => {
    const router = useRouter();

    return (
        <View className="bg-white border-b border-gray-100 shadow-sm px-4 pt-3 pb-3">
            <View className="flex-row items-center">
                {/* Back button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center mr-3"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <ArrowLeft size={20} color="#374151" />
                </TouchableOpacity>

                {/* Title block */}
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 leading-tight">
                        Tạo nhiệm vụ
                    </Text>
                    <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
                        {orderNo ? `Đơn hàng: ${orderNo}` : 'Điền thông tin nhiệm vụ'}
                    </Text>
                </View>

                {/* Icon badge */}
                <View className="bg-green-50 border border-green-100 p-2 rounded-xl">
                    <ClipboardCheck size={22} color="#16A34A" />
                </View>
            </View>
        </View>
    );
};

export default TaskFormHeader;
