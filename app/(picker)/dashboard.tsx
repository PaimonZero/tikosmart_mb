import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import KPICard from "@/app/(shared)/card/kpicard";
import AssignedOrdersTable from "@/components/dashboard/AssignedOrdersTable";
import ErrorOrdersTable from "@/components/dashboard/ErrorOrdersTable";
import PickerPersonalProgress from "@/components/dashboard/PickerPersonalProgress";
import { getPickerKpiData } from "@/store/dashboardRoleSlices";

export default function PickerDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPickerKpiData().then((d) => { setData(d); setLoading(false); });
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Dashboard Người Soạn</Text>

            {loading || !data ? (
                <View style={styles.center}><ActivityIndicator size="large" /></View>
            ) : (
                <View style={styles.grid}>
                    <KPICard title="Số đơn đã giao" value={data.totalAssigned} icon="shopping" color="#1890ff" />
                    <KPICard title="Đã hoàn thành" value={data.completed} icon="check-circle" color="#52c41a" />
                    <KPICard title="Đang thực hiện" value={data.inProgress} icon="sync" color="#faad14" />
                    <KPICard title="Chờ duyệt" value={data.pendingApproval} icon="clock-outline" color="#13c2c2" />
                    <KPICard title="Gặp lỗi / thiếu hàng" value={data.issues} icon="alert-circle" color="#f5222d" />
                </View>
            )}

            <PickerPersonalProgress />
            <ErrorOrdersTable />
            <AssignedOrdersTable />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 32 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    center: { justifyContent: "center", alignItems: "center", minHeight: 200 },
});
