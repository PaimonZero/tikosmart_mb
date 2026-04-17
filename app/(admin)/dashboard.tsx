import { getKpiData } from "@/store/dashboardSlice";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { Button } from "react-native-paper";
import KPICard from "@/app/(shared)/card/kpicard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OrderStatusPieChart from "@/components/dashboard/OrderStatusPieChart";

export default function AdminDashboard() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"week" | "month" | "year">("month");

    useEffect(() => {
        const load = async () => {
            const data = await getKpiData();
            setData(data);
            setLoading(false);
        };
        load();
    }, []);

    if (loading || !data) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Dashboard Quản Trị</Text>

            <View style={styles.grid}>
                <KPICard title="Tổng đơn hàng" value={data.totalOrders} icon="cart" color="#52c41a" />
                <KPICard title="Tổng sản phẩm" value={data.totalProducts} icon="cube" color="#4C6FFF" />
                <KPICard title="Tổng nhà cung cấp" value={data.totalSuppliers} icon="truck" color="#faad14" />
                <KPICard title="Tổng khách hàng" value={data.totalCustomer} icon="account-group" color="#8E44AD" />
                <KPICard title="Nhập hàng" value={data.totalIn} icon="arrow-down-bold" color="#13c2c2" />
                <KPICard title="Trả hàng" value={data.totalOut} icon="arrow-up-bold" color="#E11D48" />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 16 }}>
                <Button
                    mode={filter === "week" ? "contained" : "outlined"}
                    buttonColor={filter === "week" ? "#1890ff" : undefined}
                    textColor={filter === "week" ? "#fff" : "#1890ff"}
                    style={{ borderColor: "#1890ff" }}
                    onPress={() => setFilter("week")}
                >
                    Tuần
                </Button>
                <Button
                    mode={filter === "month" ? "contained" : "outlined"}
                    buttonColor={filter === "month" ? "#1890ff" : undefined}
                    textColor={filter === "month" ? "#fff" : "#1890ff"}
                    style={{ borderColor: "#1890ff" }}
                    onPress={() => setFilter("month")}
                >
                    Tháng
                </Button>
                <Button
                    mode={filter === "year" ? "contained" : "outlined"}
                    buttonColor={filter === "year" ? "#1890ff" : undefined}
                    textColor={filter === "year" ? "#fff" : "#1890ff"}
                    style={{ borderColor: "#1890ff" }}
                    onPress={() => setFilter("year")}
                >
                    Năm
                </Button>
            </View>

            <RevenueChart filter={filter} />

            <OrderStatusPieChart />

            <Button
                mode="contained"
                onPress={() => router.push("/(admin)/userManage")}
                style={styles.button}
                icon="account-group"
            >
                Quản lý người dùng
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    content: { padding: 16, paddingBottom: 32 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    button: { marginTop: 20 },
});