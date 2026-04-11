import { SalesOrder } from '@/hooks/useOrderList';
import dayjs from 'dayjs';
import { Building2, Package } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface OrderCardProps {
    order: SalesOrder;
    onSelect: (order: SalesOrder) => void;
}

const OrderCard = ({ order, onSelect }: OrderCardProps) => {
    const remainCount = order.items?.filter((i) => i.remain > 0).length || 0;
    const hasSla = !!order.slaDeliveryAt;
    const isOverdue = hasSla ? dayjs().isAfter(dayjs(order.slaDeliveryAt)) : false;

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onSelect(order)}
            className="bg-white mx-4 mb-3 rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
            {/* Top accent bar */}
            <View className="h-1 bg-blue-500" />

            <View className="p-4">
                {/* Header row */}
                <View className="flex-row justify-between items-center mb-3">
                    <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <Text className="text-sm font-bold text-blue-600">{order.orderNo}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Package size={14} color="#6B7280" />
                        <Text className="text-xs text-gray-500 ml-1">
                            {remainCount} sản phẩm cần chuẩn bị
                        </Text>
                    </View>
                </View>

                {/* Customer */}
                <Text className="text-base font-semibold text-gray-800 mb-1" numberOfLines={1}>
                    Khách hàng: {order.customerName || '—'}
                </Text>

                {/* Department */}
                <View className="flex-row items-center">
                    <Building2 size={14} color="#6B7280" />
                    <Text className="text-sm text-gray-500 ml-1">
                        Kho: <Text className="font-bold text-gray-800">{order.departmentName || '—'}</Text>
                    </Text>
                </View>

                <View className="mt-2 flex-row items-center justify-between">
                    <Text className={`text-xs ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        SLA: {hasSla ? dayjs(order.slaDeliveryAt).format('HH:mm DD/MM/YYYY') : '—'}
                    </Text>
                    {isOverdue && (
                        <View className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            <Text className="text-[11px] font-semibold text-red-600">Quá hạn SLA</Text>
                        </View>
                    )}
                </View>

                {/* CTA */}
                <View className="mt-3 pt-3 border-t border-gray-200 flex-row justify-end">
                    <View className="bg-blue-600 px-4 py-1.5 rounded-lg">
                        <Text className="text-white text-sm font-semibold">Chọn đơn này</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderCard;
