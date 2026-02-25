import { ProductCategoryFilterModal } from "@/components/product/productList/ProductCategoryFilterModal";
import { ProductHeader } from "@/components/product/productList/ProductHeader";
import { ProductListView } from "@/components/product/productList/ProductListView";
import { ProductTabBar, TabItem } from "@/components/product/productList/ProductTabBar";
import { useProductPermissions } from "@/hooks/useProductPermissions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearProducts, fetchListProducts, Product } from "@/store/productSlice";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { AnimatedFAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductListScreen() {
    const dispatch = useAppDispatch();
    const { canAdd, navigateToDetail, navigateToAdd } = useProductPermissions();

    const {
        products,
        countsByStatus,
        productsPagination,
        fetchStatus,
        fetchError
    } = useAppSelector((state) => state.product);
    const [activeQuery, setActiveQuery] = useState("");
    const [keyword, setKeyword] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isExtended, setIsExtended] = useState(true);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    const tabs: TabItem[] = [
        { key: 'all', title: 'Tất cả', status: '' },
        { key: 'active', title: 'Đang bán', status: 'active' },
        { key: 'warning', title: 'Sắp hết hàng', status: 'warning' },
        { key: 'disable', title: 'Ngừng bán', status: 'disable' },
    ];

    // Calculate stats for header
    const activeProductsCount = countsByStatus.active;
    const warningProductsCount = countsByStatus.warning;
    const disabledProductsCount = countsByStatus.disable;

    // Fetch data when status, query, or category changes
    useEffect(() => {
        loadData(0, activeQuery, selectedStatus, selectedCategoryId);
    }, [selectedStatus, activeQuery, selectedCategoryId]);

    const loadData = async (offset: number, q: string, status: string, categoryId: string = "") => {
        const params: any = {
            q: q,
            limit: 10,
            offset: offset,
            status: status,
        };

        // Add categoryId if selected
        if (categoryId) {
            params.categoryId = categoryId;
        }

        await dispatch(fetchListProducts(params));
    };

    const executeSearch = () => {
        dispatch(clearProducts());
        setActiveQuery(keyword);
        if (activeQuery === keyword) {
            loadData(0, keyword, selectedStatus);
        }
    };

    const handleClearSearch = () => {
        setKeyword("");
        setActiveQuery("");
        // Need to reload data after clearing to prevent stuck loading state
        if (activeQuery !== "") {
            dispatch(clearProducts());
            // Reload with empty query
            loadData(0, "", selectedStatus, selectedCategoryId);
        }
    };

    const handleTabPress = (status: string) => {
        dispatch(clearProducts());
        setSelectedStatus(status);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData(0, activeQuery, selectedStatus, selectedCategoryId);
        setRefreshing(false);
    };

    const onLoadMore = () => {
        if (fetchStatus === 'succeeded' && products.length < productsPagination.total) {
            const nextOffset = productsPagination.offset + productsPagination.limit;
            loadData(nextOffset, activeQuery, selectedStatus, selectedCategoryId);
        }
    };

    const handleProductPress = (product: Product) => {
        navigateToDetail(product.id);
    };

    const handleScroll = (event: any) => {
        const currentScrollPosition = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(currentScrollPosition <= 0);
    };

    return (
        <>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <ProductHeader
                    activeProducts={activeProductsCount}
                    warningProducts={warningProductsCount}
                    disabledProducts={disabledProductsCount}
                    keyword={keyword}
                    onSearchChange={setKeyword}
                    onSearchSubmit={executeSearch}
                    onSearchClear={handleClearSearch}
                    isSearchExpanded={isSearchExpanded}
                    onSearchExpandChange={setIsSearchExpanded}
                    hasActiveFilter={!!selectedCategoryId}
                    onFilterPress={() => setIsFilterModalVisible(true)}
                />

                <View className="shadow-sm bg-white">
                    <ProductTabBar
                        tabs={tabs}
                        selectedStatus={selectedStatus}
                        onTabPress={handleTabPress}
                    />
                </View>

                <ProductListView
                    products={products}
                    fetchStatus={fetchStatus}
                    fetchError={fetchError}
                    refreshing={refreshing}
                    activeQuery={activeQuery}
                    onRefresh={onRefresh}
                    onLoadMore={onLoadMore}
                    onProductPress={handleProductPress}
                    onScroll={handleScroll}
                />

                {/* FAB chỉ hiện khi user có quyền add */}
                {canAdd && (
                    <AnimatedFAB
                        icon="plus"
                        label="Thêm sản phẩm"
                        extended={isExtended}
                        onPress={navigateToAdd}
                        visible={true}
                        animateFrom="right"
                        iconMode="dynamic"
                        color="#FFFFFF"
                        style={{
                            bottom: 24,
                            right: 16,
                            backgroundColor: "#2563EB",
                        }}
                    />
                )}
            </SafeAreaView>

            {/* Category Filter Modal - Outside SafeAreaView */}
            <ProductCategoryFilterModal
                visible={isFilterModalVisible}
                selectedCategoryId={selectedCategoryId}
                onClose={() => setIsFilterModalVisible(false)}
                onApply={(categoryId) => {
                    setSelectedCategoryId(categoryId);
                    setIsFilterModalVisible(false);
                    dispatch(clearProducts());
                }}
            />
        </>
    );
}
