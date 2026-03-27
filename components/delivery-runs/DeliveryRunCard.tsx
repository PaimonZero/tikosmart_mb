import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getStatusStyles } from "./utils/helpers";

interface DeliveryRunCardProps {
    item: any;
    onPress: (id: string) => void;
    userRole: string;
}

export const DeliveryRunCard = React.memo(({ item, onPress, userRole }: DeliveryRunCardProps) => {
    const statusStyle = getStatusStyles(item.status);
    const dateStr = item.createdAt ? dayjs(item.createdAt).locale("vi").format("HH:mm - DD/MM/YYYY") : "N/A";
    const ordersCount = item.orders?.length || 0;

    return (
        <TouchableOpacity
            className="bg-white rounded-3xl mb-4 shadow-md border border-slate-200 overflow-hidden"
            onPress={() => onPress(item.id)}
            activeOpacity={0.7}
        >
            {/* Top Status Bar */}
            <View className={`h-1.5 ${statusStyle.dot}`} />

            <View className="p-5">
                {/* Header: Seq & Code & Status */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center flex-1">
                        <View className="bg-blue-600 rounded-full w-10 h-10 items-center justify-center mr-3 shadow-sm border border-blue-50">
                            <Text className="text-white font-black text-sm">#{item.dailySeq || "?"}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-extrabold text-lg leading-tight" numberOfLines={1}>
                                Chuyến {item.dailySeq || "N/A"} - {dayjs(item.createdAt).locale("vi").format("DD/MM/YYYY")}
                            </Text>
                            <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                                {item.deliveryNo || "N/A"}
                            </Text>
                        </View>
                    </View>
                    <View className={`px-3 py-1.5 rounded-xl ${statusStyle.bg} border ${statusStyle.border}`}>
                        <Text className={`text-[10px] font-black uppercase tracking-wider ${statusStyle.text}`}>
                            {statusStyle.label}
                        </Text>
                    </View>
                </View>

                {/* Main Information Grid */}
                <View className="space-y-4">
                    {/* Primary Info: Orders & Vehicle */}
                    <View className="flex-row justify-between items-center bg-gray-50 rounded-2xl p-4">
                        <View className="flex-1 border-r border-gray-200">
                            <Text className="text-gray-400 text-[10px] font-bold mb-1 uppercase">Đơn hàng</Text>
                            <View className="flex-row items-center">
                                <Feather name="package" size={16} color="#4B5563" />
                                <Text className="text-gray-900 font-black text-xl ml-2">{ordersCount}</Text>
                            </View>
                        </View>
                        <View className="flex-1 pl-4">
                            <Text className="text-gray-400 text-[10px] font-bold mb-1 uppercase">Biển số xe</Text>
                            <View className="flex-row items-center">
                                <Feather name="truck" size={16} color="#4B5563" />
                                <Text className="text-gray-900 font-bold ml-2">{item.vehicleNo || "N/A"}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Secondary Info: Supervisor & Shipper */}
                    <View className="pt-1 px-1">
                        <View className="flex-row items-center mb-3">
                            <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <Feather name="user-check" size={14} color="#2563EB" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 text-[10px] font-bold uppercase">Giám sát</Text>
                                <Text className="text-gray-800 font-semibold text-sm">
                                    {item.supervisorName || "N/A"}
                                    {item.supervisorPhone && <Text className="text-blue-500 text-xs font-normal"> • {item.supervisorPhone}</Text>}
                                </Text>
                            </View>
                        </View>
                        {userRole !== "shipper" && (
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center mr-3">
                                    <Feather name="user" size={14} color="#EA580C" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-400 text-[10px] font-bold uppercase">Người giao</Text>
                                    <Text className="text-gray-800 font-semibold text-sm">{item.shipperName || "Chưa gán"}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Footer: Date */}
                <View className="pt-4 border-t border-gray-50 flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Feather name="clock" size={12} color="#9CA3AF" />
                        <Text className="text-gray-400 text-[11px] ml-1.5 font-medium">{dateStr}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color="#D1D5DB" />
                </View>
            </View>
        </TouchableOpacity>
    );
});
