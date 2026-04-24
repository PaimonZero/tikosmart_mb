import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getRevenueTimeline, RevenueParams } from "@/store/dashboardSlice";

const screenWidth = Dimensions.get("window").width - 32;

interface Props {
    filter: "week" | "month" | "year";
}

const formatVND = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return `${v}`;
};

const weekMap: Record<string, string> = {
    "Thứ 2": "T2",
    "Thứ 3": "T3",
    "Thứ 4": "T4",
    "Thứ 5": "T5",
    "Thứ 6": "T6",
    "Thứ 7": "T7",
    "Chủ nhật": "CN",
};

export default function RevenueChart({ filter }: Props) {
    const [data, setData] = useState<{ label: string; revenue: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const now = new Date();
                let params: RevenueParams = { filter, year: now.getFullYear() };
                if (filter === "month") params.month = now.getMonth() + 1;
                if (filter === "week") {
                    const start = new Date(now.getFullYear(), 0, 1);
                    const diff = Math.floor((now.getTime() - start.getTime()) / 86400000);
                    params.week = Math.ceil((diff + start.getDay() + 1) / 7);
                }
                const res = await getRevenueTimeline(params);
                setData(res);
            } catch {
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [filter]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="small" color="#1890ff" />
            </View>
        );
    }

    if (!data.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.empty}>Không có dữ liệu</Text>
            </View>
        );
    }

    const formatLabel = (label: string, filterType: string) => {
        if (filterType === "week") return weekMap[label] || label;
        if (filterType === "year") return label.replace("Tháng ", "T");
        if (filterType === "month") return label.replace("Tuần ", "W");
        return label;
    };

    const chartData = data.map((d) => ({
        value: d.revenue,
        label: formatLabel(d.label, filter),
        frontColor: "#1890ff",
        gradientColor: "#69c0ff",
    }));

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Doanh thu bán hàng</Text>
            <View style={{ alignItems: "center" }}>
                <BarChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={200}
                    barWidth={filter === "year" ? 16 : ((filter === "month") ? 24 : 26)}
                    spacing={filter === "year" ? 10 : ((filter === "month") ? 30 : 18)}
                    initialSpacing={10}
                    roundedTop
                    xAxisLabelTextStyle={{ fontSize: 10, color: "#8c8c8c", textAlign: "center" }}
                    yAxisTextStyle={{ fontSize: 10, color: "#8c8c8c" }}
                    noOfSections={4}
                    hideRules
                    yAxisThickness={0}
                    xAxisThickness={1}
                    xAxisColor="#e8ecf1"
                    disablePress
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 16,
        marginTop: 8,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    title: { fontSize: 15, fontWeight: "700", marginBottom: 16, color: "#1a1a2e" },
    center: { height: 200, justifyContent: "center", alignItems: "center" },
    empty: { color: "#999", fontSize: 14 },
});