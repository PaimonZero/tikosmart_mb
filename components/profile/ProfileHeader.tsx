import React from 'react';
import { Text, View } from 'react-native';

export function ProfileHeader() {

  return (
    <View>
      <Text className='font-bold text-2xl'>Hồ sơ & Cài đặt</Text>
      <Text className='text-base text-gray-500 font-medium mt-1'>Quản lý thông tin tài khoản</Text>
    </View>
  );
}

