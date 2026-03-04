import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import TaskCard from './TaskCard';

interface TaskListProps {
    data: any[];
    userRole: string;
    isRefreshing: boolean;
    isFetchingMore?: boolean;
    onRefresh: () => void;
    onLoadMore?: () => void;
    onTaskPress: (task: any) => void;
}

export default function TaskList({
    data,
    userRole,
    isRefreshing,
    isFetchingMore,
    onRefresh,
    onLoadMore,
    onTaskPress
}: TaskListProps) {
    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => String(item?.id || index)}
            renderItem={({ item }) => (
                <TaskCard
                    task={item}
                    userRole={userRole}
                    onPress={onTaskPress}
                />
            )}
            contentContainerStyle={{ paddingVertical: 12, backgroundColor: "#F5F5F5", flexGrow: 1 }}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            ListFooterComponent={
                isFetchingMore ? (
                    <View className="py-4 justify-center items-center flex-row">
                        <ActivityIndicator size="small" color="#2563EB" />
                        <Text className="text-gray-500 text-sm ml-2">Đang tải thêm...</Text>
                    </View>
                ) : null
            }
            ListEmptyComponent={
                <View className="py-10 justify-center items-center px-4">
                    <Text className="text-gray-500 text-base text-center">
                        Không tìm thấy nhiệm vụ nào.
                    </Text>
                </View>
            }
        />
    );
}
