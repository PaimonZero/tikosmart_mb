import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ProfileSection } from '@/components/profile/ProfileSection';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

export function ProfileSecuritySection() {
  const router = useRouter();
  return (
    <ProfileSection title="BẢO MẬT">
      <TouchableOpacity className='p-4 flex-row items-center' onPress={() => { router.push('/change-password')}}> 
        <View className="w-12 h-12 rounded-2xl mr-4 overflow-hidden justify-center items-center relative">
          {/* Lớp nền màu mờ (Opacity 10%) */}
          <View
            className="absolute w-full h-full opacity-10"
            //màu đỏ
            style={{ backgroundColor: '#ef4444' }}
          />
          {/* Icon chính */}
          <MaterialIcons name="lock-reset" size={24} color="#ef4444" />
        </View>
        {/* 2. Phần Text ở giữa */}
        <View className="flex-1 justify-center">
          <Text className="text-gray-900 text-base font-semibold">
            Đổi mật khẩu
          </Text>
          <Text
            className="text-gray-500 text-sm mb-1"
            numberOfLines={1}
          >
            Cập nhật mật khẩu mới
          </Text>
        </View>

        <View>
          <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    </ProfileSection>
  );
}
