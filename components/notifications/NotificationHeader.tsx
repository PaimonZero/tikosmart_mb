import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { markAllNotificationsAsRead } from '@/store/notificationSlice';

const NotificationHeader = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    
    const notificationData = useAppSelector((state) => state.notification.notifications);
    const unreadCount = notificationData?.pagination?.unreadCount || 0;

    return (
        <SafeAreaView className="bg-white" edges={['top']}>
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100 bg-white">
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        className="mr-3 p-1"
                    >
                        <ArrowLeft size={24} color="#374151" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-xl font-bold text-gray-800">Thông báo</Text>
                        {unreadCount > 0 && (
                            <Text className="text-xs text-blue-500 font-medium">
                                Bạn có {unreadCount} thông báo mới
                            </Text>
                        )}
                    </View>
                </View>
                
                {unreadCount > 0 && (
                    <TouchableOpacity 
                        onPress={() => dispatch(markAllNotificationsAsRead())}
                        className="bg-blue-50 px-3 py-1.5 rounded-full"
                    >
                        <Text className="text-blue-600 text-xs font-bold">Đọc tất cả</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

export default NotificationHeader;
