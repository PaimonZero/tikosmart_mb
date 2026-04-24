import { fetchCategories } from '@/store/categorySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import Feather from '@expo/vector-icons/Feather';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProductCategoryFilterModalProps {
    visible: boolean;
    selectedCategoryId: string;
    onClose: () => void;
    onApply: (categoryId: string) => void;
}

const ITEMS_PER_PAGE = 20;

export const ProductCategoryFilterModal: React.FC<ProductCategoryFilterModalProps> = ({
    visible,
    selectedCategoryId,
    onClose,
    onApply,
}) => {
    const dispatch = useAppDispatch();
    const { categories, pagination, fetchStatus } = useAppSelector((state) => state.category);
    const [tempSelectedId, setTempSelectedId] = useState(selectedCategoryId);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Snap points for bottom sheet
    const snapPoints = useMemo(() => ['75%'], []);

    // Prepare data with "Tất cả" option
    const categoryData = useMemo(() => {
        return [{ id: '', name: 'Tất cả' }, ...categories];
    }, [categories]);

    // Fetch initial categories when modal opens
    useEffect(() => {
        if (visible && categories.length === 0) {
            dispatch(fetchCategories({ limit: ITEMS_PER_PAGE, offset: 0 }));
        }
    }, [visible, dispatch, categories.length]);

    // Sync temp selection with prop
    useEffect(() => {
        setTempSelectedId(selectedCategoryId);
    }, [selectedCategoryId]);

    // Open/close bottom sheet based on visible prop
    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible]);

    const handleApply = () => {
        onApply(tempSelectedId);
    };

    const handleSheetClose = () => {
        onClose();
    };

    // Load more categories
    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || fetchStatus === 'loading') return;

        const total = pagination?.total || 0;
        const currentCount = categories.length;

        // Check if there are more items to load
        if (currentCount >= total && total > 0) return;
        if (currentCount === 0) return;

        setIsLoadingMore(true);
        const nextOffset = currentCount;

        dispatch(
            fetchCategories({
                limit: ITEMS_PER_PAGE,
                offset: nextOffset,
            })
        ).finally(() => {
            setIsLoadingMore(false);
        });
    }, [dispatch, isLoadingMore, fetchStatus, categories.length, pagination?.total]);

    // Render backdrop
    const renderBackdrop = useCallback(
        (props: BottomSheetDefaultBackdropProps) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    // Render category item
    const renderCategoryItem = useCallback(
        ({ item }: { item: { id: string; name: string } }) => {
            const isSelected = tempSelectedId === item.id;
            return (
                <TouchableOpacity
                    onPress={() => setTempSelectedId(item.id)}
                    className="flex-row items-center justify-between py-4 border-b border-gray-100 px-5"
                    activeOpacity={0.7}
                >
                    <Text
                        className={`text-base ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-900'
                            }`}
                    >
                        {item.name}
                    </Text>
                    <View
                        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-blue-600' : 'border-gray-300'
                            }`}
                    >
                        {isSelected && <View className="w-3 h-3 rounded-full bg-blue-600" />}
                    </View>
                </TouchableOpacity>
            );
        },
        [tempSelectedId]
    );

    // Render footer (loading more indicator)
    const renderFooter = useCallback(() => {
        if (!isLoadingMore) return null;

        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#2563EB" />
                <Text className="text-xs text-gray-500 mt-2">Đang tải thêm...</Text>
            </View>
        );
    }, [isLoadingMore]);

    // Render empty component
    const renderEmpty = useCallback(() => {
        if (fetchStatus === 'loading' && categories.length === 0) {
            return (
                <View className="items-center justify-center py-12">
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text className="text-sm text-gray-500 mt-3">Đang tải danh mục...</Text>
                </View>
            );
        }

        return (
            <View className="items-center justify-center py-12">
                <Text className="text-sm text-gray-500">Không có danh mục nào</Text>
            </View>
        );
    }, [fetchStatus, categories.length]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={handleSheetClose}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: '#FFFFFF' }}
            handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
        >
            {/* Header */}
            <View className="border-b border-gray-200 px-5 py-2">
                <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-bold text-gray-900">Nhóm hàng</Text>
                    <TouchableOpacity
                        onPress={handleSheetClose}
                        className="p-2 -mr-2"
                        activeOpacity={0.7}
                    >
                        <Feather name="x" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content with FlatList for infinite scroll */}
            <BottomSheetFlatList
                data={categoryData}
                keyExtractor={(item: { id: string; name: string }) => item.id || 'all'}
                renderItem={renderCategoryItem}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingBottom: 16 }}
            />

            {/* Apply Button - Fixed at bottom */}
            <View className="px-5 py-4 border-t border-gray-200 bg-white">
                <TouchableOpacity
                    onPress={handleApply}
                    className="bg-blue-600 py-4 rounded-xl items-center"
                    activeOpacity={0.8}
                >
                    <Text className="text-white font-semibold text-base">Áp dụng</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
};
