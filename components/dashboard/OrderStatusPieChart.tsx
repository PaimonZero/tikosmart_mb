import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import DashboardService from "@/services/dashboardService";

const STATUS_COLORS: Record<string, string> = {
    "Nháp": "#bfbfbf",
    "Chờ xác nhận": "#ffc53d",
    "Đang chuẩn bị": "#40a9ff",
    "Đang giao": "#597ef7",
    "Hoàn thành": "#73d13d",
    "Đã hủy": "#ff4d4f",
};

interface PieItem {
    type: string;
    value: number;
    color: string;
}

export default function OrderStatusPieChart() {
    const [data, setData] = useState<PieItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await DashboardService.getAdminOrderStatus();
                if (res.success && res.data) {
                    const d = res.data;
                    const mapped: PieItem[] = [
                        { type: "Nháp", value: d.draft || 0, color: STATUS_COLORS["Nháp"] },
                        { type: "Chờ xác nhận", value: d.pending || 0, color: STATUS_COLORS["Chờ xác nhận"] },
                        { type: "Đang chuẩn bị", value: d.preparing || 0, color: STATUS_COLORS["Đang chuẩn bị"] },
                        { type: "Đang giao", value: d.shipping || 0, color: STATUS_COLORS["Đang giao"] },
                        { type: "Hoàn thành", value: d.completed || 0, color: STATUS_COLORS["Hoàn thành"] },
                        { type: "Đã hủy", value: d.cancelled || 0, color: STATUS_COLORS["Đã hủy"] },
                    ].filter((i) => i.value > 0);
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
        return <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>;
    }

    if (!data.length) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Trạng thái đơn hàng</Text>
                <View style={styles.center}><Text style={styles.empty}>Không có dữ liệu</Text></View>
            </View>
        );
    }

    const total = data.reduce((s, d) => s + d.value, 0);
    const pieData = data.map((d) => {
        const percent = (d.value / total) * 100;

        return {
            value: d.value,
            color: d.color,
            text: percent >= 10 ? `${Math.round((d.value / total) * 100)}%` : "",
            textColor: "#fff",
            textSize: 11,
            shiftTextX: -8,
        };
    });

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Trạng thái đơn hàng</Text>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
                <PieChart
                    data={pieData}
                    donut
                    showText
                    textColor="white"
                    radius={100}
                    innerRadius={55}
                    textSize={11}
                    centerLabelComponent={() => (
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 18, fontWeight: "700", color: "#1a1a2e" }}>{total}</Text>
                            <Text style={{ fontSize: 10, color: "#8c8c8c" }}>đơn hàng</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.legend}>
                {data.map((item) => (
                    <View key={item.type} style={styles.legendRow}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>{item.type}: {item.value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    title: { fontSize: 15, fontWeight: "700", marginBottom: 16, color: "#1a1a2e" },
    center: { height: 120, justifyContent: "center", alignItems: "center" },
    empty: { color: "#999", fontSize: 14 },
    legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
    legendRow: { flexDirection: "row", alignItems: "center", marginRight: 8, marginBottom: 6 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
    legendText: { fontSize: 12, color: "#595959" },
});
