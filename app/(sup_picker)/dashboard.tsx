import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import KPICard from "@/app/(shared)/card/kpicard";
import OrderProgressChart from "@/components/dashboard/OrderProgressChart";
import { getSupPickerKpiData } from "@/store/dashboardRoleSlices";

export default function SupPickerDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSupPickerKpiData().then((d) => { setData(d); setLoading(false); });
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Dashboard Giám sát soạn hàng</Text>

            {loading || !data ? (
                <View style={styles.center}><ActivityIndicator size="large" /></View>
            ) : (
                <View style={styles.grid}>
                    <KPICard title="Tổng đơn cần soạn" value={data.totalOrderAssigned} icon="shopping" color="#1890ff" />
                    <KPICard title="Tổng đơn đang soạn" value={data.totalOrderProcessing} icon="sync" color="#faad14" />
                    <KPICard title="Đơn đã soạn xong" value={data.totalOrderConfirmed} icon="check-circle" color="#52c41a" />
                    <KPICard title="Đơn hàng bị lỗi" value={data.totalOrderCancelled} icon="alert-circle" color="#f5222d" />
                    <KPICard title="Nhân viên soạn" value={data.totalPickers} icon="account-group" color="#13c2c2" />
                </View>
            )}

            <OrderProgressChart />
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
