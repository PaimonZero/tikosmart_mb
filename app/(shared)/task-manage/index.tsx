import { useTaskPermission, useTaskRouteGuard } from '@/hooks/useTaskPermission';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMoreTasks, fetchTasks } from '@/store/taskSlice';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { AnimatedFAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import TaskList from '@/components/task-manage/TaskList/TaskList';
import TaskListSkeleton from '@/components/task-manage/TaskList/TaskListSkeleton';
import TaskManageHeader from '@/components/task-manage/TaskList/TaskManageHeader';
import TaskToolbar from '@/components/task-manage/TaskList/TaskToolbar';

export default function TaskManageScreen() {
    // 1. Guard access (Requires valid role to view)
    const hasAccess = useTaskRouteGuard("view");
    const { user, userRole, navigateToDetail, canAdd, navigateToAdd } = useTaskPermission();
    const dispatch = useAppDispatch();

    const [isExtended, setIsExtended] = useState(true);

    // 2. Redux State
    const { tasks: taskList, fetchStatus } = useAppSelector((state) => state.task);
    const isLoading = fetchStatus === 'loading';

    // 3. Local State
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Pagination state
    const limit = 10;
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // List of tasks matching format from Web
    const taskListData = (taskList as any)?.data;
    const totalCount = (taskList as any)?.total || 0;
    const listData = Array.isArray(taskListData) ? taskListData : Array.isArray(taskList) ? taskList : [];

    // 4. Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchText(searchText), 700);
        return () => clearTimeout(timer);
    }, [searchText]);

    // 5. Fetch APIs
    // Initial / reset fetch
    const loadData = useCallback(() => {
        setOffset(0);
        setHasMore(true);
        dispatch(fetchTasks({
            q: debouncedSearchText,
            limit: limit,
            offset: 0,
            status: statusFilter || undefined,
        })).unwrap().then((res) => {
            // Assess if we fetched less than limit, meaning no more pages
            const fetchedData = res?.data || res || [];
            if (fetchedData.length < limit) {
                setHasMore(false);
            }
        }).catch(() => { });
    }, [debouncedSearchText, statusFilter, dispatch, limit]);

    // Fetch more (Infinite scroll)
    const loadMoreData = useCallback(() => {
        if (isLoading || isFetchingMore || !hasMore || isRefreshing) return;

        const nextOffset = offset + limit;
        setIsFetchingMore(true);

        dispatch(fetchMoreTasks({
            q: debouncedSearchText,
            limit: limit,
            offset: nextOffset,
            status: statusFilter || undefined,
        })).unwrap().then((res) => {
            const fetchedData = res?.data || res || [];
            if (fetchedData.length > 0) {
                setOffset(nextOffset);
                if (fetchedData.length < limit) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        }).finally(() => {
            setIsFetchingMore(false);
        });
    }, [debouncedSearchText, statusFilter, offset, limit, hasMore, isLoading, isFetchingMore, isRefreshing, dispatch]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Auto-refresh khi focus lại màn hình (sau khi tạo task xong)
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const handleRefresh = async () => {
        setIsRefreshing(true);
        loadData();
        // Wait a bit for visual feedback
        setTimeout(() => setIsRefreshing(false), 800);
    };

    const handleTaskPress = (task: any) => {
        navigateToDetail(task.id);
    };

    const handleScroll = (event: any) => {
        const y = Math.floor(event.nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(y <= 0);
    };

    // If no user or unauthorized, return null (the hook handles redirection)
    if (!user || !hasAccess) return null;

    return (
        <>
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
                {/* Header */}
                <TaskManageHeader />

                {/* Toolbar for Search & Filters */}
                <TaskToolbar
                    searchText={searchText}
                    handleSearch={setSearchText}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                {/* Task List */}
                {isLoading && !isRefreshing ? (
                    <TaskListSkeleton count={5} />
                ) : (
                    <TaskList
                        data={listData}
                        userRole={userRole}
                        isRefreshing={isRefreshing}
                        isFetchingMore={isFetchingMore}
                        onRefresh={handleRefresh}
                        onLoadMore={loadMoreData}
                        onTaskPress={handleTaskPress}
                        onScroll={handleScroll}
                    />
                )}
            </SafeAreaView>

            {/* FAB — chỉ hiện khi có quyền add */}
            {canAdd && (
                <AnimatedFAB
                    icon="plus"
                    label="Tạo nhiệm vụ"
                    extended={isExtended}
                    onPress={navigateToAdd}
                    visible={true}
                    animateFrom="right"
                    iconMode="dynamic"
                    color="#FFFFFF"
                    style={{
                        position: 'absolute',
                        bottom: 24,
                        right: 16,
                        backgroundColor: "#2563EB",
                    }}
                />
            )}
        </>
    );
}
