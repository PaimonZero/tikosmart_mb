import { CheckCircle2, ChevronLeft, ChevronRight, CircleDashed, Clock } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export interface TaskTimelineProps {
    taskDetail: any;
    isCancelled: boolean;
}

export default function TaskTimeline({ taskDetail, isCancelled }: TaskTimelineProps) {
    const scrollX = useSharedValue(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    if (!taskDetail) return null;

    if (isCancelled) {
        return (
            <View className="bg-red-50 p-5 rounded-2xl border border-red-100 flex-row items-center mt-2 mx-4 shadow-sm">
                <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center mr-4">
                    <CheckCircle2 color="#ef4444" size={24} />
                </View>
                <View className="flex-1">
                    <Text className="text-red-800 font-extrabold text-base">Nhiệm vụ đã bị hủy</Text>
                    <Text className="text-red-600/80 text-sm mt-1 font-medium">Tiến trình đã được dừng lại bởi hệ thống.</Text>
                </View>
            </View>
        );
    }

    const steps = [
        { key: "assigned", label: "Đã phân công", time: taskDetail.createdAt },
        { key: "in_progress", label: "Đang làm", time: taskDetail.startedAt },
        { key: "pending_review", label: "Chờ duyệt", time: null },
        { key: "completed", label: "Hoàn tất", time: taskDetail.completedAt },
    ];

    const currentStatusIndex = steps.findIndex((s) => s.key === taskDetail.status);
    const flowIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

    const leftIndicatorStyle = useAnimatedStyle(() => {
        const isVisible = scrollX.value > 10;
        return {
            opacity: withTiming(isVisible ? 1 : 0),
        };
    });

    const rightIndicatorStyle = useAnimatedStyle(() => {
        const isVisible = scrollX.value < contentWidth - containerWidth - 10;
        return {
            opacity: withTiming(isVisible ? 1 : 0),
        };
    });

    return (
        <View className="bg-white py-2 mt-2 border-y border-gray-100 shadow-sm relative">
            <View className="flex-row items-center px-5 mb-6">
                <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center mr-2.5">
                    <Clock size={16} color="#3b82f6" />
                </View>
                <Text className="text-lg font-black text-gray-900 tracking-tight">Tiến trình</Text>
            </View>

            <View className="relative">
                {/* Left Indicator Overlay gray */}
                <Animated.View 
                    style={leftIndicatorStyle}
                    pointerEvents="none"
                    className="absolute left-0 top-0 bottom-0 w-10 z-20 flex-row items-center pl-1"
                >
                    <View className="absolute inset-0 bg-gray-200/80 rounded-r-xl" />
                    <ChevronLeft size={20} color="#3b82f6" />
                </Animated.View>

                {/* Right Indicator Overlay */}
                <Animated.View 
                    style={rightIndicatorStyle}
                    pointerEvents="none"
                    className="absolute right-0 top-0 bottom-0 w-10 z-20 flex-row items-center justify-end pr-1"
                >
                    <View className="absolute inset-0 bg-gray-200/80 rounded-l-xl" />
                    <ChevronRight size={20} color="#3b82f6" />
                </Animated.View>

                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    // contentContainerStyle={{ paddingHorizontal: 20 }}
                    onScroll={(event) => {
                        scrollX.value = event.nativeEvent.contentOffset.x;
                    }}
                    onLayout={(event) => {
                        setContainerWidth(event.nativeEvent.layout.width);
                    }}
                    onContentSizeChange={(w) => {
                        setContentWidth(w);
                    }}
                    scrollEventThrottle={16}
                >
                    {steps.map((step, index) => {
                        const isDone = index < flowIndex || (step.key === "completed" && taskDetail.status === "completed");
                        const isCurrent = index === flowIndex;
                        const isLast = index === steps.length - 1;
                        const isPassed = index < flowIndex;

                        return (
                            <View key={step.key} className="items-center" style={{ width: 130 }}>
                                {/* Line & Dot Container */}
                                <View className="flex-row items-center w-full mb-3">
                                    {/* Left Line */}
                                    <View 
                                        className={`flex-1 h-[3px] rounded-full ${index === 0 ? 'bg-transparent' : (isDone ? 'bg-green-500' : 'bg-gray-100')}`} 
                                    />
                                    
                                    {/* Dot Icon */}
                                    <View className={`z-10 w-9 h-9 rounded-full items-center justify-center border-4 ${
                                        isCurrent ? 'bg-blue-600 border-blue-100' : 
                                        isDone ? 'bg-green-500 border-green-50' : 
                                        'bg-white border-gray-100'
                                    }`}>
                                        {isDone || isCurrent ? (
                                            <CheckCircle2 color="white" size={18} strokeWidth={3} />
                                        ) : (
                                            <CircleDashed color="#d1d5db" size={18} />
                                        )}
                                    </View>

                                    {/* Right Line */}
                                    <View 
                                        className={`flex-1 h-[3px] rounded-full ${isLast ? 'bg-transparent' : (isPassed ? 'bg-green-500' : 'bg-gray-100')}`} 
                                    />
                                </View>

                                {/* Text labels */}
                                <View className="items-center px-1">
                                    <Text className={`text-xs text-center font-black uppercase tracking-tighter mb-1 ${
                                        isCurrent ? 'text-blue-600' : isDone ? 'text-gray-900' : 'text-gray-400'
                                    }`}>
                                        {step.label}
                                    </Text>
                                    <Text className={`text-[10px] text-center font-bold ${
                                        isCurrent ? 'text-blue-500/70' : 'text-gray-400'
                                    }`}>
                                        {step.time ? new Date(step.time).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                                    </Text>
                                    {step.time && (
                                        <Text className="text-[9px] text-gray-300 font-medium mt-0.5">
                                            {new Date(step.time).toLocaleDateString("vi-VN")}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </View>
    );
}
