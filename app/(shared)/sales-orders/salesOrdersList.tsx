import { SalesOrderHeader } from "@/components/sales-orders/SalesOrdersList/SalesOrderHeader";
import { SalesOrderListView } from "@/components/sales-orders/SalesOrdersList/SalesOrderListView";
import { SalesOrderSearchBar } from "@/components/sales-orders/SalesOrdersList/SalesOrderSearchBar";
import { SalesOrderSummaryBanner } from "@/components/sales-orders/SalesOrdersList/SalesOrderSummaryBanner";
import {
    SalesOrderTabBar,
    SalesOrderTabItem,
} from "@/components/sales-orders/SalesOrdersList/SalesOrderTabBar";
import { useSalesOrderRouteGuard } from "@/hooks/useSalesOrderPermissions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSalesOrders, resetSalesOrders } from "@/store/salesOrdersSlice";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

//'draft','pending_preparation','assigned_preparation',
//'prepared','confirmed','delivering','delivered','completed','cancelled'
const TABS: SalesOrderTabItem[] = [
    { key: "all", title: "Tất cả", status: "" },
    { key: "draft", title: "Phiếu tạm", status: "draft" },
    { key: "pending_preparation", title: "Chờ chuẩn bị", status: "pending_preparation" },
    { key: "assigned_preparation", title: "Đang chuẩn bị", status: "assigned_preparation" },
    { key: "prepared", title: "Đã chuẩn bị", status: "prepared" },
    { key: "confirmed", title: "Đã xác nhận", status: "confirmed" },
    { key: "delivering", title: "Đang giao", status: "delivering" },
    { key: "delivered", title: "Đã giao", status: "delivered" },
    { key: "completed", title: "Hoàn thành", status: "completed" },
    { key: "cancelled", title: "Đã hủy", status: "cancelled" },
];

export default function SalesOrdersListScreen() {
    // Protect route & get navigation helper
    const canViewList = useSalesOrderRouteGuard("view_list");

    // Custom navigation to detail since route guard might cause redirects before hooks settle
    const { navigateToDetail } = require("@/hooks/useSalesOrderPermissions").useSalesOrderPermissions();

    const dispatch = useAppDispatch();
    const { salesOrders, fetchStatus, fetchError } = useAppSelector(
        (state) => state.salesOrders,
    );
    const user = useAppSelector((state) => state.auth.user);

    const [keyword, setKeyword] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    // Ref để bỏ qua lần chạy đầu tiên khi mount (Effect selectedStatus đã lo việc đó)
    const isFirstRender = useRef(true);

    // Debounce: auto-search 500ms after user stops typing
    useEffect(() => {
        if (!canViewList) return;
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // bỏ qua mount, tránh fetch trùng với effect selectedStatus
        }
        const timer = setTimeout(() => {
            dispatch(resetSalesOrders());
            loadData(0, keyword, selectedStatus);
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword, canViewList]);

    // Reset & reload when tab changes (immediate, no debounce)
    useEffect(() => {
        if (!canViewList) return;
        dispatch(resetSalesOrders());
        loadData(0, keyword, selectedStatus);
    }, [selectedStatus, canViewList]);

    const loadData = async (offset: number, q: string, status: string) => {
        const params: any = {
            q: q,
            limit: 10,
            offset: offset,
            status: status,
        };
        if (user?.role === "seller") {
            params.sellerId = user.id;
        }
        await dispatch(fetchSalesOrders(params));
    };

    const handleClearSearch = () => {
        setKeyword(""); // debounce effect will trigger search with empty string
    };

    const handleTabPress = (status: string) => {
        dispatch(resetSalesOrders());
        setSelectedStatus(status);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        dispatch(resetSalesOrders());
        await loadData(0, keyword, selectedStatus);
        setRefreshing(false);
    };

    const onLoadMore = () => {
        if (
            fetchStatus !== "loading" &&
            salesOrders.pagination &&
            salesOrders.data.length < (salesOrders.pagination.total || 0)
        ) {
            const nextOffset =
                (salesOrders.pagination.offset || 0) +
                (salesOrders.pagination.limit || 10);
            loadData(nextOffset, keyword, selectedStatus);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
            {/* Title Header */}
            <SalesOrderHeader />

            {/* Search Bar */}
            <SalesOrderSearchBar
                keyword={keyword}
                onChangeText={setKeyword}
                onClear={handleClearSearch}
            />

            {/* Tab Bar */}
            <SalesOrderTabBar
                tabs={TABS}
                selectedStatus={selectedStatus}
                onTabPress={handleTabPress}
            />

            {/* Today summary */}
            <SalesOrderSummaryBanner total={salesOrders.pagination?.total || 0} />

            <SalesOrderListView
                orders={salesOrders.data}
                total={salesOrders.pagination?.total || 0}
                fetchStatus={fetchStatus}
                fetchError={fetchError}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                onOrderPress={(order) => navigateToDetail(order.id)}
            />
        </SafeAreaView>
    );
}
