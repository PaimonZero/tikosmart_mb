import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, ActivityIndicator } from "react-native";
import KPICard from "@/app/(shared)/card/kpicard";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import PaymentStatusPie from "@/components/dashboard/PaymentStatusPie";
import { getAccountantKpiData } from "@/store/dashboardRoleSlices";

export default function AccountantDashboard() {
    const [kpiData, setKpiData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAccountantKpiData().then((d) => { setKpiData(d); setLoading(false); });
    }, []);

    const paymentIn = kpiData?.suplierPaymentIn?.[0] || {};
    const paymentOut = kpiData?.suplierPaymentOut?.[0] || {};

    const fmt = (v: number) => `${Number(v).toLocaleString("vi-VN")} VND`;

    const cards = !kpiData ? [] : [
        { title: "Tổng phải trả NCC", value: fmt(paymentIn.totalExpected || 0), icon: "bank-transfer-out" as const, color: "#1890ff" },
        { title: "Đã trả NCC", value: fmt(paymentIn.totalPaid || 0), icon: "check-circle" as const, color: "#52c41a" },
        { title: "Còn phải trả NCC", value: fmt(paymentIn.totalMissing || 0), icon: "clock-alert" as const, color: "#faad14" },
        { title: "Đã thu từ NCC", value: fmt(paymentOut.totalExpectedOut || 0), icon: "bank-transfer-in" as const, color: "#f5222d" },
        { title: "Còn phải thu", value: fmt(paymentOut.totalPaidOut || 0), icon: "currency-usd" as const, color: "#722ed1" },
        { title: "Tiền còn phải trả", value: fmt(paymentOut.totalMissingOut || 0), icon: "cash-remove" as const, color: "#eb2f96" },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Dashboard Kế Toán</Text>

            {loading ? (
                <View style={styles.center}><ActivityIndicator size="large" /></View>
            ) : (
                <View style={styles.grid}>
                    {cards.map((c, i) => (
                        <KPICard key={i} title={c.title} value={c.value} icon={c.icon} color={c.color} />
                    ))}
                </View>
            )}

            <CashFlowChart />
            <PaymentStatusPie />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 32 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 0 },
    center: { flex: 1, justifyContent: "center", alignItems: "center", minHeight: 200 },
});
