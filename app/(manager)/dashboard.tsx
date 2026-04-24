import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import KPICard from "@/app/(shared)/card/kpicard";
import InventoryTable from "@/components/dashboard/InventoryTable";
import LeadsPerformanceTable from "@/components/dashboard/LeadsPerformanceTable";
import { getManagerKpiData } from "@/store/dashboardRoleSlices";

export default function ManagerDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getManagerKpiData().then((d) => { setData(d); setLoading(false); });
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Dashboard Quản Lý</Text>

            {loading || !data ? (
                <View style={styles.center}><ActivityIndicator size="large" /></View>
            ) : (
                <View style={styles.grid}>
                    <KPICard title="Đơn cần xử lý" value={data.processingOrders} icon="sync" color="#1677ff" />
                    <KPICard title="Đơn hoàn thành" value={data.completedOrders} icon="check-circle" color="#52c41a" />
                    <KPICard title="Đơn bị hủy" value={data.cancelledOrders} icon="close-circle" color="#ff4d4f" />
                    <KPICard title="Đơn trả supplier" value={data.SupplierReturns} icon="reload" color="#fa8c16" />
                    <KPICard title="Đơn nhập supplier" value={data.supplierInput} icon="account-group" color="#13c2c2" />
                    <KPICard title="Tổng tồn kho" value={data.totalInventory} icon="package-variant" color="#8c8c8c" />
                </View>
            )}

            <LeadsPerformanceTable />
            <InventoryTable />
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
