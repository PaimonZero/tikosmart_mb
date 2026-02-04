import { ProductDetailHeader } from "@/components/product/ProductDetailHeader";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { useProductPermissions, useProductRouteGuard } from "@/hooks/useProductPermissions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductById } from "@/store/productSlice";
import Feather from '@expo/vector-icons/Feather';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export default function ProductDetailScreen() {
    // Route guard - tự động redirect nếu không có quyền
    useProductRouteGuard('view');

    const { id } = useLocalSearchParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const permissions = useProductPermissions();
    const scrollY = useRef(new Animated.Value(0)).current;

    const { product, fetchProductByIdStatus, fetchProductByIdError } = useAppSelector(
        (state) => state.product
    );

    // Fetch product data on mount
    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [id, dispatch]);

    const handleRetry = () => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    };



    // Loading State
    if (fetchProductByIdStatus === 'loading') {
        return (
            <View className="flex-1">
                <ProductDetailHeader
                    scrollY={scrollY}
                    canEdit={false}
                />
                <ProductDetailSkeleton />
            </View>
        );
    }

    // Error State
    if (fetchProductByIdStatus === 'failed' || !product) {
        return (
            <View className="flex-1">
                <ProductDetailHeader
                    scrollY={scrollY}
                    canEdit={false}
                />
                <View className="flex-1 bg-gray-50 items-center justify-center px-6">
                    <View className="bg-white rounded-2xl p-8 items-center shadow-sm w-full max-w-sm">
                        <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                            <Feather name="alert-circle" size={32} color="#DC2626" />
                        </View>
                        <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
                            Không thể tải sản phẩm
                        </Text>
                        <Text className="text-sm text-gray-600 mb-6 text-center">
                            {fetchProductByIdError || 'Đã xảy ra lỗi khi tải thông tin sản phẩm'}
                        </Text>
                        <TouchableOpacity
                            onPress={handleRetry}
                            className="bg-blue-600 rounded-xl px-6 py-3 flex-row items-center"
                            activeOpacity={0.8}
                        >
                            <Feather name="refresh-cw" size={18} color="#FFFFFF" />
                            <Text className="text-white font-semibold ml-2">
                                Thử lại
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mt-3 px-6 py-2"
                            activeOpacity={0.7}
                        >
                            <Text className="text-gray-600 font-medium">
                                Quay lại
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // Success State
    return (
        <View className="flex-1">
            <ProductDetailHeader
                scrollY={scrollY}
                productName={product.name}
                canEdit={permissions.canEdit}
                onEdit={() => permissions.navigateToEdit(id)}
            />
            <ProductDetailView
                product={product}
                onEdit={permissions.canEdit ? () => permissions.navigateToEdit(id) : undefined}
                canEdit={permissions.canEdit}
                scrollY={scrollY}
            />
        </View>
    );
}
