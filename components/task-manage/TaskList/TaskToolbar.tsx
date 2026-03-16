import { Search } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const STATUS_OPTIONS = [
    { label: 'Tất cả', value: '' },
    { label: 'Đã phân công', value: 'assigned' },
    { label: 'Đang lấy hàng', value: 'in_progress' },
    { label: 'Chờ duyệt', value: 'pending_review' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Đã huỷ', value: 'cancelled' },
];

interface TaskToolbarProps {
    searchText: string;
    handleSearch: (text: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
}

export default function TaskToolbar({ searchText, handleSearch, statusFilter, setStatusFilter }: TaskToolbarProps) {
    return (
        <View className="px-4 py-3 bg-white border-b border-gray-200 shadow-sm z-10 relative">
            {/* Search Input */}
            <View className="flex-row items-center bg-white rounded-xl px-3 py-3 mb-3 border border-gray-200">
                <Search size={20} color="#135BEC" />
                <TextInput
                    className="flex-1 ml-2 text-base text-gray-900 p-0"
                    placeholder="Tìm kiếm mã đơn, giám sát..."
                    placeholderTextColor="#9CA3AF"
                    value={searchText}
                    onChangeText={handleSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            {/* Status Filter Horizontal Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {STATUS_OPTIONS.map((option) => {
                    const isSelected = statusFilter === option.value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => setStatusFilter(option.value)}
                            activeOpacity={0.7}
                            className={`mr-2 px-4 py-1.5 rounded-full border ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                        >
                            <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
