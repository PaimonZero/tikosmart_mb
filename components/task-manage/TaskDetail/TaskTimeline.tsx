import { CheckCircle2, CircleDashed } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

export interface TaskTimelineProps {
    taskDetail: any;
    isCancelled: boolean;
}

export default function TaskTimeline({ taskDetail, isCancelled }: TaskTimelineProps) {
    if (!taskDetail) return null;

    if (isCancelled) {
        return (
            <View className="bg-red-50 p-4 rounded-xl border border-red-100 flex-row items-center mt-2 mx-4">
                <CheckCircle2 color="#ef4444" size={24} />
                <View className="ml-3">
                    <Text className="text-red-700 font-bold text-base">Nhiệm vụ đã bị hủy</Text>
                    <Text className="text-red-600 text-sm mt-0.5">Tiến trình đã dừng lại.</Text>
                </View>
            </View>
        );
    }

    const steps = [
        { key: "assigned", label: "Đã phân công", time: taskDetail.createdAt },
        { key: "in_progress", label: "Đang thực hiện", time: taskDetail.startedAt },
        { key: "pending_review", label: "Chờ duyệt", time: null }, // Mốc này thường không có field time riêng rẽ mà dùng updated_at của review
        { key: "completed", label: "Hoàn thành", time: taskDetail.completedAt },
    ];

    const currentStatusIndex = steps.findIndex((s) => s.key === taskDetail.status);
    const flowIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex; // Fallback if status not in list

    return (
        <View className="bg-white p-4 rounded-xl border border-gray-100 mx-4 mt-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-5">Tiến trình nhiệm vụ</Text>

            <View className="ml-2">
                {steps.map((step, index) => {
                    // Logic to determine if this step is reached or passed
                    const isDone = index < flowIndex || (step.key === "completed" && taskDetail.status === "completed");
                    const isCurrent = index === flowIndex;
                    const isLast = index === steps.length - 1;

                    return (
                        <View key={step.key} className="flex-row">
                            {/* Visual Timeline Line & Dot */}
                            <View className="items-center mr-4">
                                {isDone || isCurrent ? (
                                    <CheckCircle2 color={isCurrent ? "#3b82f6" : "#22c55e"} size={22} />
                                ) : (
                                    <CircleDashed color="#d1d5db" size={22} />
                                )}

                                {/* The connecting line (skip for last item) */}
                                {!isLast && (
                                    <View
                                        className={`w-0.5 h-12 my-1.5 rounded-full ${isDone ? "bg-green-500" : "bg-gray-200"}`}
                                    />
                                )}
                            </View>

                            {/* Content */}
                            <View className={`flex-1 pt-0.5 ${!isLast ? "pb-8" : ""}`}>
                                <Text className={`text-base font-bold ${isCurrent ? "text-blue-600" : isDone ? "text-gray-900" : "text-gray-400"}`}>
                                    {step.label}
                                </Text>
                                {step.time && (
                                    <Text className="text-sm text-gray-500 mt-1.5 font-medium">
                                        {new Date(step.time).toLocaleString("vi-VN")}
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
