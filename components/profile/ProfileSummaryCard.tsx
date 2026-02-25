import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type ProfileSummaryCardProps = {
  name: string;
  username: string;
  role?: string;
  avatarUrl?: string;
  onPressAvatar?: () => void; // Thêm prop để phóng to avatar
  onPressChangeAvatar?: () => void;
  isUploadingAvatar?: boolean;
};

export function ProfileSummaryCard({
  name,
  username,
  role,
  avatarUrl,
  onPressAvatar,
  onPressChangeAvatar,
  isUploadingAvatar,
}: ProfileSummaryCardProps) {
  const roleMap: Record<string, string> = {
    admin: 'Quản trị viên',
    manager: 'Quản lý kho',
    accountant: 'Nhân viên kế toán',
    picker: 'Nhân viên soạn hàng',
    sup_picker: 'Trưởng soạn hàng',
    shipper: 'Nhân viên giao hàng',
    sup_shipper: 'Trưởng giao hàng',
    seller: 'Nhân viên bán hàng',
  };

  const roleLabel = role ? roleMap[role] ?? role : 'Người dùng';
  return (
    // Card Container: Bo góc, đổ bóng nhẹ, nền trắng
    <View className="mt-3 w-full bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm elevation-2">

      {/* 1. Phần Background màu tím nhạt ở trên (Cover) */}
      <View className="h-24 bg-indigo-50 w-full" />

      {/* 2. Phần nội dung chính (Content) */}
      <View className="items-center pb-6 px-4">

        {/* Avatar Wrapper - Dùng âm margin (negative margin) để đẩy lên trên */}
        <View className="-mt-12 relative mb-3">
          {/* Bấm vào avatar để phóng to */}
          <Pressable onPress={onPressAvatar} disabled={!avatarUrl}>
            <View className="w-40 h-40 bg-gray-200 rounded-full border-4 border-white justify-center items-center overflow-hidden">
              {avatarUrl ? (
                <Image
                  source={avatarUrl}
                  style={{ width: 160, height: 160 }}
                  contentFit="cover"
                  cachePolicy="none"
                />
              ) : (
                <MaterialIcons name="person" size={50} color="#9ca3af" />
              )}
            </View>
          </Pressable>

          {/* Camera Icon Button (Góc dưới phải) - Bấm để đổi avatar */}
          <Pressable
            onPress={onPressChangeAvatar}
            disabled={!!isUploadingAvatar}
            className="absolute bottom-0 right-0"
          >
            <View className="bg-blue-600 w-12 h-12 rounded-full border-2 border-white justify-center items-center">
              {isUploadingAvatar ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <MaterialIcons name="camera-alt" size={24} color="#fff" />
              )}
            </View>
          </Pressable>
        </View>

        {/* Name */}
        <Text
          className="text-2xl font-bold text-gray-900 text-center"
          numberOfLines={1}
        >
          {name}
        </Text>

        {/* Username */}
        <Text className="text-gray-500 text-sm mt-1 mb-4 text-center">
          @{username}
        </Text>

        <View className="bg-green-100 flex-row items-center px-4 py-2 rounded-full border border-green-200">
          <MaterialIcons name="verified" size={16} color="#15803d" />
          <Text className="text-green-700 font-bold text-xs ml-1 uppercase">
            {roleLabel} Chính Thức
          </Text>
        </View>

      </View>
    </View>
  );
}