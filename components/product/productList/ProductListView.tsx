import { Product } from "@/store/productSlice";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import React from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

interface ProductListViewProps {
    products: Product[];
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchError: string | null;
    refreshing: boolean;
    activeQuery: string;
    onRefresh: () => void;
    onLoadMore: () => void;
    onProductPress: (product: Product) => void;
    onScroll?: (event: any) => void;
}

export const ProductListView: React.FC<ProductListViewProps> = ({
    products,
    fetchStatus,
    fetchError,
    refreshing,
    activeQuery,
    onRefresh,
    onLoadMore,
    onProductPress,
    onScroll,
}) => {
    const renderFooter = () => {
        if (fetchStatus === 'loading' && products.length > 0) {
            return (
                <View className="py-4">
                    <ActivityIndicator color="#007AFF" />
                </View>
            );
        }
        return <View className="h-20" />;
    };

    const renderEmpty = () => {
        if (fetchStatus === 'loading') {
            return <ProductCardSkeleton count={5} />;
        }
        if (fetchError) {
            return (
                <View className="flex-1 justify-center items-center px-6">
                    {/* icon error expo icon */}
                    <AntDesign name="exclamation-circle" size={48} color="#FF0000" />
                    <Text className="text-red-500 text-center mb-4">Đã có lỗi xảy ra: {fetchError}</Text>
                    <TouchableOpacity onPress={onRefresh} className="bg-blue-600 px-4 py-2 rounded-lg">
                        <Text className="text-white font-medium">Thử lại</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <View className="flex-1 justify-center items-center py-20">
                <Feather name="package" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-4 text-center">
                    {activeQuery ? "Không tìm thấy sản phẩm phù hợp" : "Chưa có sản phẩm nào"}
                </Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProductCard product={item} onPress={onProductPress} />}
                contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.5}
                onScroll={onScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
                }
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                showsVerticalScrollIndicator={false}
            />

        </View>
    );
};
