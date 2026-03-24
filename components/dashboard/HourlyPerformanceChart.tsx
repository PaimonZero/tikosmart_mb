import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { hourlyPerformance } from "@/store/dashboardRoleSlices";

const screenWidth = Dimensions.get("window").width - 32;

export default function HourlyPerformanceChart() {
    const data = hourlyPerformance;

    const chartData = data.map((d) => ({
        value: d.done,
        label: d.time,
        dataPointText: d.done.toString(),
    }));

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Hiệu suất soạn hàng theo giờ</Text>
            <View style={{ alignItems: "center", marginLeft: -10 }}>
                <LineChart
                    areaChart
                    data={chartData}
                    width={screenWidth - 30}
                    height={180}
                    color="#1890ff"
                    startFillColor="rgba(24, 144, 255, 0.3)"
                    endFillColor="rgba(24, 144, 255, 0.02)"
                    startOpacity={0.8}
                    endOpacity={0.1}
                    spacing={40}
                    thickness={2.5}
                    hideRules
                    yAxisThickness={0}
                    xAxisThickness={1}
                    xAxisColor="#e8ecf1"
                    yAxisTextStyle={{ color: "#8c8c8c", fontSize: 10 }}
                    xAxisLabelTextStyle={{ color: "#8c8c8c", fontSize: 10 }}
                    dataPointsColor="#1890ff"
                    dataPointsRadius={4}
                    textShiftY={-12}
                    textFontSize={10}
                    textColor="#1890ff"
                />
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
});
