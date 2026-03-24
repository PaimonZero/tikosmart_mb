import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { mockPaymentStatus } from "@/store/dashboardRoleSlices";

export default function PaymentStatusPie() {
    const total = mockPaymentStatus.reduce((s, d) => s + d.value, 0);

    const pieData = mockPaymentStatus.map((d) => ({
        value: d.value,
        color: d.color,
        text: `${Math.round((d.value / total) * 100)}%`,
        textColor: "#fff",
        textSize: 11,
        shiftTextX: -6,
    }));

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Trạng thái thanh toán</Text>
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
                            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1a1a2e" }}>{total}%</Text>
                            <Text style={{ fontSize: 10, color: "#8c8c8c" }}>tổng</Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.legend}>
                {mockPaymentStatus.map((item) => (
                    <View key={item.type} style={styles.legendRow}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>{item.type}: {item.value}%</Text>
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
    legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
    legendRow: { flexDirection: "row", alignItems: "center", marginRight: 8, marginBottom: 6 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
    legendText: { fontSize: 12, color: "#595959" },
});
