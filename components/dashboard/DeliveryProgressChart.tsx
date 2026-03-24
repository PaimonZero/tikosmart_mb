import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getDeliveryProgress } from "@/store/dashboardRoleSlices";

const screenWidth = Dimensions.get("window").width - 32;

interface ProgressItem {
    status: string;
    value: number;
}

const STATUS_COLORS: Record<string, string> = {
    "Đã phân công": "#ffc53d",
    "Đang giao": "#40a9ff",
    "Hoàn thành": "#73d13d",
};

export default function DeliveryProgressChart() {
    const [data, setData] = useState<ProgressItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await getDeliveryProgress();
            setData(res as ProgressItem[]);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>;
    }

    if (!data.length) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Tiến độ giao hàng</Text>
                <View style={styles.center}><Text style={styles.empty}>Không có dữ liệu</Text></View>
            </View>
        );
    }

    const chartData = data.map((d) => ({
        value: d.value || 0,
        label: d.status.length > 8 ? d.status.substring(0, 8) + "…" : d.status,
        frontColor: STATUS_COLORS[d.status] || "#1890ff",
        topLabelComponent: () => <Text style={{ fontSize: 10, fontWeight: "600", color: "#1a1a2e" }}>{d.value}</Text>
    }));

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Tiến độ giao hàng</Text>
            <View style={{ alignItems: "center" }}>
                <BarChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={180}
                    barWidth={30}
                    spacing={24}
                    roundedTop
                    hideRules
                    xAxisThickness={1}
                    xAxisColor="#e8ecf1"
                    yAxisThickness={0}
                    yAxisTextStyle={{ color: "#8c8c8c", fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: "#8c8c8c", fontSize: 10 }}
                />
            </View>
            <View style={styles.legend}>
                {data.map(d => (
                    <View key={d.status} style={styles.legendRow}>
                        <View style={[styles.dot, { backgroundColor: STATUS_COLORS[d.status] || "#1890ff" }]} />
                        <Text style={styles.legendText}>{d.status}: {d.value}</Text>
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
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    title: { fontSize: 15, fontWeight: "700", marginBottom: 16, color: "#1a1a2e" },
    center: { height: 120, justifyContent: "center", alignItems: "center" },
    empty: { color: "#999", fontSize: 13 },
    legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 16 },
    legendRow: { flexDirection: "row", alignItems: "center" },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
    legendText: { fontSize: 11, color: "#595959" }
});
