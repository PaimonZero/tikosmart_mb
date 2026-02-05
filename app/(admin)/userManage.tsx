import type { User, UserFilters, UserFormData } from "@/components/admin/users";
import {
    EmptyState,
    UserCard,
    UserFilterBar,
    UserFormBottomSheet,
    UserSearchBar,
    UserStatsHeader
} from "@/components/admin/users";
import useUserStatusSocket from "@/hooks/useUserStatusSocket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createUser, fetchListUsers, updateUser } from "@/store/userSlice";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AnimatedFAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function UserManageScreen() {
    const dispatch = useAppDispatch();
    useUserStatusSocket();

    const { listUsers, fetchStatus, createStatus, updateStatus } = useAppSelector(
        (state) => state.user
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const [filters, setFilters] = useState<UserFilters>({
        roles: [],
        status: null,
        onlineStatus: "all",
    });

    const [isExtended, setIsExtended] = useState(true);

    const onScroll = ({ nativeEvent }: any) => {
        const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(currentScrollPosition <= 0);
    };

    useEffect(() => {
        dispatch(
            fetchListUsers({
                q: searchQuery,
                role: filters.roles.length > 0 ? filters.roles[0] : undefined,
            })
        );
    }, [dispatch, searchQuery, filters.roles]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchListUsers({}));
        setRefreshing(false);
    };

    const handleOpenCreate = () => {
        setEditingUser(null);
        setModalVisible(true);
    };

    const handleOpenEdit = (user: User) => {
        setEditingUser(user);
        setModalVisible(true);
    };

    const handleSubmit = async (formData: UserFormData) => {
        try {
            if (editingUser) {
                const payload: any = { ...formData };
                if (!payload.password) delete payload.password;

                await dispatch(
                    updateUser({ userId: editingUser.id, userData: payload })
                ).unwrap();
                toast.success("Cập nhật người dùng thành công", { duration: 3000 });
            } else {
                await dispatch(createUser(formData)).unwrap();
                toast.success("Tạo người dùng thành công", { duration: 3000 });
            }
            setModalVisible(false);
        } catch (error: any) {
            toast.error("Lỗi", {
                description: error || "Đã có lỗi xảy ra",
                duration: 5000,
            });
        }
    };

    const filteredUsers = useMemo(() => {
        let result = [...listUsers.data];

        if (searchQuery) {
            result = result.filter(
                (user: User) =>
                    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filters.roles.length > 0) {
            result = result.filter((user: User) => filters.roles.includes(user.role));
        }

        if (filters.status) {
            result = result.filter((user: User) => user.status === filters.status);
        }
        return result;
    }, [listUsers.data, searchQuery, filters]);

    const renderItem = ({ item }: { item: User }) => (
        <UserCard user={item} onPress={handleOpenEdit} />
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
                <View className="bg-white border-b border-gray-200 px-4 py-4">
                    <Text className="text-2xl font-bold text-gray-900">
                        Quản lý người dùng
                    </Text>
                </View>

                <UserStatsHeader
                    users={listUsers.data}
                    total={listUsers.pagination?.total}
                    onlineCount={listUsers.onlineCount}
                    activeCount={listUsers.activeCount}
                />

                <UserFilterBar filters={filters} onFiltersChange={setFilters} />

                <UserSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {fetchStatus === "loading" && listUsers.data.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text className="text-gray-500 mt-4">Đang tải...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: 100,
                            flexGrow: 1,
                        }}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                colors={["#3B82F6"]}
                                tintColor="#3B82F6"
                            />
                        }
                        onEndReached={() => {
                            if (
                                fetchStatus !== "loading" &&
                                listUsers.data.length < (listUsers.pagination?.total || Infinity)
                            ) {
                                dispatch(
                                    fetchListUsers({
                                        offset: listUsers.data.length,
                                        limit: 10,
                                        q: searchQuery,
                                        role:
                                            filters.roles.length > 0 ? filters.roles[0] : undefined,
                                    })
                                );
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            fetchStatus === "loading" && listUsers.data.length > 0 ? (
                                <View className="py-4 items-center">
                                    <ActivityIndicator size="small" color="#3B82F6" />
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            <EmptyState
                                icon="people-outline"
                                title={
                                    searchQuery || filters.roles.length > 0
                                        ? "Không tìm thấy người dùng"
                                        : "Chưa có người dùng"
                                }
                                description={
                                    searchQuery || filters.roles.length > 0
                                        ? "Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn"
                                        : "Nhấn nút + để thêm người dùng mới"
                                }
                            />
                        }
                    />
                )}

                <AnimatedFAB
                    icon="plus"
                    label="Thêm mới"
                    extended={isExtended}
                    onPress={handleOpenCreate}
                    visible={true}
                    animateFrom="right"
                    iconMode="dynamic"
                    color="#FFFFFF"
                    style={{
                        bottom: 16,
                        right: 16,
                        backgroundColor: "#2563EB",
                    }}
                />
            </SafeAreaView>

            <UserFormBottomSheet
                isOpen={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSubmit}
                editingUser={editingUser}
                isLoading={createStatus === "loading" || updateStatus === "loading"}
            />
        </GestureHandlerRootView>
    );
}