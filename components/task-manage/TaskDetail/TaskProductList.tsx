import { useRouter } from "expo-router";
import { Edit3, PackageOpen } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import EvidencePhotos from "./EvidencePhotos";
import LotInfoSection from "./LotInfoSection";
import ProductItemHeader from "./ProductItemHeader";

interface TaskProductListProps {
    taskItems: any[];
    userRole: string;
    taskDetail: any;
    lotInfoMap: Record<string, any>;
    productInfoMap: Record<string, any>;
}

export default function TaskProductList({
    taskItems,
    userRole,
    taskDetail,
    lotInfoMap,
    productInfoMap,
}: TaskProductListProps) {
    const router = useRouter();

    if (!taskItems || taskItems.length === 0) {
        return (
            <View className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mx-4 mt-4 items-center">
                <PackageOpen size={40} color="#d1d5db" />
                <Text className="text-gray-500 font-medium mt-3">Không có sản phẩm nào</Text>
            </View>
        );
    }

    return (
        <View className="mx-4 mt-4">
            {/* Section Header */}
            <View className="flex-row items-center mb-2 px-1">
                <Text className="text-lg font-bold text-gray-900">Danh sách sản phẩm</Text>
                <View className="bg-blue-100 rounded-full px-2 py-0.5 ml-2">
                    <Text className="text-blue-700 text-sm font-bold">{taskItems.length}</Text>
                </View>
            </View>

            {taskItems.map((item) => {
                const lot = item.lotId ? lotInfoMap[item.lotId] : null;
                const productInfo = lot?.productId ? productInfoMap[lot.productId] : null;
                const showUpdateButton = userRole === "picker" && taskDetail?.status === "in_progress";
                const displayUnit = productInfo?.mainUnit || lot?.mainUnit || item.unit || "";

                return (
                    <View key={item.id} className="bg-white p-4 mb-3 rounded-xl border border-gray-100 shadow-sm">

                        <ProductItemHeader
                            productName={item.productName || productInfo?.name || ""}
                            skuCode={item.skuCode || productInfo?.skuCode}
                            imgUrl={productInfo?.imgUrl}
                            displayUnit={displayUnit}
                            preQty={item.preQty}
                            postQty={item.postQty}
                        />

                        {/* Divider */}
                        <View className="h-[1px] bg-gray-100 my-2" />

                        <LotInfoSection lot={lot} />

                        <EvidencePhotos preEvd={item.preEvd} postEvd={item.postEvd} />

                        {/* Cập nhật Button */}
                        {showUpdateButton && (
                            <TouchableOpacity
                                onPress={() => {
                                    router.push({
                                        pathname: "/(shared)/task-manage/[id]/update-item",
                                        params: {
                                            id: taskDetail.id,
                                            itemId: item.id,
                                            preQtyParam: item.preQty,
                                            postQtyParam: item.postQty,
                                            preEvdParam: item.preEvd,
                                            postEvdParam: item.postEvd,
                                            productNameParam: item.productName,
                                        },
                                    });
                                }}
                                className="bg-blue-600 px-4 py-3.5 rounded-lg flex-row items-center justify-center mt-3"
                                activeOpacity={0.8}
                            >
                                <Edit3 color="white" size={20} />
                                <Text className="text-white font-bold text-base ml-2">Cập nhật Số lượng & Ảnh</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                );
            })}
        </View>
    );
}
