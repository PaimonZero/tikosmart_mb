import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import KPICard from "@/app/(shared)/card/kpicard";
import PersonalProgress from "@/components/dashboard/PersonalProgress";
import DeliveryOrdersTable from "@/components/dashboard/DeliveryOrdersTable";
import { getShipperKpiData } from "@/store/dashboardRoleSlices";

export default function ShipperDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getShipperKpiData().then((d) => { setData(d); setLoading(false); });
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Dashboard Người Giao Hàng</Text>

            {loading || !data ? (
                <View style={styles.center}><ActivityIndicator size="large" /></View>
            ) : (
                <View style={styles.grid}>
                    <KPICard title="Tổng đơn được giao" value={data.totalAssignedToday} icon="shopping" color="#1890ff" />
                    <KPICard title="Đã giao thành công" value={data.deliveredSuccess} icon="check-circle" color="#52c41a" />
                    <KPICard title="Đang giao" value={data.delivering} icon="sync" color="#13c2c2" />
                    <KPICard title="Đơn trễ hạn" value={data.lateOrders} icon="clock-alert" color="#faad14" />
                    <KPICard title="Đơn bị hoàn / lỗi" value={data.failedOrReturn} icon="close-circle" color="#f5222d" />
                </View>
            )}

            {data && <PersonalProgress data={data} />}
            <DeliveryOrdersTable />
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
