import type { User, UserFilters, UserFormData } from "@/components/admin/users";
import {
    EmptyState,
    UserCard,
    UserFilterBar,
    UserFormBottomSheet,
    UserSearchBar,
    UserStatsHeader,
} from "@/components/admin/users";
import useUserStatusSocket from "@/hooks/useUserStatusSocket";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createUser, fetchListUsers, updateUser } from "@/store/userSlice";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function UserManageScreen() {
    const dispatch = useAppDispatch();

    // Realtime status
    useUserStatusSocket();

    const { listUsers, fetchStatus, createStatus, updateStatus } = useAppSelector(
        (state) => state.user,
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    // Filter state
    const [filters, setFilters] = useState<UserFilters>({
        roles: [],
        status: null,
        onlineStatus: "all",
    });

    // FAB animation
    const scrollY = useRef(new Animated.Value(0)).current;
    const labelOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        dispatch(fetchListUsers({
            q: searchQuery,
            role: filters.roles.length > 0 ? filters.roles[0] : undefined,
        }));
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
                    updateUser({ userId: editingUser.id, userData: payload }),
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

    // Handle scroll for FAB animation
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const offsetY = event.nativeEvent.contentOffset.y;

                // Hide label when scrolling down
                if (offsetY > 50) {
                    Animated.timing(labelOpacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: false,
                    }).start();
                } else {
                    Animated.timing(labelOpacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: false,
                    }).start();
                }
            },
        },
    );

    // Filter and search logic
    const filteredUsers = useMemo(() => {
        let result = [...listUsers.data];

        // Search filter
        if (searchQuery) {
            result = result.filter(
                (user: User) =>
                    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        // Role filter
        if (filters.roles.length > 0) {
            result = result.filter((user: User) => filters.roles.includes(user.role));
        }

        // Status filter
        if (filters.status) {
            result = result.filter((user: User) => user.status === filters.status);
        }

        // Online status filter
        if (filters.onlineStatus === "online") {
            result = result.filter((user: User) => user.online === true);
        } else if (filters.onlineStatus === "offline") {
            result = result.filter((user: User) => !user.online);
        }

        return result;
    }, [listUsers.data, searchQuery, filters]);

    const renderItem = ({ item }: { item: User }) => (
        <UserCard user={item} onPress={handleOpenEdit} />
    );

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
                {/* Header */}
                <View className="bg-white border-b border-gray-200 px-4 py-4">
                    <Text className="text-2xl font-bold text-gray-900">
                        Quản lý người dùng
                    </Text>
                </View>

                {/* Stats Header */}
                <UserStatsHeader users={listUsers.data} total={listUsers.pagination?.total} />

                {/* Filter Bar */}
                <UserFilterBar filters={filters} onFiltersChange={setFilters} />

                {/* Search Bar */}
                <UserSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* User List */}
                {fetchStatus === "loading" && listUsers.data.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text className="text-gray-500 mt-4">Đang tải...</Text>
                    </View>
                ) : (
                    <Animated.FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                            paddingBottom: 100,
                            flexGrow: 1,
                        }}
                        onScroll={handleScroll}
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
                            if (fetchStatus !== "loading" && listUsers.data.length < (listUsers.pagination?.total || Infinity)) {
                                dispatch(fetchListUsers({
                                    offset: listUsers.data.length,
                                    limit: 10,
                                    q: searchQuery,
                                    role: filters.roles.length > 0 ? filters.roles[0] : undefined,
                                }));
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

                {/* Animated Floating Action Button */}
                <Animated.View
                    style={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        height: 56,
                    }}
                >
                    <TouchableOpacity
                        onPress={handleOpenCreate}
                        activeOpacity={0.8}
                        style={{
                            height: 56,
                            paddingHorizontal: 16,
                            backgroundColor: "#3B82F6",
                            borderRadius: 28,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#3B82F6",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <Ionicons name="add" size={24} color="white" />
                        <Animated.View
                            style={{
                                opacity: labelOpacity,
                                width: labelOpacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 80],
                                }),
                                overflow: "hidden",
                            }}
                        >
                            <Text className="text-white font-bold text-base ml-2">
                                Thêm mới
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>

            {/* Bottom Sheet Form - Outside SafeAreaView for better z-index handling */}
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
