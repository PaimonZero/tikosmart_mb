import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';

const CustomHomeHeader = () => {
    const router = useRouter();
    const currentUser = useAppSelector((state) => state.auth.user);
    const notificationCount = 99;

    return (
        <SafeAreaView edges={['top']} className="bg-white border-b border-gray-200 shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">
            <View className="flex-row justify-between items-center px-4 pb-3 pt-3">
                <TouchableOpacity className="flex-row items-center gap-[10px]" onPress={() => router.push('/profile')}>
                    <Image
                        source={{ uri: currentUser?.avatar || 'https://i.pravatar.cc/150' }}
                        className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    <View>
                        <Text className="text-xs text-gray-600">Xin chào,</Text>
                        <Text className="text-base font-bold text-gray-800">{currentUser?.fullName || 'TikoSmart User'}</Text>
                    </View>
                </TouchableOpacity>

                <View className="flex-row gap-3">
                    {/* <TouchableOpacity className="p-1">
                        <Ionicons name="search-outline" size={24} color="#333" />
                    </TouchableOpacity> */}

                    <TouchableOpacity className="p-1 relative">
                        <Ionicons name="notifications-outline" size={24} color="#333" />
                        {notificationCount > 0 && (
                            <Text className="absolute -right-1 -top-1 bg-red-500 text-white text-xs rounded-full px-1 py-0.5 min-w-[18px] text-center font-bold">
                                {notificationCount > 99 ? '99+' : notificationCount}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    );
};

export default CustomHomeHeader;