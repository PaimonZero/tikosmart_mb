import React from "react";
import { Text, View } from "react-native";
import { CheckCircle2, XCircle, Clock, User, Calendar, MessageSquare } from "lucide-react-native";

interface TaskReviewInfoProps {
    review: {
        result: "pending" | "confirmed" | "rejected";
        reviewerName?: string;
        reason?: string;
        updatedAt?: string;
        [key: string]: any;
    };
}

export default function TaskReviewInfo({ review }: TaskReviewInfoProps) {
    const getStatusConfig = (result: string) => {
        switch (result) {
            case "confirmed":
                return { 
                    label: "ĐÃ DUYỆT", 
                    color: "text-green-700", 
                    bg: "bg-green-50", 
                    border: "border-green-200",
                    accent: "bg-green-600",
                    icon: <CheckCircle2 size={32} color="#15803d" />
                };
            case "rejected":
                return { 
                    label: "TỪ CHỐI", 
                    color: "text-red-700", 
                    bg: "bg-red-50", 
                    border: "border-red-200",
                    accent: "bg-red-600",
                    icon: <XCircle size={32} color="#b91c1c" />
                };
            default:
                return { 
                    label: "CHỜ DUYỆT", 
                    color: "text-orange-700", 
                    bg: "bg-orange-50", 
                    border: "border-orange-200",
                    accent: "bg-orange-600",
                    icon: <Clock size={32} color="#c2410c" />
                };
        }
    };

    const statusConfig = getStatusConfig(review.result);
    return (
        <View className={`mx-4 mt-4 ${statusConfig.bg} rounded-3xl border ${statusConfig.border} shadow-sm overflow-hidden`}>
            {/* Top Accent Bar */}
            <View className={`h-1.5 ${statusConfig.accent} w-full`} />

            <View className="p-5">
                {/* Status Hero Section */}
                <View className="items-center mb-6">
                    <View className="mb-2">
                        {statusConfig.icon}
                    </View>
                    <Text className={`text-xl font-black tracking-tighter ${statusConfig.color}`}>
                        {statusConfig.label}
                    </Text>
                    {review.updatedAt && (
                        <Text className="text-gray-400 text-xs mt-1">
                            Cập nhật lúc {new Date(review.updatedAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    )}
                </View>

                {/* Details Section */}
                <View className="bg-white/60 p-4 rounded-2xl border border-white/80 gap-y-4">
                    {/* Reviewer & Date */}
                    <View className="flex-row items-center justify-between border-b border-gray-100 pb-3">
                        <View className="flex-row items-center flex-1">
                            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                                <User size={16} color="#4b5563" />
                            </View>
                            <View className="ml-3">
                                <Text className="text-[10px] text-gray-400 font-bold uppercase">Người duyệt</Text>
                                <Text className="text-sm text-gray-800 font-semibold">{review.reviewerName || "Chưa xác định"}</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-[10px] text-gray-400 font-bold uppercase text-right">Ngày</Text>
                            <Text className="text-xs text-gray-600 font-medium">
                                {review.updatedAt ? new Date(review.updatedAt).toLocaleDateString("vi-VN") : "--/--/----"}
                            </Text>
                        </View>
                    </View>

                    {/* Note/Reason */}
                    <View>
                        <View className="flex-row items-center mb-2">
                            <MessageSquare size={14} color="#6b7280" />
                            <Text className="ml-2 text-[10px] text-gray-400 font-bold uppercase">Ghi chú từ Supervisor</Text>
                        </View>
                        <View className="bg-white p-3 rounded-xl border border-gray-50 shadow-inner">
                            <Text className="text-sm text-gray-700 leading-5 italic">
                                "{review.reason || "Không có ghi chú nào được để lại."}"
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
