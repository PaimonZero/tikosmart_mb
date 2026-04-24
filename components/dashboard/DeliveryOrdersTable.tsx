import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";

interface DeliveryOrder {
    key: string;
    code: string;
    customer: string;
    status: string;
    address: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    "Đã phân công": { bg: "#fff7e6", text: "#fa8c16" },
    "Đang giao": { bg: "#e6f7ff", text: "#1890ff" },
    "Hoàn thành": { bg: "#f6ffed", text: "#52c41a" },
    "Giao thất bại": { bg: "#fff1f0", text: "#f5222d" },
};

// Mock data — chờ API riêng cho shipper
const mockDeliveryOrders: DeliveryOrder[] = [
    { key: "1", code: "#DLV-1001", customer: "Nguyễn Văn A", status: "Đang giao", address: "123 Lê Lợi, Q.1" },
    { key: "2", code: "#DLV-1002", customer: "Trần Thị B", status: "Đã phân công", address: "456 Nguyễn Huệ, Q.1" },
    { key: "3", code: "#DLV-1003", customer: "Lê Văn C", status: "Hoàn thành", address: "789 Hai Bà Trưng, Q.3" },
    { key: "4", code: "#DLV-1004", customer: "Phạm Văn D", status: "Đang giao", address: "101 Võ Văn Tần, Q.3" },
    { key: "5", code: "#DLV-1005", customer: "Hoàng Thị E", status: "Giao thất bại", address: "202 Cách Mạng Tháng 8, Q.10" },
];

export default function DeliveryOrdersTable() {
    const [data, setData] = useState<DeliveryOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call with mock data
        setTimeout(() => {
            setData(mockDeliveryOrders);
            setLoading(false);
        }, 500);
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
                <Text style={styles.customer}>{item.customer}</Text>
                <Text style={styles.address} numberOfLines={1}>📍 {item.address}</Text>
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
    customer: { fontSize: 12, fontWeight: "500", color: "#1a1a2e", marginBottom: 2 },
    address: { fontSize: 11, color: "#8c8c8c" },
});
