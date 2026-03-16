import { Calendar, ChevronDown, FileText, Forklift, MapPin, NotepadText, Phone, ShoppingCart, User, Users } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, FadeIn, FadeOut, LinearTransition, useAnimatedStyle, withSpring } from "react-native-reanimated";

interface TaskInfoCardsProps {
    taskDetail: any;
    orderDetail: any;
}

export default function TaskInfoCards({ taskDetail, orderDetail }: TaskInfoCardsProps) {
    const [isTaskVisible, setIsTaskVisible] = useState(true);
    const [isOrderVisible, setIsOrderVisible] = useState(false);

    // Spring configuration for fluid motion
    const springConfig = {
        damping: 18,
        stiffness: 120,
        mass: 0.9,
    };

    const taskIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: withSpring(isTaskVisible ? "180deg" : "0deg", springConfig) }],
        };
    });

    const orderIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: withSpring(isOrderVisible ? "180deg" : "0deg", springConfig) }],
        };
    });

    if (!taskDetail) return null;

    return (
        <View className="mt-2 gap-2">
            {/* Thẻ Thông tin Nhiệm vụ */}
            <View className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => setIsTaskVisible(!isTaskVisible)}
                    className="flex-row items-center justify-between p-5"
                >
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                            <FileText color="#3b82f6" size={20} />
                        </View>
                        <Text className="text-base font-bold text-gray-900">Thông tin nhiệm vụ</Text>
                    </View>
                    <Animated.View style={taskIconStyle}>
                        <ChevronDown size={20} color="#9ca3af" />
                    </Animated.View>
                </TouchableOpacity>

                {isTaskVisible && (
                    <Animated.View 
                        entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} 
                        exiting={FadeOut.duration(200)}
                        layout={LinearTransition.springify().damping(18).stiffness(120).mass(0.9)}
                        className="px-5 pb-5 space-y-4"
                    >
                        <View className="py-1">
                            <Text className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Người giám sát</Text>
                            <View className="flex-row items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                                <User size={18} color="#3b82f6" />
                                <Text className="text-sm ml-2 font-bold text-gray-800">{taskDetail.supervisorName || "Không có"}</Text>
                            </View>
                        </View>

                        <View className="py-1">
                            <Text className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Người đóng gói</Text>
                            <View className="flex-row items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                                <Users size={18} color="#3b82f6" />
                                <Text className="text-sm ml-2 font-bold text-gray-800">{taskDetail.packerName || "Không có"}</Text>
                            </View>
                        </View>

                        <View className="py-1">
                            <Text className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Hạn chót</Text>
                            <View className="flex-row items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                                <Calendar size={18} color="#ef4444" />
                                <Text className="text-sm ml-2 font-bold text-gray-800">
                                    {taskDetail.deadline ? new Date(taskDetail.deadline).toLocaleString("vi-VN") : "—"}
                                </Text>
                            </View>
                        </View>

                        {taskDetail.note && (
                            <View className="mt-2 bg-blue-50/50 p-2 rounded-xl border border-blue-100/50">
                                <Text className="text-sm text-blue-700 mb-2 font-bold flex-row items-center">
                                    <NotepadText size={16} color="#3b82f6" /> Ghi chú nhiệm vụ:
                                </Text>
                                <Text className="text-sm text-gray-800 leading-6">{taskDetail.note}</Text>
                            </View>
                        )}
                    </Animated.View>
                )}
            </View>

            {/* Thẻ Thông tin Đơn hàng */}
            <View className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => setIsOrderVisible(!isOrderVisible)}
                    className="flex-row items-center justify-between p-5"
                >
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-amber-50 items-center justify-center mr-3">
                            <ShoppingCart color="#f59e0b" size={20} />
                        </View>
                        <Text className="text-base font-bold text-gray-900">Thông tin đơn hàng</Text>
                    </View>
                    <Animated.View style={orderIconStyle}>
                        <ChevronDown size={20} color="#9ca3af" />
                    </Animated.View>
                </TouchableOpacity>

                {isOrderVisible && (
                    <Animated.View 
                        entering={FadeIn.duration(400).easing(Easing.out(Easing.quad))} 
                        exiting={FadeOut.duration(200)}
                        layout={LinearTransition.springify().damping(18).stiffness(120).mass(0.9)}
                        className="px-5 pb-5"
                    >
                        {orderDetail ? (
                            <View className="space-y-4">
                                <View className="py-1">
                                    <Text className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Khách hàng</Text>
                                    <View className="flex-row items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                                        <User size={18} color="#f59e0b" />
                                        <Text className="text-sm ml-2 font-bold text-gray-800">{orderDetail.customerName || "Không có"}</Text>
                                    </View>
                                </View>

                                <View className="py-1">
                                    <Text className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Số điện thoại</Text>
                                    <View className="flex-row items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                                        <Phone size={18} color="#f59e0b" />
                                        <Text className="text-sm ml-2 font-bold text-gray-800">{orderDetail.phone || "—"}</Text>
                                    </View>
                                </View>

                                <View className="py-1">
                                    <Text className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Địa chỉ giao</Text>
                                    <View className="flex-row items-start bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                                        <MapPin size={18} color="#f59e0b" className="mt-0.5" />
                                        <Text className="text-sm ml-2 font-bold text-gray-800 flex-1 leading-6">
                                            {orderDetail.address || "—"}
                                        </Text>
                                    </View>
                                </View>

                                <View className="py-1">
                                    <Text className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Kho giao hàng</Text>
                                    <View className="flex-row items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                                        <Forklift size={18} color="#f59e0b" />
                                        <Text className="text-sm ml-2 font-bold text-gray-800 flex-1 leading-6">
                                            {orderDetail.departmentName || "—"}
                                        </Text>
                                    </View>
                                </View>

                                {orderDetail.note && (
                                    <View className="mt-2 bg-amber-50/50 p-2 rounded-xl border border-amber-100/50">
                                        <Text className="text-sm text-amber-700 font-bold mb-2 flex-row items-center">
                                            <NotepadText size={16} color="#f59e0b" /> Ghi chú đơn hàng:
                                        </Text>
                                        <Text className="text-sm text-amber-900 leading-6">{orderDetail.note}</Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <Text className="text-base text-gray-500 italic text-center py-4">Không có thông tin đơn hàng đính kèm</Text>
                        )}
                    </Animated.View>
                )}
            </View>
        </View>
    );
}
