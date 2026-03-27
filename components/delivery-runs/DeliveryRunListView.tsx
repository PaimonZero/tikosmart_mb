import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DeliveryRunCard } from './DeliveryRunCard';
import { DeliveryRunSkeleton } from './DeliveryRunSkeleton';

interface DeliveryRunListViewProps {
    data: any[];
    fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    fetchError: string | null;
    refreshing: boolean;
    activeQuery: string;
    onRefresh: () => void;
    onLoadMore: () => void;
    onItemPress: (id: string) => void;
    onScroll?: (event: any) => void;
    userRole: string;
}

export const DeliveryRunListView: React.FC<DeliveryRunListViewProps> = ({
    data,
    fetchStatus,
    fetchError,
    refreshing,
    activeQuery,
    onRefresh,
    onLoadMore,
    onItemPress,
    onScroll,
    userRole,
}) => {
    const renderItem = ({ item }: { item: any }) => (
        <DeliveryRunCard item={item} onPress={onItemPress} userRole={userRole} />
    );

    const renderFooter = () => {
        if (fetchStatus === 'loading' && !refreshing && data.length > 0) {
            return (
                <View className="py-2">
                    <DeliveryRunSkeleton />
                </View>
            );
        }
        return <View className="h-20" />;
    };

    const renderEmpty = () => {
        if (fetchStatus === 'loading' && !refreshing) {
            return (
                <View className="flex-1 pt-4">
                    <DeliveryRunSkeleton />
                    <DeliveryRunSkeleton />
                    <DeliveryRunSkeleton />
                </View>
            );
        }

        if (fetchStatus === 'failed') {
            return (
                <View className="flex-1 items-center justify-center pt-20 px-8">
                    <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
                        <Text className="text-red-500 text-2xl font-bold">!</Text>
                    </View>
                    <Text className="text-gray-900 text-lg font-bold text-center">
                        Lỗi tải dữ liệu
                    </Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">
                        {fetchError || "Đã có lỗi xảy ra. Vui lòng thử lại sau."}
                    </Text>
                </View>
            );
        }

        return (
            <View className="flex-1 items-center justify-center pt-20">
                <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4 border border-gray-100/50">
                    <MaterialCommunityIcons name="clipboard-text-off-outline" size={70} color="#9CA3AF" />
                </View>
                <Text className="text-gray-900 text-lg font-bold">
                    Không tìm thấy chuyến đi nào
                </Text>
                <Text className="text-gray-500 text-sm mt-2 text-center px-10">
                    {activeQuery 
                        ? `Không tìm thấy kết quả cho "${activeQuery}"`
                        : "Hiện tại chưa có chuyến giao hàng nào trong hệ thống"}
                </Text>
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 0 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
            }
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
        />
    );
};
