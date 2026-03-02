import { SalesOrderDetailHeader } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderDetailHeader";
import { SalesOrderInfoSection } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderInfoSection";
import { SalesOrderItemsSection } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderItemsSection";
import { useSalesOrderRouteGuard } from "@/hooks/useSalesOrderPermissions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSalesOrderById, SalesOrder } from "@/store/salesOrdersSlice";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SalesOrderDetailScreen() {
    // Protect route
    useSalesOrderRouteGuard("view_detail");
    const { id } = useLocalSearchParams();

    const dispatch = useAppDispatch();
    const { salesOrdersById, fetchStatus, fetchError } = useAppSelector(
        (state) => state.salesOrders,
    );

    // Cast type
    const order = (salesOrdersById as SalesOrder)?.id === id ? (salesOrdersById as SalesOrder) : null;

    useEffect(() => {
        if (id) {
            dispatch(fetchSalesOrderById(id as string));
        }
    }, [id, dispatch]);

    if (fetchStatus === "loading" && !order) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <SalesOrderDetailHeader order={null} />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text className="mt-4 text-gray-500 font-medium">Đang tải chi tiết...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (fetchError || (!order && fetchStatus !== "loading")) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <SalesOrderDetailHeader order={null} />
                <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500 font-medium mb-2">{fetchError || "Không tìm thấy đơn hàng"}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!order) return null;

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <SalesOrderDetailHeader order={order} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                <SalesOrderInfoSection order={order} />
                {order.items && <SalesOrderItemsSection items={order.items} />}
            </ScrollView>
        </SafeAreaView>
    );
}
