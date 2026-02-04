import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Text, View } from 'react-native';
import { ExpandableSearchBar } from './ExpandableSearchBar';

interface ProductHeaderProps {
    activeProducts?: number;
    warningProducts?: number;
    disabledProducts?: number;
    // Search props
    keyword: string;
    onSearchChange: (text: string) => void;
    onSearchSubmit: () => void;
    onSearchClear: () => void;
    isSearchExpanded: boolean;
    onSearchExpandChange: (expanded: boolean) => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
    activeProducts = 0,
    warningProducts = 0,
    disabledProducts = 0,
    keyword,
    onSearchChange,
    onSearchSubmit,
    onSearchClear,
    isSearchExpanded,
    onSearchExpandChange,
}) => {
    return (
        <View className="bg-white px-6 pt-2 pb-5 border-b border-gray-100">
            {/* Title Section with Search */}
            <View className="mb-4">
                <View className="flex-row items-center justify-between mb-1">
                    {!isSearchExpanded && (
                        <View className="flex-row items-center flex-1">
                            <Feather name="package" size={26} color="#1f2937" />
                            <Text className="text-gray-900 text-2xl font-bold ml-2.5">
                                Quản lý sản phẩm
                            </Text>
                        </View>
                    )}
                    <View className={isSearchExpanded ? "flex-1" : ""}>
                        <ExpandableSearchBar
                            keyword={keyword}
                            onChangeText={onSearchChange}
                            onSubmit={onSearchSubmit}
                            onClear={onSearchClear}
                            onExpandChange={onSearchExpandChange}
                        />
                    </View>
                </View>
                {!isSearchExpanded && (
                    <Text className="text-gray-500 text-sm ml-9">
                        Theo dõi và quản lý sản phẩm của bạn
                    </Text>
                )}
            </View>

            {/* Stats Cards */}
            <View className="flex-row justify-between gap-3">
                {/* Active Products */}
                <View className="flex-1 bg-green-50 rounded-xl p-3.5 border border-green-100">
                    <View className="flex-row items-center mb-1.5">
                        <View className="bg-green-500 rounded-lg p-1.5">
                            <MaterialCommunityIcons name="check-circle" size={18} color="white" />
                        </View>
                    </View>
                    <Text className="text-green-900 text-xl font-bold">
                        {activeProducts}
                    </Text>
                    <Text className="text-green-600 text-xs font-medium mt-0.5">Đang bán</Text>
                </View>

                {/* Warning Products */}
                <View className="flex-1 bg-amber-50 rounded-xl p-3.5 border border-amber-100">
                    <View className="flex-row items-center mb-1.5">
                        <View className="bg-amber-500 rounded-lg p-1.5">
                            <MaterialCommunityIcons name="alert-circle" size={18} color="white" />
                        </View>
                    </View>
                    <Text className="text-amber-900 text-xl font-bold">
                        {warningProducts}
                    </Text>
                    <Text className="text-amber-600 text-xs font-medium mt-0.5">Cảnh báo</Text>
                </View>

                {/* Disabled Products */}
                <View className="flex-1 bg-red-50 rounded-xl p-3.5 border border-red-100">
                    <View className="flex-row items-center mb-1.5">
                        <View className="bg-red-500 rounded-lg p-1.5">
                            <MaterialCommunityIcons name="lock" size={18} color="white" />
                        </View>
                    </View>
                    <Text className="text-red-900 text-xl font-bold">
                        {disabledProducts}
                    </Text>
                    <Text className="text-red-600 text-xs font-medium mt-0.5">Ngừng bán</Text>
                </View>
            </View>
        </View>
    );
};
