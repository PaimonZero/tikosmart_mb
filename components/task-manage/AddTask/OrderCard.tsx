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
            activeOpacity={0.8}
            onPress={() => onSelect(order)}
            className="bg-white mx-4 mb-4 rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex-row"
        >
            {/* Status vertical bar */}
            <View className={`w-1.5 ${isOverdue ? 'bg-red-500' : 'bg-blue-600'}`} />

            <View className="flex-1 p-4">
                {/* Header: Order No & Count */}
                <View className="flex-row justify-between items-start mb-3">
                    <View className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Text className="text-sm font-bold text-slate-700 tracking-tight">#{order.orderNo}</Text>
                    </View>
                    
                    <View className="flex-row items-center bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        <Package size={12} color="#2563EB" />
                        <Text className="text-[11px] font-bold text-blue-700 ml-1">
                            {remainCount} SP
                        </Text>
                    </View>
                </View>

                {/* Customer Information */}
                <View className="mb-3">
                    <Text className="text-lg font-bold text-slate-900 leading-tight mb-1" numberOfLines={1}>
                        {order.customerName || '—'}
                    </Text>
                    
                    <View className="flex-row items-center">
                        <Building2 size={13} color="#64748B" />
                        <Text className="text-sm text-slate-500 ml-1" numberOfLines={1}>
                            Kho: <Text className="text-slate-700 font-medium">{order.departmentName || '—'}</Text>
                        </Text>
                    </View>
                </View>

                {/* Footer: SLA & Action */}
                <View className="pt-3 border-t border-slate-50 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className={`w-2 h-2 rounded-full mr-2 ${
                            isOverdue ? 'bg-red-500 animate-pulse' : hasSla ? 'bg-green-500' : 'bg-slate-300'
                        }`} />
                        <View>
                            <Text className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Hạn giao (SLA)</Text>
                            <Text className={`text-sm ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-700 font-medium'}`}>
                                {hasSla ? dayjs(order.slaDeliveryAt).format('HH:mm - DD/MM/YYYY') : 'Chưa có SLA'}
                            </Text>
                        </View>
                    </View>

                    <View className="bg-blue-600 px-4 py-2 rounded-xl shadow-sm shadow-blue-200">
                        <Text className="text-white text-sm font-bold">Chọn soạn</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OrderCard;
