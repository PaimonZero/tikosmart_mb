import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import DashboardService from "@/services/dashboardService";

interface DeliveryOrder {
    key: string;
    code: string;
    shipper: string;
    supervisor: string;
    status: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    "Đã phân công": { bg: "#fff7e6", text: "#fa8c16" },
    "Đang giao": { bg: "#e6f7ff", text: "#1890ff" },
    "Hoàn thành": { bg: "#f6ffed", text: "#52c41a" },
    "Giao thất bại": { bg: "#fff1f0", text: "#f5222d" },
    "Đã hủy": { bg: "#fff1f0", text: "#f5222d" },
};

const STATUS_MAP: Record<string, string> = {
    assigned: "Đã phân công",
    in_progress: "Đang giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    failed: "Giao thất bại",
};

export default function DeliveryOrdersTable() {
    const [data, setData] = useState<DeliveryOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await DashboardService.getShipperOrderDeliveryDetail();
                if (res.success && Array.isArray(res.data)) {
                    const mapped = res.data.map((item: any) => ({
                        key: item.orderNo || String(item.id),
                        code: item.orderNo || `#${item.id}`,
                        shipper: item.shipper || "-",
                        supervisor: item.supervisor || "-",
                        status: STATUS_MAP[item.deliveryStatus] || item.deliveryStatus || "Đã phân công",
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
                <Text style={styles.title}>Đơn hàng đang giao</Text>
                <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>
            </View>
        );
    }

    if (!data.length) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Đơn hàng đang giao</Text>
                <View style={styles.center}><Text style={styles.empty}>Chưa có đơn nào</Text></View>
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: DeliveryOrder; index: number }) => {
        const sc = STATUS_COLORS[item.status] || STATUS_COLORS["Đã phân công"];

        return (
            <View style={[styles.row, index % 2 === 0 && styles.rowEven]}>
                <View style={styles.rowTop}>
                    <Text style={styles.orderCode}>{item.code}</Text>
                    <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                        <Text style={[styles.badgeText, { color: sc.text }]}>{item.status}</Text>
                    </View>
                </View>
                <Text style={styles.shipper}>Shipper: {item.shipper}</Text>
                <Text style={styles.supervisor}>Giám sát: {item.supervisor}</Text>
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Đơn hàng đang giao</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.key}
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
    rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    orderCode: { fontSize: 13, fontWeight: "700", color: "#1890ff" },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    badgeText: { fontSize: 11, fontWeight: "600" },
    shipper: { fontSize: 12, fontWeight: "500", color: "#1a1a2e", marginBottom: 2 },
    supervisor: { fontSize: 11, color: "#8c8c8c" },
});
