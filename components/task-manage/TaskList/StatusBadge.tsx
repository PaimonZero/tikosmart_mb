import { CheckCircle2, Circle, Clock, PlayCircle, UserCheck, XCircle } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

const COLOR_MAP: Record<string, { bg: string; text: string; iconColor: string }> = {
    assigned: { bg: 'bg-blue-100', text: 'text-blue-700', iconColor: '#1D4ED8' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', iconColor: '#1D4ED8' },
    pending_review: { bg: 'bg-orange-100', text: 'text-orange-700', iconColor: '#C2410C' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', iconColor: '#15803D' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', iconColor: '#B91C1C' },
};

const LABEL_MAP: Record<string, string> = {
    assigned: "Đã phân công",
    in_progress: "Đang soạn",
    pending_review: "Chờ duyệt",
    completed: "Hoàn tất",
    cancelled: "Đã huỷ",
};

const ICON_MAP: Record<string, any> = {
    assigned: UserCheck,
    in_progress: PlayCircle,
    pending_review: Clock,
    completed: CheckCircle2,
    cancelled: XCircle,
};

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const defaultColor = { bg: 'bg-gray-100', text: 'text-gray-700', iconColor: '#374151' };
    const color = COLOR_MAP[status] || defaultColor;
    const label = LABEL_MAP[status] || status;
    const Icon = ICON_MAP[status] || Circle;

    return (
        <View className={`${color.bg} px-2 py-1 rounded-full self-start flex-row items-center`}>
            <Icon size={14} color={color.iconColor} />
            <Text className={`${color.text} text-sm font-medium ml-1`}>{label}</Text>
        </View>
    );
}
