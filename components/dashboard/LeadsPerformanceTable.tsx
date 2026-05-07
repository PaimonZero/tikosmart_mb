import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import DashboardService from "@/services/dashboardService";

interface LeadPerformance {
    key: number;
    leader: string;
    group: string;
    inProgress: number;
    completed: number;
    efficiency: number;
}

const getEfficiencyColor = (pct: number) => {
    if (pct >= 90) return { bg: "#52c41a", text: "#fff" };
    if (pct >= 80) return { bg: "#bae637", text: "#000" };
    if (pct >= 70) return { bg: "#faad14", text: "#fff" };
    return { bg: "#f5222d", text: "#fff" };
};

export default function LeadsPerformanceTable() {
    const [data, setData] = useState<LeadPerformance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await DashboardService.getPickerProgress();
                if (res.success && Array.isArray(res.data)) {
                    const mapped = res.data.map((item: any, index: number) => {
                        const total = (item.completed || 0) + (item.inProgress || 0) + (item.cancelled || 0);
                        const efficiency = total > 0 ? Math.round(((item.completed || 0) / total) * 100) : 0;
                        return {
                            key: index + 1,
                            leader: item.pickerName || item.name || `NV ${index + 1}`,
                            group: item.group || "Soạn",
                            inProgress: item.inProgress || 0,
                            completed: item.completed || 0,
                            efficiency,
                        };
                    });
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
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Hiệu suất theo nhân viên</Text>
                <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>
            </View>
        );
    }

    if (!data.length) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Hiệu suất theo nhân viên</Text>
                <View style={styles.center}><Text style={styles.empty}>Không có dữ liệu</Text></View>
            </View>
        );
    }

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
            <Text style={styles.title}>Hiệu suất theo nhân viên</Text>
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
    center: { height: 100, justifyContent: "center", alignItems: "center" },
    empty: { color: "#999", fontSize: 13 },
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
