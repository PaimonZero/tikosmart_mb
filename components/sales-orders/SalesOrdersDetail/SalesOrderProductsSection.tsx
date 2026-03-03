import { getProductById } from "@/services/productService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";

interface OrderItem {
    id?: string;
    productId?: string;
    productName?: string;
    qty?: number;
    remain?: number;
    unitPrice?: number;
    note?: string;
}

interface ProductDetail {
    id: string;
    name?: string;
    imgUrl?: string;
    skuCode?: string;
    mainUnit?: string;
    [key: string]: any;
}

interface SalesOrderProductsSectionProps {
    items: OrderItem[];
    showAll?: boolean;
    onViewAll?: () => void;
}

export const SalesOrderProductsSection = ({ items, showAll = false, onViewAll }: SalesOrderProductsSectionProps) => {
    const [productDetails, setProductDetails] = useState<Record<string, ProductDetail>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!items || items.length === 0) return;
        const productIds = [...new Set(items.map(i => i.productId).filter(Boolean))] as string[];
        if (productIds.length === 0) return;

        setLoading(true);
        Promise.allSettled(productIds.map(pid => getProductById(pid)))
            .then(results => {
                const map: Record<string, ProductDetail> = {};
                results.forEach(result => {
                    if (result.status === "fulfilled") {
                        const data = result.value.data?.data ?? result.value.data;
                        if (data?.id) map[data.id] = data;
                    }
                });
                setProductDetails(map);
            })
            .finally(() => setLoading(false));
    }, [items]);

    const displayed = showAll ? items : items.slice(0, 3);

    return (
        <View className="mx-4 mt-4 mb-2">
            {/* Section title */}
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-800 font-bold text-base">
                    Sản phẩm ({items.length})
                </Text>
                {!showAll && items.length > 3 && (
                    <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
                        <Text className="text-blue-600 text-sm font-semibold">Xem tất cả</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View
                className="bg-white rounded-2xl overflow-hidden"
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
            >
                {displayed.map((item, index) => {
                    const product = item.productId ? productDetails[item.productId] : undefined;
                    const imgUrl = product?.imgUrl;
                    const name = product?.name || item.productName || "Sản phẩm";
                    const skuCode = product?.skuCode;
                    const mainUnit = product?.mainUnit;

                    return (
                        <View
                            key={item.id || index}
                            className={`px-4 py-3 ${index < displayed.length - 1 ? "border-b border-gray-100" : ""}`}
                        >
                            {/* Row: image + main info */}
                            <View className="flex-row items-center">
                                {/* Image */}
                                <View className="w-24 h-24 bg-gray-100 rounded-xl items-center justify-center mr-3 border border-gray-200 overflow-hidden flex-shrink-0">
                                    {loading && !imgUrl ? (
                                        <ActivityIndicator size="small" color="#2563EB" />
                                    ) : imgUrl ? (
                                        <Image source={{ uri: imgUrl }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                        <Ionicons name="image-outline" size={22} color="#9CA3AF" />
                                    )}
                                </View>

                                {/* Name + SKU */}
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-medium text-base leading-snug" numberOfLines={2}>
                                        {name}
                                    </Text>
                                    {skuCode && (
                                        <View className="mt-1 self-start bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                                            <Text className="text-blue-600 text-xs font-medium">{skuCode}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Stats row: remain | qty | unit | note */}
                            <View className="flex-row mt-2 pt-2 border-t border-gray-50 gap-4">
                                {/* Lượng chờ phân bổ soạn */}
                                <View className="flex-1">
                                    <Text className="text-gray-400 text-xs">Chờ phân bổ</Text>
                                    <Text className="text-gray-700 font-semibold text-sm mt-0.5">
                                        {item.remain ?? 0}
                                    </Text>
                                </View>

                                {/* Số lượng */}
                                <View className="flex-1">
                                    <Text className="text-gray-400 text-xs">Số lượng</Text>
                                    <Text className="text-gray-700 font-semibold text-sm mt-0.5">
                                        {item.qty ?? 0}
                                    </Text>
                                </View>

                                {/* Đơn vị */}
                                <View className="flex-1">
                                    <Text className="text-gray-400 text-xs">Đơn vị</Text>
                                    <Text className="text-gray-700 font-semibold text-sm mt-0.5">
                                        {mainUnit || "—"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
