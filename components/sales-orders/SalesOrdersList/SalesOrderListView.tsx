import { SalesOrder } from "@/store/salesOrdersSlice";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, Text, View } from "react-native";
import { SalesOrderCard } from "./SalesOrderCard";

interface SalesOrderListViewProps {
    orders: SalesOrder[];
    total: number;
    fetchStatus: string;
    fetchError: string | null;
    refreshing: boolean;
    onRefresh: () => void;
    onLoadMore: () => void;
    onOrderPress: (order: SalesOrder) => void;
}

export const SalesOrderListView = ({
    orders,
    total,
    fetchStatus,
    fetchError,
    refreshing,
    onRefresh,
    onLoadMore,
    onOrderPress,
}: SalesOrderListViewProps) => {
    const EmptyComponent = () => {
        if (fetchStatus === "loading" && orders.length === 0) {
            return (
                <View className="flex-1 justify-center items-center pt-20">
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text className="mt-4 text-gray-500 font-medium">Đang tải dữ liệu...</Text>
                </View>
            );
        }

        if (fetchError) {
            return (
                <View className="flex-1 justify-center items-center pt-20 px-6">
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className="mt-4 text-red-500 font-medium text-center">
                        Có lỗi xảy ra: {fetchError}
                    </Text>
                </View>
            );
        }

        return (
            <View className="flex-1 justify-center items-center pt-32 px-6">
                <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                <Text className="mt-4 text-gray-500 font-medium text-base text-center">
                    Chưa có đơn hàng nào
                </Text>
                <Text className="text-gray-400 text-sm text-center mt-1">
                    Hãy thử thay đổi bộ lọc tìm kiếm
                </Text>
            </View>
        );
    };

    const FooterComponent = () => {
        if (fetchStatus === "loading" && orders.length > 0) {
            return (
                <View className="py-4 justify-center items-center">
                    <ActivityIndicator size="small" color="#2563EB" />
                </View>
            );
        }
        if (fetchStatus !== "loading" && orders.length > 0 && orders.length >= total) {
            return (
                <View className="py-6 justify-center items-center">
                    <Text className="text-gray-400 text-sm">Đã hiển thị hết đơn hàng</Text>
                </View>
            );
        }
        return <View className="h-20" />;
    };

    const renderItem: ListRenderItem<SalesOrder> = ({ item }) => (
        <SalesOrderCard order={item} onPress={onOrderPress} />
    );

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}
            ListEmptyComponent={EmptyComponent}
            ListFooterComponent={FooterComponent}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.1}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#2563EB"]}
                />
            }
            showsVerticalScrollIndicator={false}
        />
    );
};
