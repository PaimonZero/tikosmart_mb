import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface PersonalProgressProps {
    data: any;
}

export default function PersonalProgress({ data }: PersonalProgressProps) {
    if (!data) return null;

    const total = data.totalAssignedToday || 0;
    const completed = data.deliveredSuccess || 0;
    const lateOrders = data.lateOrders || 0;
    const onTime = Math.max(0, completed - lateOrders);

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const onTimePercent = completed > 0 ? Math.round((onTime / completed) * 100) : 0;

    const pieData = [
        { value: percent, color: "#1890ff" },
        { value: Math.max(100 - percent, 0), color: "#e6f4ff" },
    ];

    // If total is 0, we still want to show a base circle (empty)
    if (total === 0) {
        pieData[0].value = 0;
        pieData[1].value = 100;
        pieData[1].color = "#f0f0f0";
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Tiến độ cá nhân trong ca</Text>
            
            <View style={styles.content}>
                <View style={styles.chartContainer}>
                    <PieChart
                        donut
                        innerRadius={60}
                        radius={75}
                        data={pieData}
                        centerLabelComponent={() => (
                            <Text style={styles.percentText}>{percent}%</Text>
                        )}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.primaryText}>
                        {completed}/{total} đơn hoàn thành ({percent}%)
                    </Text>
                    <Text style={styles.secondaryText}>
                        Đúng hạn: {onTime}/{completed} ({onTimePercent}%)
                    </Text>
                </View>
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
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 16, color: "#1a1a2e" },
    content: {
        alignItems: "center",
        justifyContent: "center",
    },
    chartContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    percentText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1890ff",
    },
    textContainer: {
        alignItems: "center",
    },
    primaryText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#262626",
        marginBottom: 4,
    },
    secondaryText: {
        fontSize: 13,
        color: "#8c8c8c",
    },
});
