import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import KPICard from "@/app/(shared)/card/kpicard";
import TopProductsTable from "@/components/dashboard/TopProductsTable";
import { getSellerKpiData } from "@/store/dashboardRoleSlices";

export default function SellerDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSellerKpiData().then((d) => { setData(d); setLoading(false); });
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Dashboard Người Bán</Text>

            {loading || !data ? (
                <View style={styles.center}><ActivityIndicator size="large" /></View>
            ) : (
                <View style={styles.grid}>
                    <KPICard title="Đơn nháp" value={data.draftOrders} icon="file-outline" color="#434241" />
                    <KPICard title="Tổng đơn" value={data.totalOrders} icon="cart" color="#1890ff" />
                    <KPICard title="Đang xử lý" value={data.processingOrders} icon="sync" color="#faad14" />
                    <KPICard title="Hoàn thành" value={data.completedOrders} icon="check-circle" color="#52c41a" />
                    <KPICard title="Vấn đề / Lỗi" value={data.cancelledOrders} icon="close-circle" color="#f5222d" />
                    <KPICard title="Số khách hàng" value={data.totalCustomers} icon="account-group" color="#722ed1" />
                </View>
            )}

            <TopProductsTable />
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
