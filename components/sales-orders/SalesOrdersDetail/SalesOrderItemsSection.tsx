import { SalesOrderItem } from "@/services/salesOrdersService";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

interface SalesOrderItemsSectionProps {
    items: SalesOrderItem[];
}

export const SalesOrderItemsSection = ({ items }: SalesOrderItemsSectionProps) => {
    const formatPrice = (price?: number) => {
        if (price === undefined) return "0đ";
        return price.toLocaleString("vi-VN") + "đ";
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.unitPrice || 0) * item.qty, 0);
    };

    return (
        <View className="bg-white p-4 mb-2">
            <Text className="font-bold text-gray-800 text-base mb-3 flex-row items-center">
                <Ionicons name="list" size={18} color="#2563EB" /> Danh sách sản phẩm ({items.length})
            </Text>

            <View className="space-y-4">
                {items.map((item, index) => (
                    <View key={item.id || index} className="flex-row border-b border-gray-100 pb-4 mb-1">
                        <View className="w-16 h-16 bg-gray-100 rounded-lg mr-3 shadow-sm border border-gray-200 overflow-hidden items-center justify-center">
                            {item.product?.imageUrl ? (
                                <Image
                                    source={{ uri: item.product.imageUrl }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <Ionicons name="image-outline" size={24} color="#9CA3AF" />
                            )}
                        </View>
                        <View className="flex-1 justify-between py-0.5">
                            <View>
                                <Text className="text-gray-800 font-medium mb-1" numberOfLines={2}>
                                    {item.product?.name || item.productId || "Sản phẩm không xác định"}
                                </Text>
                                {item.product?.sku && (
                                    <Text className="text-gray-500 text-xs py-0.5 px-1.5 bg-gray-100 rounded self-start">
                                        SKU: {item.product.sku}
                                    </Text>
                                )}
                                {item.note && (
                                    <View className="flex-row items-center mt-1">
                                        <Ionicons name="document-text-outline" size={12} color="#F59E0B" />
                                        <Text className="text-yellow-600 text-xs ml-1 italic">{item.note}</Text>
                                    </View>
                                )}
                            </View>
                            <View className="flex-row justify-between items-end mt-2">
                                <Text className="text-gray-800 font-bold">
                                    {formatPrice(item.unitPrice)}
                                </Text>
                                <Text className="text-gray-500 text-sm">x{item.qty}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            <View className="flex-row justify-between items-center mt-4 pt-2">
                <Text className="text-gray-600 font-medium">Tổng ({items.length} sản phẩm)</Text>
                <Text className="text-red-600 font-bold text-lg">{formatPrice(calculateTotal())}</Text>
            </View>
        </View>
    );
};
