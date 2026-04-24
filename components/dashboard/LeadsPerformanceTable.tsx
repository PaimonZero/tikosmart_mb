import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

interface LeadPerformance {
    key: number;
    leader: string;
    group: string;
    inProgress: number;
    completed: number;
    efficiency: number;
}

const mockLeadsPerformance: LeadPerformance[] = [
    { key: 1, leader: "Nguyễn A", group: "Soạn", inProgress: 25, completed: 200, efficiency: 89 },
    { key: 2, leader: "Trần B", group: "Giao", inProgress: 18, completed: 170, efficiency: 92 },
    { key: 3, leader: "Phạm C", group: "Soạn", inProgress: 30, completed: 210, efficiency: 85 },
    { key: 4, leader: "Lê D", group: "Giao", inProgress: 15, completed: 160, efficiency: 94 },
    { key: 5, leader: "Hoàng E", group: "Soạn", inProgress: 22, completed: 180, efficiency: 87 },
    { key: 6, leader: "Vũ F", group: "Giao", inProgress: 20, completed: 175, efficiency: 90 },
];

const getEfficiencyColor = (pct: number) => {
    if (pct >= 90) return { bg: "#52c41a", text: "#fff" };
    if (pct >= 80) return { bg: "#bae637", text: "#000" };
    if (pct >= 70) return { bg: "#faad14", text: "#fff" };
    return { bg: "#f5222d", text: "#fff" };
};

export default function LeadsPerformanceTable() {
    const data = mockLeadsPerformance;

    const renderItem = ({ item, index }: { item: LeadPerformance; index: number }) => {
        const effColor = getEfficiencyColor(item.efficiency);
        const groupColor = item.group === "Soạn" ? { bg: "#e6f7ff", text: "#1890ff" } : { bg: "#f6ffed", text: "#52c41a" };

        return (
            <View style={[styles.row, index % 2 === 0 && styles.rowEven]}>
                <View style={styles.info}>
                    <Text style={styles.leaderName}>{item.leader}</Text>
                    <View style={[styles.badge, { backgroundColor: groupColor.bg }]}>
                        <Text style={[styles.badgeText, { color: groupColor.text }]}>{item.group}</Text>
                    </View>
                </View>
                <View style={styles.statsCol}>
                    <Text style={styles.statLabel}>Đang xử lý</Text>
                    <Text style={styles.statValue}>{item.inProgress}</Text>
                </View>
                <View style={styles.statsCol}>
                    <Text style={styles.statLabel}>Hoàn thành</Text>
                    <Text style={styles.statValueOk}>{item.completed}</Text>
                </View>
                <View style={styles.effCol}>
                    <View style={[styles.effBadge, { backgroundColor: effColor.bg }]}>
                        <Text style={[styles.effText, { color: effColor.text }]}>{item.efficiency}%</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Hiệu suất theo trưởng nhóm</Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.key.toString()}
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
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    rowEven: { backgroundColor: "#f7f9fc" },
    info: { flex: 2 },
    leaderName: { fontSize: 13, fontWeight: "700", color: "#1a1a2e", marginBottom: 4 },
    badge: { alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
    badgeText: { fontSize: 9, fontWeight: "600" },
    statsCol: { flex: 1.5, alignItems: "center" },
    statLabel: { fontSize: 10, color: "#8c8c8c", marginBottom: 2 },
    statValue: { fontSize: 13, fontWeight: "600", color: "#fa8c16" },
    statValueOk: { fontSize: 13, fontWeight: "600", color: "#52c41a" },
    effCol: { flex: 1, alignItems: "flex-end" },
    effBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, minWidth: 46, alignItems: "center" },
    effText: { fontSize: 12, fontWeight: "700" },
});
