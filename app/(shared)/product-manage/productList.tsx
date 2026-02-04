import { ProductCategoryFilterModal } from "@/components/product/productList/ProductCategoryFilterModal";
import { ProductHeader } from "@/components/product/productList/ProductHeader";
import { ProductListView } from "@/components/product/productList/ProductListView";
import { ProductTabBar, TabItem } from "@/components/product/productList/ProductTabBar";
import { useProductPermissions } from "@/hooks/useProductPermissions";
import { fetchCategories } from "@/store/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearProducts, fetchListProducts, Product } from "@/store/productSlice";
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
    const [showFabLabel, setShowFabLabel] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
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

    // Fetch categories on mount
    useEffect(() => {
        dispatch(fetchCategories({ limit: 100 }));
    }, [dispatch]);

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
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const scrollDifference = currentScrollY - lastScrollY;

        // Show label only when at the very top
        if (currentScrollY <= 10) {
            setShowFabLabel(true);
        }
        // Hide label when scrolling down significantly
        else if (scrollDifference > 5 && currentScrollY > 50) {
            setShowFabLabel(false);
        }
        // Show label only when scrolling up significantly (more than 100px)
        else if (scrollDifference < -100) {
            setShowFabLabel(true);
        }

        setLastScrollY(currentScrollY);
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
                    <TouchableOpacity
                        onPress={navigateToAdd}
                        className={`absolute bottom-6 right-4 bg-blue-600 rounded-full shadow-lg z-50 elevation-5 flex-row items-center ${showFabLabel ? 'px-4 h-14' : 'w-14 h-14 justify-center'
                            }`}
                        activeOpacity={0.8}
                    >
                        <AntDesign name="plus" size={24} color="white" />
                        {showFabLabel && (
                            <Text className="text-white font-semibold ml-2 text-base">
                                Thêm sản phẩm
                            </Text>
                        )}
                    </TouchableOpacity>
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
