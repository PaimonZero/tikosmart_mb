import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import DashboardService from "@/services/dashboardService";

interface OrderItem {
    taskId: number;
    name: string;
    items: number;
    quantity: number;
    status: string;
    cancelReason: string;
    supervisor: string;
}

export default function ErrorOrdersTable() {
    const [data, setData] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await DashboardService.getOrderPickerAssigned();
                if (res.success && Array.isArray(res.data)) {
                    const mapped = res.data
                        .filter((o: any) => o.taskStatus === "cancelled")
                        .slice(0, 5)
                        .map((o: any) => ({
                            taskId: o.taskId,
                            name: (o.orderNo && o.orderNo.length > 20) ? `#${o.taskId}` : (o.orderNo || `#${o.taskId}`),
                            items: parseInt(o.totalItems) || 0,
                            quantity: parseFloat(o.totalQuantity) || 0,
                            status: "Gặp lỗi",
                            cancelReason: o.cancelReason || "-",
                            supervisor: o.supervisorName || "-",
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
                <Text style={styles.title}>Đơn gặp lỗi / cần xử lý</Text>
                <View style={styles.center}><ActivityIndicator size="small" color="#f5222d" /></View>
            </View>
        );
    }

    if (!data.length) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Đơn gặp lỗi / cần xử lý</Text>
                <View style={styles.center}><Text style={styles.empty}>Không có đơn nào</Text></View>
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: OrderItem; index: number }) => {
        return (
            <View style={[styles.row, index % 2 === 0 && styles.rowEven]}>
                <View style={styles.rowTop}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.rowBottom}>
                    <Text style={styles.supervisor}>Giám sát: {item.supervisor}</Text>
                    <Text style={styles.meta}>{item.items} món • SL: {item.quantity}</Text>
                </View>
                <Text style={styles.reason} numberOfLines={1}>Lý do: {item.cancelReason}</Text>
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Đơn gặp lỗi / cần xử lý</Text>
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
    title: { fontSize: 16, fontWeight: "700", marginBottom: 12, color: "#1a1a2e" },
    center: { height: 100, justifyContent: "center", alignItems: "center" },
    empty: { color: "#999", fontSize: 13 },
    row: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 4,
    },
    rowEven: { backgroundColor: "#fff1f0" },
    rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
    rowBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
    name: { fontSize: 14, fontWeight: "700", color: "#f5222d" },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: "#ffccc7" },
    badgeText: { fontSize: 12, fontWeight: "600", color: "#cf1322" },
    meta: { fontSize: 12, color: "#595959" },
    supervisor: { fontSize: 12, color: "#595959" },
    reason: { fontSize: 13, color: "#cf1322", fontStyle: "italic", marginTop: 4 },
});
