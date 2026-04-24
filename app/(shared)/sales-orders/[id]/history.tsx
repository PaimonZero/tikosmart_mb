import { useAppSelector } from "@/store/hooks";
import { SalesOrder } from "@/store/salesOrdersSlice";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ArrowLeft,
    Bike,
    CheckCircle2,
    ClipboardCheck,
    FileText,
    Hourglass,
    PackageCheck,
    ShieldCheck,
    Truck,
    Users,
    XCircle,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_FLOW = [
    "draft",
    "pending_preparation",
    "assigned_preparation",
    "confirmed",
    "prepared",
    "delivering",
    "delivered",
    "completed",
] as const;

const STATUS_LABELS: Record<string, string> = {
    draft: "Nháp",
    pending_preparation: "Chờ chuẩn bị",
    assigned_preparation: "Đang phân công",
    confirmed: "Xác nhận",
    prepared: "Chờ giao hàng",
    delivering: "Đang giao",
    delivered: "Đã giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<string, string> = {
    draft: "#9CA3AF",
    pending_preparation: "#F59E0B",
    assigned_preparation: "#3B82F6",
    confirmed: "#6366F1",
    prepared: "#14B8A6",
    delivering: "#8B5CF6",
    delivered: "#22C55E",
    completed: "#10B981",
    cancelled: "#EF4444",
};

// Map each status to a Lucide icon component
const STATUS_ICONS: Record<string, React.ElementType> = {
    draft: FileText,
    pending_preparation: Hourglass,
    assigned_preparation: Users,
    confirmed: ShieldCheck,
    prepared: ClipboardCheck,
    delivering: Truck,
    delivered: PackageCheck,
    completed: CheckCircle2,
    cancelled: XCircle,
};

const formatDate = (d?: string | null) =>
    d ? dayjs(d).format("HH:mm DD/MM/YYYY") : "";

const getStepTime = (key: string, stepIndex: number, currentStepIndex: number, o: any): string => {
    if (key === "draft") return formatDate(o?.createdAt);
    if (key === "prepared" && o?.preparedAt) return formatDate(o.preparedAt);
    if (key === "delivered" && o?.deliveredAt) return formatDate(o.deliveredAt);
    if (key === "completed" && o?.completedAt) return formatDate(o.completedAt);
    const inBetween = ["pending_preparation", "assigned_preparation", "confirmed", "delivering"];
    if (inBetween.includes(key) && stepIndex === currentStepIndex) return formatDate(o?.updatedAt);
    return "";
};

interface TimelineItemProps {
    label: string;
    time?: string;
    IconComponent: React.ElementType;
    color: string;
    stepStatus: "finish" | "process" | "wait" | "error";
    isLast: boolean;
}

const TimelineItem = ({ label, time, IconComponent, color, stepStatus, isLast }: TimelineItemProps) => {
    const isActive = stepStatus === "finish" || stepStatus === "process" || stepStatus === "error";
    const dotColor = stepStatus === "error" ? "#EF4444" : isActive ? color : "#E5E7EB";
    const iconColor = isActive ? dotColor : "#D1D5DB";

    return (
        <View className="flex-row items-stretch">
            <View className="items-center mr-4" style={{ width: 40 }}>
                <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    backgroundColor: isActive ? dotColor + "22" : "#F3F4F6",
                    borderWidth: 2, borderColor: dotColor,
                    alignItems: "center", justifyContent: "center",
                }}>
                    <IconComponent size={18} color={iconColor} />
                </View>
                {!isLast && (
                    <View style={{
                        width: 2, flex: 1, minHeight: 24,
                        backgroundColor: stepStatus === "finish" ? color : "#E5E7EB",
                        marginVertical: 3,
                    }} />
                )}
            </View>
            <View className="flex-1 pb-5 pt-2">
                <Text className={`font-semibold text-sm ${isActive ? "text-gray-800" : "text-gray-400"}`}>
                    {label}
                </Text>
                {!!time && <Text className="text-gray-400 text-xs mt-0.5">{time}</Text>}
            </View>
        </View>
    );
};

export default function SalesOrderHistoryScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { salesOrdersById } = useAppSelector((state) => state.salesOrders);
    const order = (salesOrdersById as SalesOrder)?.id === id ? (salesOrdersById as SalesOrder) : null;
    const o = order as any;

    const currentStatus = o?.status || "draft";
    const isCancelled = currentStatus === "cancelled";
    const currentStepIndex = isCancelled ? -1 : STATUS_FLOW.indexOf(currentStatus as any);

    const getStepStatus = (key: string, idx: number): "finish" | "process" | "wait" | "error" => {
        if (isCancelled) {
            if (key === "draft" && o?.createdAt) return "finish";
            if (key === "prepared" && o?.preparedAt) return "finish";
            if (key === "delivered" && o?.deliveredAt) return "finish";
            if (key === "completed" && o?.completedAt) return "finish";
            return "wait";
        }
        if (idx < currentStepIndex) return "finish";
        if (idx === currentStepIndex) return "process";
        return "wait";
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
            {/* Header */}
            <View className="bg-gray-200 px-4 py-4 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-gray-800 font-medium text-lg">Lịch sử đơn hàng</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {o?.orderNo && (
                    <Text className="text-gray-500 text-sm mb-4 text-center">{o.orderNo}</Text>
                )}
                <View className="bg-white rounded-2xl p-5"
                    style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
                >
                    {STATUS_FLOW.map((key, idx) => {
                        const isLast = !isCancelled && idx === STATUS_FLOW.length - 1;
                        return (
                            <TimelineItem
                                key={key}
                                label={STATUS_LABELS[key]}
                                time={getStepTime(key, idx, currentStepIndex, o)}
                                IconComponent={STATUS_ICONS[key]}
                                color={STATUS_COLORS[key]}
                                stepStatus={getStepStatus(key, idx)}
                                isLast={isLast}
                            />
                        );
                    })}
                    {isCancelled && (
                        <TimelineItem
                            label={STATUS_LABELS["cancelled"]}
                            time={formatDate(o?.updatedAt)}
                            IconComponent={STATUS_ICONS["cancelled"]}
                            color={STATUS_COLORS["cancelled"]}
                            stepStatus="error"
                            isLast
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
