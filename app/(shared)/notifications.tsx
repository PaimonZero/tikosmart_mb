import React, { useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SectionList,
    ActivityIndicator,
} from 'react-native';
import { 
    Bell, 
    BellOff, 
    CheckCircle2, 
    AlertTriangle, 
    Package, 
    Cpu, 
    Clock, 
    Trash2 
} from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchNotifications,
    markNotificationAsRead,
    deleteNotification,
} from '@/store/notificationSlice';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useRouter } from 'expo-router';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const NotificationScreen = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    const { notifications: notifData, fetchStatus } = useAppSelector((state) => state.notification);
    const notifications = notifData.data;
    const pagination = notifData.pagination;

    useEffect(() => {
        dispatch(fetchNotifications({ limit: 15, offset: 0 }));
    }, []);

    const handleLoadMore = () => {
        if (fetchStatus === 'loading') return;
        const total = pagination?.total || 0;
        if (notifications.length < total) {
            dispatch(fetchNotifications({ limit: 15, offset: notifications.length }));
        }
    };

    // Group Logic
    const sections = useMemo(() => {
        const groups: { [key: string]: any[] } = {};

        notifications.forEach(notif => {
            const date = dayjs(notif.createdAt);
            let sectionTitle = '';

            if (date.isSame(dayjs(), 'day')) {
                sectionTitle = 'Hôm nay';
            } else if (date.isSame(dayjs().subtract(1, 'day'), 'day')) {
                sectionTitle = 'Hôm qua';
            } else {
                sectionTitle = 'Cũ hơn';
            }

            if (!groups[sectionTitle]) {
                groups[sectionTitle] = [];
            }
            groups[sectionTitle].push(notif);
        });

        // Order of sections
        const order = ['Hôm nay', 'Hôm qua', 'Cũ hơn'];
        return order
            .filter(title => groups[title] && groups[title].length > 0)
            .map(title => ({
                title,
                data: groups[title]
            }));
    }, [notifications]);

    const getIconForNotification = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('cảnh báo') || t.includes('nguy hiểm') || t.includes('lỗi')) {
            return { Icon: AlertTriangle, color: '#ef4444', bgColor: '#fef2f2' };
        }
        if (t.includes('đơn hàng') || t.includes('vận chuyển')) {
            return { Icon: Package, color: '#3b82f6', bgColor: '#eff6ff' };
        }
        if (t.includes('thiết bị') || t.includes('bật') || t.includes('tắt')) {
            return { Icon: Cpu, color: '#10b981', bgColor: '#ecfdf5' };
        }
        return { Icon: Bell, color: '#6b7280', bgColor: '#f9fafb' };
    };

    const renderItem = ({ item }: { item: any }) => {
        const isUnread = item.status === 'unread';
        const { Icon, color, bgColor } = getIconForNotification(item.title);
        
        return (
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => isUnread && dispatch(markNotificationAsRead(item.id))}
                className={`flex-row px-4 py-4 ${isUnread ? 'bg-blue-50/20' : 'bg-white'}`}
            >
                {/* Visual Icon Container */}
                <View 
                    style={{ backgroundColor: bgColor }}
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                >
                    <Icon size={24} color={color} />
                    {isUnread && (
                        <View className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                    )}
                </View>

                {/* Content Area */}
                <View className="flex-1 pr-2">
                    <View className="flex-row justify-between items-start mb-1">
                        <Text 
                            className={`flex-1 text-[15px] leading-5 ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                        <Text className="text-[11px] text-gray-400 ml-2 mt-0.5">
                            {dayjs(item.createdAt).format('HH:mm')}
                        </Text>
                    </View>
                    
                    <Text 
                        className={`text-sm leading-5 ${isUnread ? 'text-gray-600 font-medium' : 'text-gray-500'}`}
                        numberOfLines={2}
                    >
                        {item.body}
                    </Text>

                    <View className="flex-row items-center mt-2">
                        <Clock size={12} color="#9ca3af" />
                        <Text className="text-[10px] text-gray-400 ml-1 italic">
                            {dayjs(item.createdAt).fromNow()}
                        </Text>
                    </View>
                </View>

                {/* Secondary Action - Minimal Trash */}
                <TouchableOpacity 
                    onPress={() => dispatch(deleteNotification(item.id))}
                    className="self-center p-2"
                >
                    <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
        <View className="bg-gray-50 px-4 py-2.5">
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</Text>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={false}
                ListHeaderComponent={() => <View className="h-2" />}
                ListEmptyComponent={() => (
                    <View className="flex-1 items-center justify-center pt-32 px-10">
                        <View className="w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6">
                            <BellOff size={48} color="#d1d5db" />
                        </View>
                        <Text className="text-gray-500 text-lg font-bold">Trống trải quá!</Text>
                        <Text className="text-gray-400 text-center mt-2 leading-5">
                            Bạn không có thông báo nào. Chúc bạn một ngày làm việc vui vẻ!
                        </Text>
                    </View>
                )}
                ListFooterComponent={() => 
                    fetchStatus === 'loading' ? (
                        <ActivityIndicator size="small" color="#3b82f6" className="py-8" />
                    ) : (
                        <View className="h-20" />
                    )
                }
            />
        </View>
    );
};

export default NotificationScreen;
