import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { getPaymentStatusData } from "@/store/dashboardRoleSlices";

interface PaymentItem {
    type: string;
    value: number;
    color: string;
}

export default function PaymentStatusPie() {
    const [data, setData] = useState<PaymentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const result = await getPaymentStatusData();
                setData(result);
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
                <Text style={styles.title}>Tỷ lệ Thu / Chi</Text>
                <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>
            </View>
        );
    }

    if (!data.length) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Tỷ lệ Thu / Chi</Text>
                <View style={styles.center}><Text style={styles.empty}>Không có dữ liệu</Text></View>
            </View>
        );
    }

    const total = data.reduce((s, d) => s + d.value, 0);

    const formatMoney = (val: number) => {
        if (val >= 1000000000) return `${(val / 1000000000).toFixed(2)} Tỷ`;
        if (val >= 1000000) return `${(val / 1000000).toFixed(2)} Tr`;
        return val.toLocaleString("vi-VN");
    };

    const pieData = data.map((d) => ({
        value: d.value,
        color: d.color,
        text: total > 0 ? `${Math.round((d.value / total) * 100)}%` : "0%",
        textColor: "#fff",
        textSize: 11,
        shiftTextX: -6,
    }));

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Tỷ lệ Thu / Chi</Text>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
                <PieChart
                    data={pieData}
                    donut
                    showText
                    textColor="white"
                    radius={95}
                    innerRadius={55}
                    textSize={11}
                    centerLabelComponent={() => (
                        <View style={{ alignItems: "center" }}>
                            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1a1a2e" }}>{formatMoney(total)}</Text>
                            <Text style={{ fontSize: 10, color: "#8c8c8c" }}>tổng</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.legend}>
                {data.map((item) => (
                    <View key={item.type} style={styles.legendRow}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>{item.type}: {formatMoney(item.value)}</Text>
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
    legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
    legendRow: { flexDirection: "row", alignItems: "center", marginRight: 8, marginBottom: 6 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
    legendText: { fontSize: 12, color: "#595959" },
});
