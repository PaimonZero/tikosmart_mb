import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getMonthlyTransactionData } from "@/store/dashboardRoleSlices";

interface CashFlowItem {
    date: string;
    moneyIn: number;
    moneyOut: number;
}

const screenWidth = Dimensions.get("window").width - 32;

const formatMoney = (v: number) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}tỷ`;
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}tr`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
    return `${v}`;
};

export default function CashFlowChart() {
    const [rawData, setRawData] = useState<CashFlowItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const now = new Date();
            const data = await getMonthlyTransactionData(now.getMonth() + 1, now.getFullYear());
            setRawData(data as CashFlowItem[]);
            setLoading(false);
        };
        load();
    }, []);

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>;
    }

    const chartData: any[] = [];
    rawData.forEach((d) => {
        const month = d.date.split("-")[1];
        chartData.push({
            value: d.moneyIn,
            label: `T${parseInt(month)}`,
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: "#8c8c8c", fontSize: 10 },
            frontColor: "#40a9ff"
        });
        chartData.push({
            value: d.moneyOut,
            frontColor: "#ff7875"
        });
    });

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Dòng tiền vào – ra</Text>
            <View style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: "#40a9ff" }]} />
                <Text style={styles.legendText}>Tiền vào</Text>
                <View style={[styles.dot, { backgroundColor: "#ff7875", marginLeft: 16 }]} />
                <Text style={styles.legendText}>Tiền ra</Text>
            </View>
            {rawData.length === 0 ? (
                <View style={styles.center}><Text style={styles.empty}>Không có dữ liệu</Text></View>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <BarChart
                        data={chartData}
                        width={Math.max(screenWidth, rawData.length * 60)}
                        height={200}
                        barWidth={14}
                        spacing={20}
                        roundedTop
                        hideRules
                        xAxisThickness={1}
                        xAxisColor="#e8ecf1"
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: "#8c8c8c", fontSize: 10 }}
                        noOfSections={4}
                    />
                </ScrollView>
            )}
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
    title: { fontSize: 15, fontWeight: "700", marginBottom: 8, color: "#1a1a2e" },
    center: { height: 120, justifyContent: "center", alignItems: "center" },
    empty: { color: "#999", fontSize: 13 },
    legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
    legendText: { fontSize: 12, color: "#595959" },
});
