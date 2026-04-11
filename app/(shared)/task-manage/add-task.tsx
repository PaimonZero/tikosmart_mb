import AddTaskHeader from '@/components/task-manage/AddTask/AddTaskHeader';
import EmptyOrderList from '@/components/task-manage/AddTask/EmptyOrderList';
import OrderCard from '@/components/task-manage/AddTask/OrderCard';
import OverdueSlaConfirmModal from '@/components/task-manage/AddTask/OverdueSlaConfirmModal';
import { SalesOrder, useOrderList } from '@/hooks/useOrderList';
import { useTaskRouteGuard } from '@/hooks/useTaskPermission';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTaskScreen() {
    useTaskRouteGuard('add');

    const router = useRouter();
    const { orders, loading, refreshing, hasMore, loadInitial, loadMore, search, refresh } = useOrderList();

    const [keyword, setKeyword] = useState('');
    const [overdueOrder, setOverdueOrder] = useState<SalesOrder | null>(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
        loadInitial();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Chỉ chạy 1 lần khi mount

    // Debounce search
    useEffect(() => {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            search(keyword);
        }, 400);
        return () => clearTimeout(debounceRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]); // Chỉ trigger khi keyword thay đổi

    const navigateToAddTaskForm = useCallback((order: SalesOrder) => {
        router.push({
            pathname: '/(shared)/task-manage/add-task-form',
            params: {
                orderId: order.id,
                orderNo: order.orderNo,
                customerName: order.customerName || '',
                departmentId: order.departmentId || '',
                // Truyền items dưới dạng JSON string
                orderItems: JSON.stringify(
                    (order.items || []).filter((i) => i.remain > 0)
                ),
            },
        } as any);
    }, [router]);

    const handleSelectOrder = useCallback((order: SalesOrder) => {
        const isOverdueSla = !!order.slaDeliveryAt && dayjs().isAfter(dayjs(order.slaDeliveryAt));

        if (isOverdueSla) {
            setOverdueOrder(order);
            setConfirmVisible(true);
            return;
        }

        navigateToAddTaskForm(order);
    }, [navigateToAddTaskForm]);

    const handleEndReached = useCallback(() => {
        if (hasMore && !loading) loadMore();
    }, [hasMore, loading, loadMore]);

    const renderItem = useCallback(({ item }: { item: SalesOrder }) => (
        <OrderCard order={item} onSelect={handleSelectOrder} />
    ), [handleSelectOrder]);

    const renderFooter = useCallback(() => {
        if (!loading || orders.length === 0) return null;
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#2563EB" />
                <Text className="text-xs text-gray-400 mt-1">Đang tải thêm...</Text>
            </View>
        );
    }, [loading, orders.length]);

    const handleContinueCreateTask = useCallback(() => {
        if (!overdueOrder) return;
        setConfirmVisible(false);
        navigateToAddTaskForm(overdueOrder);
    }, [navigateToAddTaskForm, overdueOrder]);

    const handleCreateIssue = useCallback(() => {
        if (!overdueOrder) return;
        setConfirmVisible(false);
        router.push({
            pathname: '/(shared)/task-manage/sla-issue',
            params: {
                orderId: overdueOrder.id,
                orderNo: overdueOrder.orderNo,
                customerName: overdueOrder.customerName || '',
                departmentName: overdueOrder.departmentName || '',
                slaDeliveryAt: overdueOrder.slaDeliveryAt || '',
            },
        } as any);
    }, [overdueOrder, router]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* ─── CUSTOM HEADER ─── */}
            <AddTaskHeader keyword={keyword} setKeyword={setKeyword} />

            {/* ─── CONTENT ─── */}
            {loading && orders.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text className="text-gray-400 mt-3 text-sm">Đang tải danh sách đơn hàng...</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 12, paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    refreshing={refreshing}
                    onRefresh={refresh}
                    ListEmptyComponent={<EmptyOrderList onRefresh={refresh} />}
                />
            )}

            <OverdueSlaConfirmModal
                visible={confirmVisible}
                order={overdueOrder}
                onClose={() => {
                    setConfirmVisible(false);
                    setOverdueOrder(null);
                }}
                onContinueCreateTask={handleContinueCreateTask}
                onCreateIssue={handleCreateIssue}
            />
        </SafeAreaView>
    );
}
