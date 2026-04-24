import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { getStatusStyles } from '../utils/helpers';
import { Divider } from 'react-native-paper';
import { formatDateShortVN } from '@/utils/formatters';

interface DeliveryRunDetailHeaderProps {
    run: any;
    hideCompactInfo?: boolean;
}

export default function DeliveryRunDetailHeader({ run, hideCompactInfo }: DeliveryRunDetailHeaderProps) {
    const statusStyle = getStatusStyles(run.status);
    const dateStr = run.createdAt ? dayjs(run.createdAt).locale('vi').format('HH:mm - DD/MM/YYYY') : '---';

    return (
        <View className="py-2">
            {/* Status & ID Row */}
            {!hideCompactInfo && (
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Mã chuyến</Text>
                        <Text className="text-slate-900 font-black text-lg">
                            Chuyến {run.dailySeq || 'N/A'} - {formatDateShortVN(run.createdAt)}
                        </Text>
                    </View>
                    <View className={clsx("px-3 py-1.5 rounded-full border", statusStyle.bg, statusStyle.border)}>
                        <Text className={clsx("text-xs font-black uppercase tracking-wider", statusStyle.text)}>
                            {statusStyle.label}
                        </Text>
                    </View>
                </View>
            )}

            {/* Info Grid */}
            <View className="flex-row bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <View className="flex-1 border-r border-slate-200 pr-4">
                    <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Phương tiện</Text>
                    <View className="flex-row items-center">
                        <Feather name="truck" size={16} color="#475569" />
                        <Text className="text-slate-900 font-bold ml-2 underline">{run.vehicleNo || 'N/A'}</Text>
                    </View>
                </View>
                <View className="flex-1 pl-4">
                    <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Thời gian tạo</Text>
                    <View className="flex-row items-center">
                        <Feather name="calendar" size={16} color="#475569" />
                        <Text className="text-slate-900 font-bold ml-2">{dateStr}</Text>
                    </View>
                </View>
            </View>

            {/* People Info */}
            <View className="mt-4 gap-4">
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3 border border-blue-100">
                        <Feather name="user-check" size={14} color="#2563EB" />
                    </View>
                    <View>
                        <Text className="text-slate-400 text-xs font-bold uppercase">Giám sát</Text>
                        <Text className="text-slate-800 font-semibold">{run.supervisorName || 'N/A'}</Text>
                    </View>
                </View>
                <Divider/>
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center mr-3 border border-orange-100">
                        <Feather name="user" size={14} color="#EA580C" />
                    </View>
                    <View>
                        <Text className="text-slate-400 text-xs font-bold uppercase">Người giao hàng</Text>
                        <Text className="text-slate-800 font-semibold">{run.shipperName || 'Hệ thống chưa gán'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Utility to handle clsx-like behavior in NativeWind
function clsx(...args: any[]) {
    return args.filter(Boolean).join(' ');
}
