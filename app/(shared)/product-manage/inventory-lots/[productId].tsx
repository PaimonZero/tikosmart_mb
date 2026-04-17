import { InventoryLotsEmptyState } from '@/components/product/inventoryLots/InventoryLotsEmptyState';
import { InventoryLotsHeader } from '@/components/product/inventoryLots/InventoryLotsHeader';
import { InventoryLotsSearchBar } from '@/components/product/inventoryLots/InventoryLotsSearchBar';
import { InventoryLotsStats } from '@/components/product/inventoryLots/InventoryLotsStats';
import { InventoryLotCard } from '@/components/product/productDetail/InventoryLotCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInventoryLots } from '@/store/inventoryLotSlice';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface InventoryLot {
    id: string;
    lotNo: string;
    productId: string;
    departmentId: string;
    expiryDate: string;
    qtyOnHand: number;
    conversionRate: number;
    skuCode: string;
    productName: string;
    packUnit: string;
    mainUnit: string;
    departmentName: string;
    departmentCode: string;
    nearExpiryDays: number;
    lowStockThreshold: number;
    qtyInPack: string;
}

const ITEMS_PER_PAGE = 20;

export default function InventoryLotsListScreen() {
    const { productId, productName } = useLocalSearchParams<{
        productId: string;
        productName?: string;
    }>();

    const dispatch = useAppDispatch();
    const { inventoryLotsByProductId, fetchStatus, fetchError } = useAppSelector(
        (state) => state.inventoryLot
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Extract lots data from Redux state
    const lotsData = Array.isArray(inventoryLotsByProductId)
        ? { data: inventoryLotsByProductId, pagination: {}, stats: { totalLots: 0, totalQtyOnHand: 0 } }
        : inventoryLotsByProductId;

    const lots: InventoryLot[] = lotsData?.data || [];
    const pagination = lotsData?.pagination || {};
    const stats = lotsData?.stats || { totalLots: 0, totalQtyOnHand: 0 };

    // Filter lots based on search query
    const filteredLots = lots.filter((lot) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            lot.lotNo.toLowerCase().includes(query) ||
            lot.departmentName.toLowerCase().includes(query) ||
            lot.departmentCode.toLowerCase().includes(query)
        );
    });

    // Load initial data
    useEffect(() => {
        if (productId) {
            loadInitialData();
        }
    }, [productId]);

    const loadInitialData = useCallback(() => {
        setHasMore(true);
        dispatch(
            fetchInventoryLots({
                productId: productId as string,
                params: { limit: ITEMS_PER_PAGE, offset: 0 },
            })
        );
    }, [productId, dispatch]);

    // Load more data for infinite scroll
    const loadMoreData = useCallback(() => {
        if (isLoadingMore || fetchStatus === 'loading' || !hasMore) {
            return;
        }

        const total = pagination?.total || 0;
        const currentCount = lots.length;

        if (currentCount >= total && total > 0) {
            setHasMore(false);
            return;
        }

        if (currentCount === 0) {
            return;
        }

        setIsLoadingMore(true);
        const newOffset = currentCount;

        dispatch(
            fetchInventoryLots({
                productId: productId as string,
                params: { limit: ITEMS_PER_PAGE, offset: newOffset },
            })
        ).finally(() => {
            setIsLoadingMore(false);
        });
    }, [productId, dispatch, isLoadingMore, fetchStatus, hasMore, lots.length, pagination?.total]);

    // Pull to refresh
    const onRefresh = useCallback(() => {
        loadInitialData();
    }, [loadInitialData]);

    // Render footer
    const renderFooter = () => {
        if (!hasMore || !isLoadingMore || filteredLots.length === 0) return null;

        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#2563EB" />
                <Text className="text-xs text-gray-500 mt-2">Đang tải thêm...</Text>
            </View>
        );
    };

    // Render empty state
    const renderEmpty = () => {
        if (fetchStatus === 'loading' && lots.length === 0) {
            return <InventoryLotsEmptyState type="loading" />;
        }

        if (fetchStatus === 'failed') {
            return (
                <InventoryLotsEmptyState
                    type="error"
                    errorMessage={fetchError || undefined}
                    onRetry={loadInitialData}
                />
            );
        }

        if (searchQuery && filteredLots.length === 0) {
            return <InventoryLotsEmptyState type="search-empty" />;
        }

        return <InventoryLotsEmptyState type="empty" />;
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <InventoryLotsHeader productName={productName} />

            {/* Search Bar */}
            <InventoryLotsSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {/* Stats */}
            <InventoryLotsStats
                totalQtyOnHand={stats.totalQtyOnHand}
                totalLots={stats.totalLots}
                mainUnit={lots[0]?.mainUnit || 'Kg'}
                searchQuery={searchQuery}
                filteredCount={filteredLots.length}
            />

            {/* List */}
            <FlatList
                data={filteredLots}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="px-5">
                        <InventoryLotCard lot={item} />
                    </View>
                )}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.5}
                refreshing={fetchStatus === 'loading' && lots.length > 0}
                onRefresh={onRefresh}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
            />
        </SafeAreaView>
    );
}
