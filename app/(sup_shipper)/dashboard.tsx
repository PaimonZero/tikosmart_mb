import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import KPICard from "@/app/(shared)/card/kpicard";
import DeliveryProgressChart from "@/components/dashboard/DeliveryProgressChart";
import { getSupShipperKpiData } from "@/store/dashboardRoleSlices";

export default function SupShipperDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSupShipperKpiData().then((d) => { setData(d); setLoading(false); });
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Dashboard Giám sát giao hàng</Text>

            {loading || !data ? (
                <View style={styles.center}><ActivityIndicator size="large" /></View>
            ) : (
                <View style={styles.grid}>
                    <KPICard title="Tổng đơn cần giao" value={data.orderAssignedShipper} icon="shopping" color="#1890ff" />
                    <KPICard title="Đã giao thành công" value={data.orderDelivered} icon="check-circle" color="#52c41a" />
                    <KPICard title="Đang giao" value={data.orderDelivering} icon="sync" color="#13c2c2" />
                    <KPICard title="Đơn bị hoàn / lỗi" value={data.totalOrderCancelled} icon="alert-circle" color="#f5222d" />
                    <KPICard title="Tổng Shipper" value={data.countTotalShipper} icon="account-group" color="#722ed1" />
                </View>
            )}

            <DeliveryProgressChart />
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
