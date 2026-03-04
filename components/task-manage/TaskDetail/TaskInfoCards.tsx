import { Calendar, FileText, Forklift, MapPin, NotepadText, Phone, ShoppingCart, User, Users } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface TaskInfoCardsProps {
    taskDetail: any;
    orderDetail: any;
}

export default function TaskInfoCards({ taskDetail, orderDetail }: TaskInfoCardsProps) {
    if (!taskDetail) return null;

    return (
        <View className="mx-4 mt-4 space-y-5">
            {/* Thẻ Thông tin Nhiệm vụ */}
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-5 border-b border-gray-100 pb-3">
                    <FileText color="#3b82f6" size={22} />
                    <Text className="text-lg font-bold text-gray-900 ml-2">Thông tin nhiệm vụ</Text>
                </View>

                <View>
                    <View className="flex-row justify-between items-center py-3 border-b border-gray-50">
                        <Text className="text-base text-gray-500">Người giám sát</Text>
                        <View className="flex-row items-center">
                            <User size={18} color="#4b5563" />
                            <Text className="text-base ml-2 font-bold text-gray-800">{taskDetail.supervisorName || "Không có"}</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center py-3 border-b border-gray-50">
                        <Text className="text-base text-gray-500">Người đóng gói</Text>
                        <View className="flex-row items-center">
                            <Users size={18} color="#4b5563" />
                            <Text className="text-base ml-2 font-bold text-gray-800">{taskDetail.packerName || "Không có"}</Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center py-3">
                        <Text className="text-base text-gray-500">Hạn chót</Text>
                        <View className="flex-row items-center">
                            <Calendar size={18} color="#4b5563" />
                            <Text className="text-base ml-2 font-bold text-gray-800">
                                {taskDetail.deadline ? new Date(taskDetail.deadline).toLocaleString("vi-VN") : "—"}
                            </Text>
                        </View>
                    </View>

                    {taskDetail.note && (
                        <View className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <Text className="text-sm text-gray-500 mb-2 font-medium"><NotepadText size={18} color="#4b5563" /> Ghi chú nhiệm vụ:</Text>
                            <Text className="text-base text-gray-800 leading-7">{taskDetail.note}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Thẻ Thông tin Đơn hàng */}
            <View className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-5 border-b border-gray-100 pb-3">
                    <ShoppingCart color="#f59e0b" size={22} />
                    <Text className="text-lg font-bold text-gray-900 ml-2">Thông tin đơn hàng</Text>
                </View>

                {orderDetail ? (
                    <View>
                        <View className="flex-row justify-between items-center py-3 border-b border-gray-50">
                            <Text className="text-base text-gray-500">Khách hàng</Text>
                            <Text className="text-base font-bold text-gray-800">{orderDetail.customerName || "Không có"}</Text>
                        </View>

                        <View className="flex-row justify-between items-center py-3 border-b border-gray-50">
                            <Text className="text-base text-gray-500">Số điện thoại</Text>
                            <View className="flex-row items-center">
                                <Phone size={18} color="#4b5563" />
                                <Text className="text-base ml-2 font-bold text-gray-800">{orderDetail.phone || "—"}</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-start py-3 border-b border-gray-50">
                            <Text className="text-base text-gray-500 mr-6">Địa chỉ giao</Text>
                            <View className="flex-row items-start flex-1 justify-end">
                                <MapPin size={18} color="#4b5563" />
                                <Text className="text-base ml-2 font-bold text-gray-800 text-right leading-7">
                                    {orderDetail.address || "—"}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center py-3">
                            <Text className="text-base text-gray-500">Kho giao hàng</Text>
                            <View className="flex-row items-start flex-1 justify-end">
                                <Forklift size={18} color="#4b5563" />
                                <Text className="text-base ml-2 font-bold text-gray-800 text-right leading-7">
                                    {orderDetail.departmentName || "—"}
                                </Text>
                            </View>
                        </View>

                        {orderDetail.note && (
                            <View className="mt-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                                <Text className="text-sm text-yellow-700 font-medium mb-2"><NotepadText size={18} color="#f59e0b" /> Ghi chú đơn hàng:</Text>
                                <Text className="text-base text-yellow-800 leading-7">{orderDetail.note}</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <Text className="text-base text-gray-500 italic text-center py-4">Không có thông tin đơn hàng đính kèm</Text>
                )}
            </View>
        </View>
    );
}
