import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ExpandableSearchBar } from "../product/productList/ExpandableSearchBar";

import { FilterChips } from './FilterChips';

interface DeliveryRunHeaderProps {
    totalRuns: number;
    deliveringCount: number;
    completedCount: number;
    // Search props
    keyword: string;
    onSearchChange: (text: string) => void;
    onSearchSubmit: () => void;
    onSearchClear: () => void;
    isSearchExpanded: boolean;
    onSearchExpandChange: (expanded: boolean) => void;
    // Filter and Sort props
    selectedStatus: string;
    onStatusChange: (status: string) => void;
}

const STATUS_CHIPS = [
    { label: 'Tất cả', value: '' },
    { label: 'Phân công', value: 'assigned' },
    { label: 'Đang đi', value: 'in_progress' },
    { label: 'Hoàn tất', value: 'completed' },
    { label: 'Đã hủy', value: 'cancelled' },
];

export const DeliveryRunHeader: React.FC<DeliveryRunHeaderProps> = ({
    totalRuns,
    deliveringCount,
    completedCount,
    keyword,
    selectedStatus,
    onSearchChange,
    onSearchSubmit,
    onSearchClear,
    isSearchExpanded,
    onSearchExpandChange,
    onStatusChange,
}) => {
    return (
        <View className="bg-white px-0 pt-2 pb-0 border-b border-gray-100">
            {/* Title Section with Search & Sort */}
            <View className="px-6 mb-4">
                <View className="flex-row items-center justify-between mb-2">
                    {!isSearchExpanded && (
                        <View className="flex-row items-center flex-1">
                            <View className="bg-blue-600 p-2.5 rounded-2xl mr-3 shadow-sm border border-blue-50">
                                <MaterialCommunityIcons name="truck-delivery" size={20} color="#FFFFFF" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 text-2xl font-black">
                                    Chuyến đi
                                </Text>
                                <Text className="text-gray-400 text-xs ml-0 font-medium tracking-tight">
                                    Quản lý lộ trình và giám sát
                                </Text>
                            </View>
                        </View>
                    )}
                    <View className={isSearchExpanded ? "flex-1" : "flex-row gap-2 items-center"}>
                        <ExpandableSearchBar
                            keyword={keyword}
                            onChangeText={onSearchChange}
                            onSubmit={onSearchSubmit}
                            onClear={onSearchClear}
                            onExpandChange={onSearchExpandChange}
                            placeholder="Tìm kiếm..."
                        />
                    </View>
                </View>
            </View>

            {/* Filter Chips - Horizontal Scroll */}
            <FilterChips 
                chips={STATUS_CHIPS}
                selectedValue={selectedStatus}
                onValueChange={onStatusChange}
            />

            {/* Stats Cards - Minimalist Row */}
            <View className="px-6 pb-4">
                <View className="flex-row justify-between items-center bg-gray-50 rounded-2xl p-4">
                    {/* Total */}
                    <View className="items-center flex-1 border-r border-gray-200">
                        <Text className="text-gray-900 text-xl font-black">{totalRuns}</Text>
                        <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-tighter">Tổng số</Text>
                    </View>

                    {/* Delivering */}
                    <View className="items-center flex-1 border-r border-gray-200">
                        <Text className="text-blue-600 text-xl font-black">{deliveringCount}</Text>
                        <Text className="text-blue-400 text-[9px] font-bold uppercase tracking-tighter">Đang đi</Text>
                    </View>

                    {/* Completed */}
                    <View className="items-center flex-1">
                        <Text className="text-green-600 text-xl font-black">{completedCount}</Text>
                        <Text className="text-green-400 text-[9px] font-bold uppercase tracking-tighter">Hoàn tất</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
