import { PackageOpen } from "lucide-react-native";
import React from "react";
import { Image, Text, View } from "react-native";

interface ProductItemHeaderProps {
    productName: string;
    skuCode?: string;
    imgUrl?: string;
    displayUnit?: string;
    preQty: number;
    postQty: number;
}

export default function ProductItemHeader({
    productName,
    skuCode,
    imgUrl,
    displayUnit,
    preQty,
    postQty,
}: ProductItemHeaderProps) {
    const qtyColor =
        postQty === preQty
            ? "text-green-600"
            : postQty > 0
                ? "text-blue-600"
                : "text-orange-500";

    return (
        <>
            {/* Hình ảnh + Tên + SKU + ĐVT */}
            <View className="flex-row items-start mb-3">
                <View className="w-16 h-16 rounded-lg bg-gray-50 items-center justify-center mr-3 border border-gray-100 overflow-hidden">
                    {imgUrl ? (
                        <Image source={{ uri: imgUrl }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <PackageOpen color="#9ca3af" size={24} />
                    )}
                </View>

                <View className="flex-1">
                    <Text className="font-bold text-lg text-gray-900 leading-6">
                        {productName || "Sản phẩm không xác định"}
                    </Text>
                    <View className="flex-row items-center mt-2 flex-wrap">
                        <View className="bg-blue-50 px-2 py-1.5 rounded mr-2 mb-1">
                            <Text className="text-blue-700 font-bold text-sm">
                                {skuCode || "Chưa có SKU"}
                            </Text>
                        </View>
                        {!!displayUnit && (
                            <View className="bg-gray-100 px-2 py-1.5 rounded mb-1 border border-gray-200">
                                <Text className="text-gray-700 font-bold text-sm">
                                    ĐVT: {displayUnit}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Số lượng Cần lấy / Thực tế */}
            <View className="flex-row bg-slate-50 rounded-lg border border-slate-100 p-4 mb-4">
                <View className="flex-1 items-center border-r border-slate-200">
                    <Text className="text-sm font-semibold text-gray-500 mb-1.5">Cần lấy</Text>
                    <Text className="text-xl font-bold text-gray-900">
                        {preQty?.toLocaleString("vi-VN") || 0}
                    </Text>
                </View>
                <View className="flex-1 items-center">
                    <Text className="text-sm font-semibold text-gray-500 mb-1.5">Thực tế</Text>
                    <Text className={`text-xl font-bold ${qtyColor}`}>
                        {postQty?.toLocaleString("vi-VN") || 0}
                    </Text>
                </View>
            </View>
        </>
    );
}
