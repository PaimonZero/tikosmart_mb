import { Product } from '@/store/productSlice';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { InventoryLotsSection } from './InventoryLotsSection';

interface ProductDetailViewProps {
    product: Product;
    onEdit?: () => void;
    canEdit?: boolean;
    scrollY: Animated.Value;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
    product,
    onEdit,
    canEdit = false,
    scrollY,
}) => {
    // Status configuration
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active':
                return {
                    text: 'Đang bán',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-700',
                    borderColor: 'border-green-200',
                    dotColor: 'bg-green-500',
                };
            case 'warning':
                return {
                    text: 'Sắp hết hàng',
                    bgColor: 'bg-orange-50',
                    textColor: 'text-orange-700',
                    borderColor: 'border-orange-200',
                    dotColor: 'bg-orange-500',
                };
            case 'disable':
                return {
                    text: 'Ngừng bán',
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-700',
                    borderColor: 'border-red-200',
                    dotColor: 'bg-red-500',
                };
            default:
                return {
                    text: 'Không xác định',
                    bgColor: 'bg-gray-50',
                    textColor: 'text-gray-700',
                    borderColor: 'border-gray-200',
                    dotColor: 'bg-gray-500',
                };
        }
    };

    const statusConfig = getStatusConfig(product.status);

    return (
        <Animated.ScrollView
            className="flex-1 bg-gray-50"
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
        >
            {/* Product Image */}
            <View className="bg-white">
                <View className="w-full h-96 bg-gray-100 items-center justify-center">
                    {product.imgUrl ? (
                        <Image
                            source={{ uri: product.imgUrl }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="items-center">
                            <Feather name="image" size={80} color="#D1D5DB" />
                            <Text className="text-gray-400 mt-3 text-base">Chưa có hình ảnh</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Product Name & Status */}
            <View className="bg-white px-5 py-4 border-b border-gray-100">
                <Text className="text-2xl font-bold text-gray-900 leading-8 mb-3">
                    {product.name}
                </Text>

                <View className="flex-row items-center justify-between">
                    <View className={`px-3 py-1.5 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor} flex-row items-center`}>
                        <View className={`w-2 h-2 rounded-full mr-2 ${statusConfig.dotColor}`} />
                        <Text className={`text-sm font-semibold ${statusConfig.textColor}`}>
                            {statusConfig.text}
                        </Text>
                    </View>

                    {product.adminLocked && (
                        <View className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                            <Feather name="lock" size={14} color="#DC2626" />
                            <Text className="text-sm font-semibold text-red-700 ml-1.5">
                                Đã khóa
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Product Codes */}
            <View className="bg-white px-5 py-4 mt-2">
                <Text className="text-base font-bold text-gray-900 mb-3">Mã sản phẩm</Text>
                <View className="space-y-2">
                    <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                        <Text className="text-sm text-gray-600">SKU</Text>
                        <Text className="text-sm font-semibold text-gray-900 font-mono">
                            {product.skuCode}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Category & Supplier */}
            <View className="bg-white px-5 py-4 mt-2">
                <Text className="text-base font-bold text-gray-900 mb-3">Phân loại</Text>

                {/* Category */}
                <View className="flex-row items-center py-3 border-b border-gray-100">
                    <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                        <Feather name="tag" size={18} color="#2563EB" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-0.5">Danh mục</Text>
                        <Text className="text-base font-semibold text-gray-900">
                            {product.categoryName}
                        </Text>
                    </View>
                </View>

                {/* Supplier */}
                {product.supplierName && (
                    <View className="flex-row items-center py-3">
                        <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center mr-3">
                            <Feather name="truck" size={18} color="#7C3AED" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-0.5">Nhà cung cấp</Text>
                            <Text className="text-base font-semibold text-gray-900">
                                {product.supplierName}
                            </Text>
                            {product.supplierCode && (
                                <Text className="text-xs text-gray-500 mt-0.5 font-mono">
                                    {product.supplierCode}
                                </Text>
                            )}
                        </View>
                    </View>
                )}
            </View>

            {/* Inventory Settings */}
            <View className="bg-white px-5 py-4 mt-2">
                <View className="flex-row items-center mb-3">
                    <Feather name="package" size={20} color="#1F2937" />
                    <Text className="text-base font-bold text-gray-900 ml-2">
                        Cài đặt tồn kho
                    </Text>
                </View>

                <View className="space-y-2">
                    {/* Low Stock Threshold */}
                    {product.lowStockThreshold !== undefined && (
                        <View className="flex-row items-center justify-between py-2.5 border-b border-gray-100">
                            <View className="flex-row items-center flex-1">
                                <Feather name="alert-triangle" size={16} color="#F59E0B" />
                                <Text className="text-sm text-gray-600 ml-2">Ngưỡng cảnh báo</Text>
                            </View>
                            <Text className="text-base font-bold text-orange-600">
                                {product.lowStockThreshold} {product.mainUnit || 'đơn vị'}
                            </Text>
                        </View>
                    )}

                    {/* Near Expiry Days */}
                    {product.nearExpiryDays !== undefined && (
                        <View className="flex-row items-center justify-between py-2.5 border-b border-gray-100">
                            <View className="flex-row items-center flex-1">
                                <Feather name="clock" size={16} color="#EF4444" />
                                <Text className="text-sm text-gray-600 ml-2">Cảnh báo hết hạn</Text>
                            </View>
                            <Text className="text-base font-semibold text-gray-900">
                                {product.nearExpiryDays} ngày
                            </Text>
                        </View>
                    )}

                    {/* Units */}
                    {(product.packUnit || product.mainUnit) && (
                        <View className="py-2.5">
                            <View className="flex-row items-center mb-3">
                                <Feather name="box" size={16} color="#6B7280" />
                                <Text className="text-sm text-gray-600 ml-2">Đơn vị tính</Text>
                            </View>
                            <View className="space-y-2 ml-6">
                                {product.mainUnit && (
                                    <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                                        <Text className="text-sm text-gray-600">Đơn vị chính</Text>
                                        <View className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                                            <Text className="text-sm font-bold text-green-700">
                                                {product.mainUnit}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                {product.packUnit && (
                                    <View className="flex-row items-center justify-between py-2">
                                        <Text className="text-sm text-gray-600">Đơn vị đóng gói</Text>
                                        <View className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                                            <Text className="text-sm font-bold text-blue-700">
                                                {product.packUnit}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {/* Inventory Lots Section */}
            <InventoryLotsSection
                productId={product.id}
                productName={product.name}
                mainUnit={product.mainUnit}
            />
            
            {/* Storage Rule */}
            {product.storageRule && (
                <View className="bg-white px-5 py-4 mt-2">
                    <View className="flex-row items-center mb-3">
                        <Feather name="info" size={20} color="#1F2937" />
                        <Text className="text-base font-bold text-gray-900 ml-2">
                            Quy tắc bảo quản
                        </Text>
                    </View>
                    <Text className="text-sm text-gray-700 leading-6">
                        {product.storageRule}
                    </Text>
                </View>
            )}

            {/* Timestamps */}
            <View className="bg-white px-5 py-4 mt-2">
                <Text className="text-base font-bold text-gray-900 mb-3">Thông tin hệ thống</Text>
                <View className="space-y-2">
                    {product.createdAt && (
                        <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                            <Text className="text-sm text-gray-600">Ngày tạo</Text>
                            <Text className="text-sm font-medium text-gray-900">
                                {new Date(product.createdAt).toLocaleString('vi-VN')}
                            </Text>
                        </View>
                    )}
                    {product.updatedAt && (
                        <View className="flex-row items-center justify-between py-2">
                            <Text className="text-sm text-gray-600">Cập nhật lần cuối</Text>
                            <Text className="text-sm font-medium text-gray-900">
                                {new Date(product.updatedAt).toLocaleString('vi-VN')}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Edit Button (if has permission) */}
            {canEdit && onEdit && (
                <View className="px-5 py-4 mb-6">
                    <TouchableOpacity
                        onPress={onEdit}
                        className="bg-blue-600 rounded-xl py-4 flex-row items-center justify-center shadow-lg"
                        activeOpacity={0.8}
                        style={{
                            shadowColor: '#2563EB',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <Feather name="edit-2" size={20} color="#FFFFFF" />
                        <Text className="text-white font-bold text-base ml-2">
                            Chỉnh sửa sản phẩm
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Bottom Spacing */}
            <View className="h-8" />
        </Animated.ScrollView>
    );
};
