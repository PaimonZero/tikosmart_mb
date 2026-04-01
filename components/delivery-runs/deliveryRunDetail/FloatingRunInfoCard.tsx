import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { getStatusStyles } from '../utils/helpers';
import DeliveryRunDetailHeader from './DeliveryRunDetailHeader';

interface FloatingRunInfoCardProps {
    run: any;
    isExpanded: boolean;
    onToggle: () => void;
    className?: string; // Add flexibility for parent containers
}

// Utility to handle clsx-like behavior in NativeWind
function clsx(...args: any[]) {
    return args.filter(Boolean).join(' ');
}

export default function FloatingRunInfoCard({ run, isExpanded, onToggle, className }: FloatingRunInfoCardProps) {
    if (!run) return null;
    const statusStyle = getStatusStyles(run.status);

    return (
        <View 
            className={clsx("bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm", className)}
        >
            {/* Compact Header (Always Visible) */}
            <TouchableOpacity 
                onPress={onToggle}
                activeOpacity={0.8}
                className="flex-row items-center justify-between p-4"
            >
                <View className="flex-row items-center flex-1">
                    <View className={clsx("w-3 h-3 rounded-full mr-3", statusStyle.dot)} />
                    <View>
                        <View className="flex-row items-center justify-between mb-0.5">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mr-2">Mã chuyến</Text>
                            <View className={clsx("px-2 py-0.5 rounded-full border", statusStyle.bg, statusStyle.border)}>
                                <Text className={clsx("text-[9px] font-black uppercase", statusStyle.text)}>
                                    {statusStyle.label}
                                </Text>
                            </View>
                        </View>
                        <Text className="text-slate-900 font-black text-base">
                            Chuyến {run.dailySeq || 'N/A'} - {run.createdAt ? dayjs(run.createdAt).locale('vi').format('DD/MM/YYYY') : '---'}
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center border border-slate-100">
                        <Ionicons 
                            name={isExpanded ? "chevron-up" : "chevron-down"} 
                            size={16} 
                            color="#64748B" 
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Expanded Details */}
            {isExpanded && (
                <View className="px-5 pb-5 border-t border-slate-50 pt-2 bg-white">
                    <DeliveryRunDetailHeader run={run} hideCompactInfo={true} />
                </View>
            )}
        </View>
    );
}
