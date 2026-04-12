import { Calendar, ClockAlert, User, Users } from 'lucide-react-native';
import dayjs from 'dayjs';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import StatusBadge from './StatusBadge';

interface TaskCardProps {
    task: any;
    userRole?: string;
    onPress: (task: any) => void;
}

const TaskCard = React.memo(({ task, userRole, onPress }: TaskCardProps) => {
    const dailySeq = task?.dailySeq || '?';
    const dateLabel = task?.createdAt ? dayjs(task.createdAt).format('DD/MM/YYYY') : '';
    const displayId = dateLabel ? `Nhiệm vụ ${dailySeq} - ${dateLabel}` : `Nhiệm vụ ${dailySeq}`;
    const orderNo = task?.salesOrder?.orderNo || '—';
    const customerName = task?.salesOrder?.customerName || '';
    const supervisorName = task?.supervisorName || 'Không có';
    const packerName = task?.packerName || 'Không có';

    // Deadline calculation
    let deadlineString = '—';
    let isOverdue = false;
    let isToday = false;
    const isCompleted = task?.status === 'completed';
    const isCancelled = task?.status === 'cancelled';

    if (task?.deadline) {
        const deadlineDate = new Date(task.deadline);
        deadlineString = deadlineDate.toLocaleString('vi-VN');

        const now = new Date();
        // Check overdue
        if (deadlineDate < now) {
            isOverdue = true;
        } else {
            // Check if same day
            isToday = deadlineDate.getDate() === now.getDate() &&
                deadlineDate.getMonth() === now.getMonth() &&
                deadlineDate.getFullYear() === now.getFullYear();
        }
    }

    const note = task?.note || '';

    return (
        <TouchableOpacity
            onPress={() => onPress(task)}
            activeOpacity={0.7}
            className={`rounded-xl shadow-sm p-4 mb-3 mx-4 border ${isCancelled ? 'bg-gray-100 border-gray-200 opacity-70' : 'bg-white border-gray-300'}`}
        >
            {/* Header Row */}
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                    <View className="bg-blue-600 rounded-full w-8 h-8 items-center justify-center mr-2 shadow-sm">
                        <Text className="text-white font-bold text-sm">#{dailySeq}</Text>
                    </View>
                    <View className="bg-blue-50 px-2 py-1 rounded">
                        <Text className="text-sm font-bold text-blue-600">{displayId}</Text>
                    </View>
                </View>
                <StatusBadge status={task?.status || ''} />
            </View>

            {/* Main Order Info */}
            <View className="mb-3">
                <Text className={`text-base font-bold ${isCancelled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{orderNo}</Text>
                {customerName ? (
                    <Text className="text-sm text-gray-500">{customerName}</Text>
                ) : null}
            </View>

            {/* Info Details Stack */}
            <View className="mb-2">
                {/* Supervisor */}
                <View className="flex-row items-center mb-2">
                    <User size={16} color="#4B5563" />
                    <Text className="text-sm text-gray-700 ml-2">
                        Giám sát: <Text className="font-bold">{supervisorName}</Text>
                    </Text>
                </View>

                {/* Packer - conditional */}
                {userRole !== 'picker' && (
                    <View className="flex-row items-center mb-2">
                        <Users size={16} color="#4B5563" />
                        <Text className="text-sm text-gray-700 ml-2">
                            Người soạn: <Text className="font-bold">{packerName}</Text>
                        </Text>
                    </View>
                )}

                {/* Deadline */}
                <View className="flex-row items-center justify-between mt-1">
                    <View className="flex-row items-center">
                        <Calendar size={16} color={isCompleted ? "#16A34A" : isCancelled ? "#4B5563" : isOverdue ? "#DC2626" : isToday ? "#CA8A04" : "#4B5563"} />
                        <Text className={`text-sm ml-2 ${isCompleted ? "text-green-600 font-bold" : isCancelled ? "text-gray-700 font-bold" : isOverdue ? "text-red-600 font-bold" : isToday ? "text-yellow-600 font-bold" : "text-gray-700"}`}>
                            Hạn hoàn thành: <Text className="font-bold">{deadlineString}</Text>
                        </Text>
                    </View>
                    {isOverdue && !isCompleted && !isCancelled && (
                        <Text className="text-sm text-red-600 font-bold"><ClockAlert size={18} color="#DC2626" /> Quá hạn</Text>
                    )}
                </View>
            </View>

            {/* Note */}
            {note ? (
                <View className="mt-2 pt-2 border-t border-gray-100">
                    <Text className="text-sm text-gray-500 italic" numberOfLines={2}>
                        📝 {note}
                    </Text>
                </View>
            ) : null}
        </TouchableOpacity>
    );
});

export default TaskCard;
