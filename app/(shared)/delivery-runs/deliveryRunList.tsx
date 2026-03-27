import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDeliveryRuns, resetDeliveryRuns, deliveryRunsSelectors } from "@/store/deliveryRunsSlice";
import { useDeliveryRunPermissions } from "@/hooks/useDeliveryRunPermissions";
import { DeliveryRunHeader } from "@/components/delivery-runs/DeliveryRunHeader";
import { DeliveryRunListView } from "@/components/delivery-runs/DeliveryRunListView";

export default function DeliveryRunListScreen() {
    const dispatch = useAppDispatch();
    const { navigateToDetail } = useDeliveryRunPermissions();

    const deliveryRunsData = useAppSelector(deliveryRunsSelectors.selectAll);
    const {
        pagination,
        summary,
        fetchStatus,
        fetchError
    } = useAppSelector((state) => state.deliveryRuns);

    const [activeQuery, setActiveQuery] = useState("");
    const [keyword, setKeyword] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [isExtended, setIsExtended] = useState(true);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const userRole = useAppSelector((state) => state.auth.user?.role);
    // Fetch data when query or status changes
    useEffect(() => {
        handleResetAndReload();
    }, [activeQuery, selectedStatus]);

    const handleResetAndReload = () => {
        dispatch(resetDeliveryRuns());
        loadData(0, activeQuery, selectedStatus);
    };

    const loadData = async (offset: number, q: string, status?: string) => {
        const params: any = {
            q: q,
            limit: 10,
            offset: offset,
            status: status || undefined,
            sort: 'createdAt'
        };

        await dispatch(fetchDeliveryRuns(params));
    };

    const executeSearch = () => {
        setActiveQuery(keyword);
    };

    const handleClearSearch = () => {
        setKeyword("");
        setActiveQuery("");
    };

    const onRefresh = async () => {
        setRefreshing(true);
        dispatch(resetDeliveryRuns());
        await loadData(0, activeQuery, selectedStatus);
        setRefreshing(false);
    };

    const onLoadMore = () => {
        if (fetchStatus === 'succeeded' && deliveryRunsData.length < (pagination.total || 0)) {
            const nextOffset = (pagination.offset || 0) + (pagination.limit || 10);
            loadData(nextOffset, activeQuery, selectedStatus);
        }
    };

    const handleItemPress = (id: string) => {
        navigateToDetail(id);
    };

    const handleScroll = (event: any) => {
        const currentScrollPosition = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(currentScrollPosition <= 0);
    };

    // Use global summary stats from Redux
    const totalRuns = summary.total;
    const deliveringCount = summary.inProgress;
    const completedCount = summary.completed;

    return (
        <>
            <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
                <DeliveryRunHeader
                    totalRuns={totalRuns}
                    deliveringCount={deliveringCount}
                    completedCount={completedCount}
                    keyword={keyword}
                    selectedStatus={selectedStatus}
                    onSearchChange={setKeyword}
                    onSearchSubmit={executeSearch}
                    onSearchClear={handleClearSearch}
                    isSearchExpanded={isSearchExpanded}
                    onSearchExpandChange={setIsSearchExpanded}
                    onStatusChange={setSelectedStatus}
                />

                <DeliveryRunListView
                    data={deliveryRunsData}
                    fetchStatus={fetchStatus}
                    fetchError={fetchError}
                    refreshing={refreshing}
                    activeQuery={activeQuery}
                    onRefresh={onRefresh}
                    onLoadMore={onLoadMore}
                    onItemPress={handleItemPress}
                    onScroll={handleScroll}
                    userRole={userRole}
                />
            </SafeAreaView>
        </>
    );
}
