import { fetchDepartments } from '@/store/departmentSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface DepartmentSelectModalProps {
    visible: boolean;
    selectedDepartmentId: string;
    onClose: () => void;
    onSelect: (departmentId: string, departmentName: string) => void;
}

const ITEMS_PER_PAGE = 20;

export const DepartmentSelectModal: React.FC<DepartmentSelectModalProps> = ({
    visible,
    selectedDepartmentId,
    onClose,
    onSelect,
}) => {
    const dispatch = useAppDispatch();
    const { departments, fetchStatus } = useAppSelector((state) => state.department);
    const [tempSelectedId, setTempSelectedId] = useState(selectedDepartmentId);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Snap points for bottom sheet
    const snapPoints = useMemo(() => ['75%'], []);

    // Prepare data
    const departmentData = useMemo(() => {
        return departments.data || [];
    }, [departments.data]);

    // Fetch initial departments when modal opens
    useEffect(() => {
        if (visible && departments.data.length === 0) {
            dispatch(fetchDepartments({ limit: ITEMS_PER_PAGE, offset: 0, q: searchQuery }));
        }
    }, [visible, dispatch]);

    // Sync temp selection with prop
    useEffect(() => {
        setTempSelectedId(selectedDepartmentId);
    }, [selectedDepartmentId]);

    // Open/close bottom sheet based on visible prop
    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible]);

    const handleSelect = () => {
        const selectedDept = departmentData.find(d => d.id === tempSelectedId);
        if (selectedDept) {
            onSelect(tempSelectedId, selectedDept.name || '');
        }
    };

    const handleSheetClose = () => {
        onClose();
    };

    // Search departments
    const handleSearch = useCallback(() => {
        dispatch(fetchDepartments({ limit: ITEMS_PER_PAGE, offset: 0, q: searchQuery }));
    }, [dispatch, searchQuery]);

    // Load more departments
    const handleLoadMore = useCallback(() => {
        if (isLoadingMore || fetchStatus === 'loading') return;

        const total = departments.pagination?.total || 0;
        const currentCount = departments.data.length;

        // Check if there are more items to load
        if (currentCount >= total && total > 0) return;
        if (currentCount === 0) return;

        setIsLoadingMore(true);
        const nextOffset = currentCount;

        dispatch(
            fetchDepartments({
                limit: ITEMS_PER_PAGE,
                offset: nextOffset,
                q: searchQuery,
            })
        ).finally(() => {
            setIsLoadingMore(false);
        });
    }, [dispatch, isLoadingMore, fetchStatus, departments.data.length, departments.pagination?.total, searchQuery]);

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

    // Render department item
    const renderDepartmentItem = useCallback(
        ({ item }: { item: { id: string; name: string } }) => {
            const isSelected = tempSelectedId === item.id;
            return (
                <TouchableOpacity
                    onPress={() => setTempSelectedId(item.id)}
                    className="flex-row items-center justify-between py-4 border-b border-gray-100 px-5"
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center flex-1">
                        <Ionicons name="business-outline" size={20} color="#6B7280" />
                        <Text
                            className={`text-base ml-3 flex-1 ${isSelected ? 'text-blue-600 font-semibold' : 'text-gray-900'
                                }`}
                        >
                            {item.name}
                        </Text>
                    </View>
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

    // Render footer (loading more indicator only)
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
        if (fetchStatus === 'loading' && departments.data.length === 0) {
            return (
                <View className="items-center justify-center py-12">
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text className="text-sm text-gray-500 mt-3">Đang tải cơ sở...</Text>
                </View>
            );
        }

        return (
            <View className="items-center justify-center py-12">
                <Ionicons name="business-outline" size={48} color="#D1D5DB" />
                <Text className="text-sm text-gray-500 mt-2">
                    {searchQuery ? 'Không tìm thấy cơ sở' : 'Chưa có cơ sở nào'}
                </Text>
            </View>
        );
    }, [fetchStatus, departments.data.length, searchQuery]);

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
            <View className="border-b border-gray-200 px-5 py-3">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-lg font-bold text-gray-900">Chọn cơ sở</Text>
                    <TouchableOpacity
                        onPress={handleSheetClose}
                        className="p-2 -mr-2"
                        activeOpacity={0.7}
                    >
                        <Feather name="x" size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View className="flex-row items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
                    <Ionicons name="search-outline" size={18} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-2 text-sm text-gray-900"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        placeholder="Tìm kiếm cơ sở..."
                        placeholderTextColor="#9CA3AF"
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => {
                            setSearchQuery('');
                            dispatch(fetchDepartments({ limit: ITEMS_PER_PAGE, offset: 0 }));
                        }}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Content with FlatList for infinite scroll */}
            <View className="flex-1">
                <BottomSheetFlatList
                    data={departmentData}
                    keyExtractor={(item: { id: string; name: string }) => item.id}
                    renderItem={renderDepartmentItem}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 8 }}
                />
            </View>

            {/* Select Button - Fixed at bottom */}
            <View className="px-4 py-3 border-t border-gray-200 bg-white">
                <TouchableOpacity
                    onPress={handleSelect}
                    className="bg-blue-600 py-3.5 rounded-xl items-center"
                    activeOpacity={0.8}
                    disabled={!tempSelectedId}
                    style={{
                        opacity: tempSelectedId ? 1 : 0.5,
                    }}
                >
                    <Text className="text-white font-semibold text-base">Chọn</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
};
