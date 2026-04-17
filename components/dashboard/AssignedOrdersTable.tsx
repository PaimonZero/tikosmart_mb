import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import DashboardService from "@/services/dashboardService";

interface OrderItem {
    taskId: number;
    name: string;
    items: number;
    quantity: number;
    status: string;
    priority: string;
    deadline: string;
}

const STATUS_MAP: Record<string, string> = {
    'assigned': 'Chờ soạn',
    'in_progress': 'Đang soạn',
    'pending_review': 'Chờ duyệt',
    'completed': 'Đã hoàn thành',
    'cancelled': 'Gặp lỗi',
};

const getPriority = (deadline: string) => {
    if (!deadline) return "Thấp";
    const deadlineTime = new Date(deadline).getTime();
    const now = new Date().getTime();
    const hoursLeft = (deadlineTime - now) / (1000 * 60 * 60);
    if (hoursLeft < 0) return "Khẩn cấp";
    if (hoursLeft < 3) return "Khẩn cấp";
    if (hoursLeft < 6) return "Cao";
    if (hoursLeft < 12) return "Trung bình";
    return "Thấp";
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    "Chờ soạn": { bg: "#f0f0f0", text: "#595959" },
    "Đang soạn": { bg: "#e6f7ff", text: "#1890ff" },
    "Chờ duyệt": { bg: "#fff7e6", text: "#fa8c16" },
    "Gặp lỗi": { bg: "#fff1f0", text: "#f5222d" },
    "Đã hoàn thành": { bg: "#f6ffed", text: "#52c41a" },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
    "Thấp": { bg: "#f0f0f0", text: "#8c8c8c" },
    "Trung bình": { bg: "#e6f7ff", text: "#1890ff" },
    "Cao": { bg: "#fff7e6", text: "#fa8c16" },
    "Khẩn cấp": { bg: "#fff1f0", text: "#f5222d" },
};

export default function AssignedOrdersTable() {
    const [data, setData] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await DashboardService.getOrderPickerAssigned();
                if (res.success && Array.isArray(res.data)) {
                    const mapped = res.data
                        .filter((o: any) => o.taskStatus !== "cancelled")
                        .slice(0, 10)
                        .map((o: any) => ({
                            taskId: o.taskId,
                            name: (o.orderNo && o.orderNo.length > 20) ? `#${o.taskId}` : (o.orderNo || `#${o.taskId}`),
                            items: parseInt(o.totalItems) || 0,
                            quantity: parseFloat(o.totalQuantity) || 0,
                            status: STATUS_MAP[o.taskStatus] || o.taskStatus || "Chờ soạn",
                            priority: getPriority(o.deadline),
                            deadline: o.deadline ? new Date(o.deadline).toLocaleString('vi-VN', {
                                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                            }) : "-",
                        }));
                    setData(mapped);
                }
            } catch {
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Đơn hàng được phân công</Text>
                <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>
            </View>
        );
    }

    if (!data.length) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Đơn hàng được phân công</Text>
                <View style={styles.center}><Text style={styles.empty}>Chưa có đơn nào</Text></View>
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: OrderItem; index: number }) => {
        const sc = STATUS_COLORS[item.status] || STATUS_COLORS["Chờ soạn"];
        const pc = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS["Trung bình"];

        return (
            <View style={[styles.row, index % 2 === 0 && styles.rowEven]}>
                <View style={styles.rowTop}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                        <Text style={[styles.badgeText, { color: sc.text }]}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.rowBottom}>
                    <View style={[styles.badge, { backgroundColor: pc.bg }]}>
                        <Text style={[styles.badgeText, { color: pc.text }]}>{item.priority}</Text>
                    </View>
                    <Text style={styles.meta}>{item.items} món • SL: {item.quantity}</Text>
                    <Text style={styles.deadline}>⏰ {item.deadline}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Đơn hàng được phân công</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.taskId.toString()}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    title: { fontSize: 15, fontWeight: "700", marginBottom: 12, color: "#1a1a2e" },
    center: { height: 100, justifyContent: "center", alignItems: "center" },
    empty: { color: "#999", fontSize: 13 },
    row: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 4,
    },
    rowEven: { backgroundColor: "#f7f9fc" },
    rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    rowBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
    name: { fontSize: 13, fontWeight: "700", color: "#1890ff" },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    badgeText: { fontSize: 11, fontWeight: "600" },
    meta: { fontSize: 11, color: "#595959" },
    deadline: { fontSize: 11, color: "#8c8c8c" },
});
