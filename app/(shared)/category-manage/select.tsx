import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { deleteCategory, fetchCategories, setSelectedCategory } from '@/store/categorySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategorySelectScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { categories, pagination, fetchStatus, deleteStatus } = useAppSelector((state) => state.category);

    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);

    // Initial Load & Search
    useEffect(() => {
        loadData(0, searchQuery);
    }, [searchQuery]);

    // Refetch when focused (in case items changed)
    useFocusEffect(
        React.useCallback(() => {
            loadData(0, searchQuery);
            return () => { };
        }, [searchQuery]) // Re-run if query changes, but mainly for when returning from Upsert
    );

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: string, name: string } | null>(null);

    const loadData = (offset: number, q: string) => {
        dispatch(fetchCategories({ offset, limit: 20, q }));
    };

    const handleLoadMore = () => {
        // Only load more if:
        // 1. Not currently loading
        // 2. Previous fetch was successful
        // 3. There are more items to load
        if (
            fetchStatus !== 'loading' &&
            fetchStatus === 'succeeded' &&
            categories.length < pagination.total
        ) {
            loadData(pagination.offset + pagination.limit, searchQuery);
        }
    };

    const handleSelect = (category: any) => {
        dispatch(setSelectedCategory(category));
        router.back();
    };

    const handleEdit = (category: any) => {
        router.push({
            pathname: '/(shared)/category-manage/upsert',
            params: { id: category.id, name: category.name }
        });
    };

    const handleDelete = (id: string, name: string) => {
        setCategoryToDelete({ id, name });
        setDeleteDialogVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            await dispatch(deleteCategory(categoryToDelete.id));
            setDeleteDialogVisible(false);
            setCategoryToDelete(null);
            loadData(0, searchQuery);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View className="flex-row items-center justify-between p-4 border-b border-gray-100 bg-white">
            <TouchableOpacity onPress={() => handleSelect(item)} className="flex-1">
                <Text className="text-base text-gray-800 font-medium">{item.name}</Text>
            </TouchableOpacity>

            <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={() => handleEdit(item)} className="p-2">
                    <Feather name="edit-2" size={20} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} className="p-2">
                    <Feather name="trash-2" size={20} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Header */}
            <View className="px-4 py-3 border-b border-gray-100 flex-row items-center gap-3">
                <TouchableOpacity onPress={() => router.back()}>
                    <Feather name="chevron-left" size={28} color="#333" />
                </TouchableOpacity>
                <View className="flex-1 bg-gray-100 rounded-lg flex-row items-center px-3 h-10">
                    <Feather name="search" size={20} color="#666" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Tìm danh mục..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <AntDesign name="close-circle" size={16} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/(shared)/category-manage/upsert')}
                    className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center"
                >
                    <AntDesign name="plus" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ flexGrow: 1 }}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={fetchStatus === 'loading' && pagination.offset === 0}
                        onRefresh={() => loadData(0, searchQuery)}
                    />
                }
                ListFooterComponent={
                    fetchStatus === 'loading' && pagination.offset > 0 ? (
                        <View className="py-4">
                            <ActivityIndicator color="#007AFF" />
                        </View>
                    ) : <View className="h-10" />
                }
                ListEmptyComponent={
                    fetchStatus !== 'loading' ? (
                        <View className="items-center py-20">
                            <Feather name="inbox" size={40} color="#ccc" />
                            <Text className="text-gray-400 mt-2">Không tìm thấy danh mục</Text>
                        </View>
                    ) : null
                }
            />
            <ConfirmDialog
                visible={deleteDialogVisible}
                onDismiss={() => setDeleteDialogVisible(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa danh mục"
                content={categoryToDelete ? `Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete.name}"?` : ''}
                isDanger={true}
                confirmLabel="Xóa"
                cancelLabel="Hủy"
                isLoading={deleteStatus === 'loading'}
            />
        </SafeAreaView>
    );
}
