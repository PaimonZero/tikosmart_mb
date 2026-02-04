import { IconSymbol } from "@/components/ui/icon-symbol";
import { Product } from "@/store/productSlice";
import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";

interface ProductCardProps {
    product: Product;
    onPress: (product: Product) => void;
}

export const ProductCard = React.memo(({ product, onPress }: ProductCardProps) => {
    const statusColor = product.status === 'active' ? 'text-green-600' : product.status === 'warning' ? 'text-orange-500' : 'text-red-500';
    const statusBg = product.status === 'active' ? 'bg-green-50' : product.status === 'warning' ? 'bg-orange-50' : 'bg-red-50';
    const statusText = product.status === 'active' ? 'Hoạt động' : product.status === 'warning' ? 'Cảnh báo' : 'Ngừng KD';

    return (
        <TouchableOpacity
            className="bg-white rounded-2xl mb-3 shadow-sm border border-gray-100 overflow-hidden flex-row items-center p-3"
            onPress={() => onPress(product)}
            activeOpacity={0.7}
        >
            <View className="w-20 h-20 bg-gray-50 rounded-xl mr-3 overflow-hidden border border-gray-100 items-center justify-center">
                <Image
                    source={{ uri: product.imgUrl || 'https://via.placeholder.com/150' }}
                    className="w-full h-full object-cover"
                    resizeMode="cover"
                />
            </View>

            <View className="flex-1 justify-between h-20 py-0.5">
                <View>
                    <View className="flex-row justify-between items-center mb-1">
                        <View className="bg-gray-100 px-2 py-0.5 rounded-md self-start">
                            <Text className="text-[10px] text-gray-500 font-medium" numberOfLines={1}>
                                {product.categoryName}
                            </Text>
                        </View>
                        {product.adminLocked && (
                            <IconSymbol name="lock.fill" size={12} color="#EF4444" />
                        )}
                    </View>

                    <Text className="font-bold text-gray-900 text-base leading-5 mb-1" numberOfLines={2}>
                        {product.name}
                    </Text>
                </View>

                <View className="flex-row justify-between items-end">
                    <View className={`px-2 py-1 rounded-full ${statusBg} flex-row items-center`}>
                        <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${product.status === 'active' ? 'bg-green-500' : product.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'}`} />
                        <Text className={`text-[10px] font-medium ${statusColor}`}>
                            {statusText}
                        </Text>
                    </View>
                    <View className="flex-row items-center space-x-2">
                        <Text className="text-xs text-gray-400 font-medium">
                            {product.skuCode}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Edit Action Area - Visual only for now, can be functional */}
            <View className="ml-2 pl-2 border-l border-gray-100 justify-center h-12">
                <IconSymbol name="pencil" size={18} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );
});
