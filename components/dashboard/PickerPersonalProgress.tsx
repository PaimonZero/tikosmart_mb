import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { getPickerKpiData } from "@/store/dashboardRoleSlices";

export default function PickerPersonalProgress() {
    const [kpis, setKpis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPickerKpiData().then((d) => {
            setKpis(d);
            setLoading(false);
        });
    }, []);

    if (loading || !kpis) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Tiến độ cá nhân</Text>
                <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>
            </View>
        );
    }

    const { totalAssigned, completed, inProgress, pendingApproval, issues } = kpis;
    const effectiveTotal = (totalAssigned || 0) + (inProgress || 0) + (pendingApproval || 0) + (completed || 0);
    const percent = effectiveTotal > 0 ? Math.round((completed / effectiveTotal) * 100) : 0;

    const getColor = (p: number) => {
        if (p >= 80) return '#52c41a';
        if (p >= 50) return '#fa8c16';
        return '#ff4d4f';
    };

    const getMessage = (p: number) => {
        if (p >= 80) return "Hiệu suất rất tốt! Tiếp tục phát huy nhé.";
        if (p >= 50) return "Tiến độ ổn, nhưng vẫn còn dư địa để cải thiện.";
        return "Hiệu suất đang thấp, cần rà soát lại tiến độ để tránh trễ hạn.";
    };

    const progressColor = getColor(percent);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Tiến độ cá nhân</Text>
            <View style={styles.row}>
                <View style={[styles.circleContainer, { borderColor: progressColor }]}>
                    <Text style={[styles.percentText, { color: progressColor }]}>{percent}%</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        <Text style={{ fontWeight: 'bold' }}>{completed}/{effectiveTotal}</Text> đơn hoàn thành
                    </Text>
                    <Text style={styles.issueText}>Lỗi / Huỷ: {issues}</Text>
                </View>
            </View>
            <Text style={[styles.feedbackText, { color: progressColor }]}>
                {getMessage(percent)}
            </Text>
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
    title: { fontSize: 16, fontWeight: "700", marginBottom: 16, color: "#1a1a2e" },
    center: { height: 100, justifyContent: "center", alignItems: "center" },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    circleContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 6,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    percentText: { fontSize: 20, fontWeight: "bold" },
    infoContainer: { flex: 1 },
    infoText: { fontSize: 15, color: "#333", marginBottom: 4 },
    issueText: { fontSize: 13, color: "#8c8c8c" },
    feedbackText: { fontSize: 14, fontWeight: "600", marginTop: 8 },
});
