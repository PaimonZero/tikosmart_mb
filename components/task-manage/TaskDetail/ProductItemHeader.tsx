import { PackageOpen } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ImageView from "react-native-image-viewing";

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
    const [viewerVisible, setViewerVisible] = useState(false);
    const imageUri = Array.isArray(imgUrl) ? imgUrl[0] : imgUrl;


    const qtyColor =
        postQty === preQty
            ? "text-green-600"
            : postQty > 0
                ? "text-blue-600"
                : "text-orange-500";

    return (
        <>
            {/* Hình ảnh + Tên + SKU + ĐVT */}
            <View className="flex-row items-start mb-5">
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => imageUri && setViewerVisible(true)}
                    className="w-20 h-20 rounded-2xl bg-gray-50 items-center justify-center mr-4 border border-gray-100 overflow-hidden"
                >
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <PackageOpen color="#9ca3af" size={28} />
                    )}
                </TouchableOpacity>

                <View className="flex-1 min-h-[80px] justify-center">
                    <Text className="font-extrabold text-lg text-gray-900 leading-6 mb-2">
                        {productName || "Sản phẩm không xác định"}
                    </Text>
                    <View className="flex-row items-center flex-wrap">
                        <View className="bg-blue-50 px-2.5 py-1 rounded-lg mr-2 mb-1 border border-blue-100">
                            <Text className="text-blue-700 font-bold text-xs uppercase tracking-tight">
                                {skuCode || "Chưa có SKU"}
                            </Text>
                        </View>
                        {!!displayUnit && (
                            <View className="bg-gray-100 px-2.5 py-1 rounded-lg mb-1 border border-gray-200">
                                <Text className="text-gray-700 font-bold text-xs uppercase tracking-tight">
                                    ĐVT: {displayUnit}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Số lượng Cần lấy / Thực tế */}
            <View className="flex-row bg-gray-50/50 rounded-2xl border border-gray-100/50 p-4 mb-4">
                <View className="flex-1 items-center border-r border-gray-200/50">
                    <Text className="text-sm text-gray-400 mb-1.5 font-bold">Cần lấy</Text>
                    <Text className="text-xl font-black text-gray-900">
                        {preQty?.toLocaleString("vi-VN") || 0}
                    </Text>
                </View>
                <View className="flex-1 items-center">
                    <Text className="text-sm text-gray-400 mb-1.5 font-bold">Thực tế </Text>
                    <Text className={`text-xl font-black ${qtyColor}`}>
                        {postQty?.toLocaleString("vi-VN") || 0}
                    </Text>
                </View>
            </View>

            {imageUri && (
                <ImageView
                    images={[{ uri: imageUri }]}
                    imageIndex={0}
                    visible={viewerVisible}
                    onRequestClose={() => setViewerVisible(false)}
                />
            )}
        </>
    );
}
