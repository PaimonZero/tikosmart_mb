import { formatCurrency } from "@/utils/invoiceHelpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

interface InvoiceProductRowProps {
    imgUrl?: string;
    productName?: string;
    skuCode?: string;
    qty?: number;
    postQty?: number;
    unitPrice?: number;
}


export const InvoiceProductRow = ({
    imgUrl,
    productName,
    skuCode,
    qty,
    postQty,
    unitPrice,
}: InvoiceProductRowProps) => {
    return (
        <View
            className="flex-row py-3 border-b border-gray-100"
            style={{ gap: 12 }}
        >
            {/* Thumbnail */}
            {imgUrl ? (
                <Image
                    source={{ uri: imgUrl }}
                    style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: "#F3F4F6" }}
                    resizeMode="cover"
                />
            ) : (
                <View
                    style={{ width: 64, height: 64, borderRadius: 10 }}
                    className="bg-gray-100 items-center justify-center"
                >
                    <Ionicons name="cube-outline" size={24} color="#9CA3AF" />
                </View>
            )}

            {/* Info */}
            <View style={{ flex: 1, gap: 4 }}>
                <Text className="text-gray-800 font-semibold text-lg" numberOfLines={2}>
                    {productName || "—"}
                </Text>

                {/* SKU + Qty row */}
                <View className="flex-row items-center flex-wrap" style={{ gap: 6 }}>
                    {skuCode && (
                        <View className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                            <Text className="text-blue-600 text-xs font-medium">{skuCode}</Text>
                        </View>
                    )}
                    <View className="flex-row items-center border-l border-gray-200 pl-2 ml-1" style={{ gap: 4 }}>
                        <Text className="text-gray-400 text-base">SL:</Text>
                        <Text className="text-gray-800 text-base font-bold">{qty ?? "—"}</Text>
                    </View>
                    <View className="flex-row items-center border-l border-gray-200 pl-2 ml-1" style={{ gap: 4 }}>
                        <Text className="text-gray-400 text-base">Đã soạn:</Text>
                        <Text className="text-gray-800 text-base font-bold">{postQty ?? "—"}</Text>
                    </View>
                </View>

                {/* Price */}
                <Text className="text-blue-600 font-bold text-base text-right">
                    Giá: {formatCurrency(unitPrice)}
                </Text>
            </View>
        </View>
    );
};
