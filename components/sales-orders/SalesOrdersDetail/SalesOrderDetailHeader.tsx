import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, ClipboardCheck, FileText, Hourglass, PackageCheck, ShieldCheck, Truck, Users, XCircle } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SalesOrderDetailHeaderProps {
    orderNo?: string;
    status?: string;
}
// add icon from lucide
const getStatusBadge = (status: string) => {
    switch (status) {
        case "draft": return { label: "Phiếu tạm", bg: "bg-gray-100", text: "text-gray-700", icon: FileText, iconColor: "#374151" };
        case "pending_preparation": return { label: "Chờ chuẩn bị", bg: "bg-amber-100", text: "text-amber-700", icon: Hourglass, iconColor: "#B45309" };
        case "assigned_preparation": return { label: "Đang chuẩn bị", bg: "bg-blue-100", text: "text-blue-700", icon: Users, iconColor: "#1D4ED8" };
        case "prepared": return { label: "Đã chuẩn bị", bg: "bg-teal-100", text: "text-teal-700", icon: ClipboardCheck, iconColor: "#0F766E" };
        case "confirmed": return { label: "Đã xác nhận", bg: "bg-indigo-100", text: "text-indigo-700", icon: ShieldCheck, iconColor: "#4338CA" };
        case "delivering": return { label: "Đang giao", bg: "bg-purple-100", text: "text-purple-700", icon: Truck, iconColor: "#7E22CE" };
        case "delivered": return { label: "Đã giao", bg: "bg-green-100", text: "text-green-700", icon: PackageCheck, iconColor: "#15803D" };
        case "completed": return { label: "Hoàn thành", bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle2, iconColor: "#047857" };
        case "cancelled": return { label: "Đã hủy", bg: "bg-red-100", text: "text-red-600", icon: XCircle, iconColor: "#DC2626" };
        default: return { label: status || "—", bg: "bg-gray-100", text: "text-gray-700", icon: FileText, iconColor: "#374151" };
    }
};

export const SalesOrderDetailHeader = ({ orderNo, status }: SalesOrderDetailHeaderProps) => {
    const router = useRouter();
    const badge = getStatusBadge(status || "");

    return (
        <View
            className="bg-gray-200 px-4 py-3 flex-row items-center justify-between"
            style={{ paddingBottom: 14 }}
        >
            {/* Back */}
            <TouchableOpacity onPress={() => router.back()} className="p-1 mr-2">
                <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>

            {/* Order number */}
            <Text className="text-gray-700 font-bold text-lg flex-1" numberOfLines={1}>
                {orderNo || "—"}
            </Text>

            <View className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full ml-2 ${badge.bg}`}>
                <badge.icon size={16} color={badge.iconColor} />
                <Text className={`text-base font-bold ${badge.text}`}>{badge.label}</Text>
            </View>
        </View>
    );
};
