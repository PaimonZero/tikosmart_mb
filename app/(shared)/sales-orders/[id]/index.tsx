import { SalesOrderCustomerCard } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderCustomerCard";
import { SalesOrderDetailHeader } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderDetailHeader";
import { SalesOrderDetailSkeleton } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderDetailSkeleton";
import { SalesOrderDetailTabBar } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderDetailTabBar";
import { SalesOrderHistoryRow } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderHistoryRow";
import { SalesOrderInvoiceTab } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderInvoiceTab";
import { SalesOrderOrderInfo } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderOrderInfo";
import { SalesOrderProductsSection } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderProductsSection";
import { useInvoiceTabPermission } from "@/hooks/useInvoicePermissions";
import { useSalesOrderRouteGuard } from "@/hooks/useSalesOrderPermissions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSalesOrderById, SalesOrder } from "@/store/salesOrdersSlice";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DETAIL_TABS = [
    { key: "detail", label: "Chi tiết" },
    { key: "products", label: "Sản phẩm" },
    { key: "invoice", label: "Hóa đơn" },
];

export default function SalesOrderDetailScreen() {
    useSalesOrderRouteGuard("view_detail");
    const { canViewInvoice } = useInvoiceTabPermission();
    const { id } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState("detail");

    const dispatch = useAppDispatch();
    const { salesOrdersById, fetchStatus, fetchError } = useAppSelector(
        (state) => state.salesOrders,
    );
    const order = (salesOrdersById as SalesOrder)?.id === id ? (salesOrdersById as SalesOrder) : null;

    useEffect(() => {
        if (id) {
            dispatch(fetchSalesOrderById(id as string));
        }
    }, [id, dispatch]);

    // Tab labels with count; ẩn tab invoice nếu không có quyền
    const tabs = DETAIL_TABS
        .filter((t) => t.key !== "invoice" || canViewInvoice)
        .map((t) => {
            if (t.key === "products" && order?.items) {
                return { ...t, label: `Sản phẩm (${order.items.length})` };
            }
            return t;
        });

    if (fetchStatus === "loading" && !order) {
        return <SalesOrderDetailSkeleton />;
    }

    if (fetchError || (!order && fetchStatus !== "loading")) {
        return (
            <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
                <SalesOrderDetailHeader orderNo="—" status="" />
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-red-500 font-medium text-center">{fetchError || "Không tìm thấy đơn hàng"}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!order) return null;

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
            {/* Blue Header */}
            <SalesOrderDetailHeader orderNo={order.orderNo} status={order.status} />

            {/* Tab Bar */}
            <SalesOrderDetailTabBar tabs={tabs} activeKey={activeTab} onPress={setActiveTab} />

            {/* Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                {activeTab === "detail" && (
                    <>
                        <SalesOrderCustomerCard
                            customerName={order.customerName}
                            phone={(order as any).phone}
                            address={(order as any).address}
                        />
                        <SalesOrderOrderInfo
                            sellerName={(order as any).sellerName}
                            departmentName={(order as any).departmentName}
                            slaDeliveryAt={(order as any).slaDeliveryAt}
                        />
                        <SalesOrderHistoryRow orderId={order.id} />
                        {order.items && (
                            <SalesOrderProductsSection
                                items={order.items as any}
                                onViewAll={() => setActiveTab("products")}
                            />
                        )}
                    </>
                )}

                {activeTab === "products" && order.items && (
                    <SalesOrderProductsSection items={order.items as any} showAll />
                )}

                {activeTab === "invoice" && canViewInvoice && (
                    <SalesOrderInvoiceTab orderId={order.id} />
                )}
            </ScrollView>

            {/* Bottom Bar */}
            {/* <SalesOrderBottomBar onPrint={() => { }} onEdit={() => { }} /> */}
        </SafeAreaView>
    );
}
