import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInventoryLots } from '@/store/inventoryLotSlice';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface InventoryLotsSectionProps {
    productId: string;
    productName?: string;
    mainUnit?: string;
}

interface InventoryLot {
    id: string;
    lotNo: string;
    productId: string;
    departmentId: string;
    expiryDate: string;
    qtyOnHand: number;
    conversionRate: number;
    skuCode: string;
    productName: string;
    packUnit: string;
    mainUnit: string;
    departmentName: string;
    departmentCode: string;
    nearExpiryDays: number;
    lowStockThreshold: number;
    qtyInPack: string;
}

export const InventoryLotsSection: React.FC<InventoryLotsSectionProps> = ({
    productId,
    productName,
    mainUnit = 'Kg',
}) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { inventoryLotsByProductId, fetchStatus, fetchError } = useAppSelector(
        (state) => state.inventoryLot
    );

    // Load initial data to get count
    useEffect(() => {
        if (productId) {
            dispatch(
                fetchInventoryLots({
                    productId,
                    params: { limit: 1, offset: 0 }, // Only fetch 1 item to get total count
                })
            );
        }
    }, [productId, dispatch]);

    // Extract lots data from Redux state
    const lotsData = Array.isArray(inventoryLotsByProductId)
        ? { data: inventoryLotsByProductId, pagination: {}, stats: { totalLots: 0, totalQtyOnHand: 0 } }
        : inventoryLotsByProductId;

    const allLots: InventoryLot[] = lotsData?.data || [];
    const pagination = lotsData?.pagination || {};
    const stats = lotsData?.stats || { totalLots: 0, totalQtyOnHand: 0 };
    const totalCount = stats.totalLots || pagination?.total || allLots.length;

    // Navigate to full list
    const handleViewLots = () => {
        router.push({
            pathname: '/(shared)/product-manage/inventory-lots/[productId]',
            params: { productId, productName: productName || 'Sản phẩm' },
        });
    };

    // Loading State
    if (fetchStatus === 'loading') {
        return (
            <View className="bg-white px-5 py-4 mt-2">
                <View className="flex-row items-center justify-center py-4">
                    <ActivityIndicator size="small" color="#2563EB" />
                    <Text className="text-sm text-gray-500 ml-2">Đang tải...</Text>
                </View>
            </View>
        );
    }

    // Error State - Still show button but with error indicator
    if (fetchStatus === 'failed') {
        return (
            <View className="bg-white px-5 py-4 mt-2">
                <TouchableOpacity
                    onPress={handleViewLots}
                    className="bg-red-50 border border-red-200 rounded-xl py-4 px-4"
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <Feather name="alert-circle" size={20} color="#EF4444" />
                            <Text className="text-red-700 font-semibold ml-3">
                                Không thể tải thông tin lô hàng
                            </Text>
                        </View>
                        <Feather name="chevron-right" size={20} color="#EF4444" />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // Empty State
    if (totalCount === 0) {
        return (
            <View className="bg-white px-5 py-4 mt-2">
                <View className="bg-gray-50 border border-gray-200 rounded-xl py-4 px-4">
                    <View className="flex-row items-center">
                        <Feather name="inbox" size={20} color="#9CA3AF" />
                        <Text className="text-gray-500 font-medium ml-3">
                            Chưa có lô hàng nào trong kho
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    // Success State - Show button with count
    return (
        <View className="bg-white px-5 py-4">
            <TouchableOpacity
                onPress={handleViewLots}
                className="bg-blue-50 border border-blue-200 rounded-xl py-4 px-4"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="bg-blue-100 p-2 rounded-lg">
                            <Feather name="package" size={20} color="#2563EB" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="text-gray-900 font-bold text-base">
                                Lô hàng trong kho
                            </Text>
                            <Text className="text-blue-600 font-semibold mt-0.5">
                                {totalCount} lô hàng
                            </Text>
                        </View>
                    </View>
                    <Feather name="chevron-right" size={20} color="#2563EB" />
                </View>
            </TouchableOpacity>
        </View>
    );
};

