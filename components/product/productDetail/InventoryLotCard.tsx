import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Text, View } from 'react-native';

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

interface InventoryLotCardProps {
    lot: InventoryLot;
}

export const InventoryLotCard: React.FC<InventoryLotCardProps> = ({ lot }) => {
    // Check if lot is near expiry or expired
    const getLotStatus = () => {
        const expiryDate = new Date(lot.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
            (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiry < 0) {
            return {
                status: 'expired',
                text: 'ĐÃ HẾT HẠN',
                bgColor: 'bg-red-50',
                textColor: 'text-red-700',
                borderColor: 'border-red-200',
                cardBorderColor: 'border-l-red-500',
            };
        } else if (daysUntilExpiry <= lot.nearExpiryDays) {
            return {
                status: 'near-expiry',
                text: 'SẮP HẾT HẠN',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-700',
                borderColor: 'border-orange-200',
                cardBorderColor: 'border-l-orange-500',
            };
        } else {
            return {
                status: 'active',
                text: 'ĐANG DÙNG',
                bgColor: 'bg-green-50',
                textColor: 'text-green-700',
                borderColor: 'border-green-200',
                cardBorderColor: 'border-l-blue-500',
            };
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const status = getLotStatus();
    const lotDate = formatDate(lot.expiryDate);

    return (
        <View
            className={`bg-white border border-gray-200 ${status.cardBorderColor} border-l-4 rounded-lg p-4 shadow-sm mb-3`}
        >
            {/* Lot Header */}
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                    <Text className="text-xs text-gray-500 mb-1">
                        LÔ HÀNG {formatDate(lot.expiryDate.split('T')[0])}
                    </Text>
                    <Text className="text-base font-bold text-gray-900">
                        {lot.lotNo}
                    </Text>
                </View>
                <View
                    className={`px-3 py-1 rounded-md ${status.bgColor} border ${status.borderColor}`}
                >
                    <Text className={`text-xs font-bold ${status.textColor}`}>
                        {status.text}
                    </Text>
                </View>
            </View>

            {/* Warehouse Info */}
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                    <Text className="text-xs text-gray-500 mb-1">KHO LƯU TRỮ</Text>
                    <Text className="text-sm font-semibold text-gray-900">
                        {lot.departmentName}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">
                        {lot.departmentCode}
                    </Text>
                </View>
                <View className="flex-1 items-end">
                    <Text className="text-xs text-gray-500 mb-1">QUY ĐỔI</Text>
                    <Text className="text-sm font-semibold text-gray-900">
                        1 {lot.packUnit} = {lot.conversionRate} {lot.mainUnit}
                    </Text>
                </View>
            </View>

            {/* Expiry Date */}
            {status.status === 'near-expiry' && (
                <View className="flex-row items-center bg-orange-50 px-3 py-2 rounded-lg mb-3 border border-orange-100">
                    <Feather name="alert-triangle" size={14} color="#F59E0B" />
                    <Text className="text-xs font-semibold text-orange-700 ml-2">
                        HẠN SỬ DỤNG
                    </Text>
                    <Text className="text-xs font-bold text-orange-900 ml-auto">
                        {lotDate}
                    </Text>
                </View>
            )}

            {status.status === 'expired' && (
                <View className="flex-row items-center bg-red-50 px-3 py-2 rounded-lg mb-3 border border-red-100">
                    <Feather name="alert-triangle" size={14} color="#EF4444" />
                    <Text className="text-xs font-semibold text-red-700 ml-2">
                        HẠN SỬ DỤNG
                    </Text>
                    <Text className="text-xs font-bold text-red-900 ml-auto">
                        {lotDate}
                    </Text>
                </View>
            )}

            {status.status === 'active' && (
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-xs text-gray-500">HẠN SỬ DỤNG</Text>
                    <Text className="text-xs font-semibold text-gray-900">
                        📅 {lotDate}
                    </Text>
                </View>
            )}

            {/* Quantity */}
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <Text className="text-xs text-gray-500">SỐ LƯỢNG</Text>
                <View className="flex-row items-baseline">
                    <Text className="text-xl font-bold text-blue-600 mr-1">
                        {lot.qtyOnHand.toLocaleString('vi-VN')}
                    </Text>
                    <Text className="text-sm text-gray-600">{lot.mainUnit}</Text>
                </View>
            </View>
        </View>
    );
};
