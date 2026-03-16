import { useRouter } from 'expo-router';
import { ArrowLeft, ClipboardList, Search } from 'lucide-react-native';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AddTaskHeaderProps {
    keyword: string;
    setKeyword: (text: string) => void;
}

export default function AddTaskHeader({ keyword, setKeyword }: AddTaskHeaderProps) {
    const router = useRouter();

    return (
        <View className="bg-white border-b border-gray-100 shadow-sm">
            {/* Top row: Back + Title + Icon */}
            <View className="flex-row items-center px-4 pt-3 pb-2 border-b border-gray-200">
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
                        Chọn đơn hàng
                    </Text>
                    <Text className="text-xs text-gray-400 mt-0.5">
                        Chọn đơn cần chuẩn bị để tạo nhiệm vụ
                    </Text>
                </View>

                {/* Icon badge */}
                <View className="bg-blue-50 border border-blue-100 p-2 rounded-xl">
                    <ClipboardList size={22} color="#2563EB" />
                </View>
            </View>

            {/* Search bar */}
            <View className="px-4 pb-3 mt-2">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-3 border border-gray-200">
                    <Search size={15} color="#135BEC" />
                    <TextInput
                        value={keyword}
                        onChangeText={setKeyword}
                        placeholder="Tìm mã đơn, tên khách hàng..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 ml-2 text-sm text-gray-800"
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                </View>
            </View>
        </View>
    );
}
