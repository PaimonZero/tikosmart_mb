import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, View, Text } from 'react-native';

type ProfileInfoRowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  iconColor?: string; // Màu chủ đạo của row (ví dụ: '#3b82f6' cho màu xanh)
  actionLabel?: string;
  onPressAction?: () => void;
  isLast?: boolean; // Để ẩn đường kẻ dưới cùng nếu là item cuối
};

export function ProfileInfoRow({
  icon,
  label,
  value,
  iconColor = '#3b82f6', // Mặc định màu xanh blue
  actionLabel,
  onPressAction,
  isLast = false,
}: ProfileInfoRowProps) {

  return (
    <View className={`py-4 ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <View className='flex-row items-center px-4'>
        {/* 1. Icon Box bên trái */}
        <View className="w-12 h-12 rounded-2xl mr-4 overflow-hidden justify-center items-center relative">
          {/* Lớp nền màu mờ (Opacity 10%) */}
          <View
            className="absolute w-full h-full opacity-10"
            style={{ backgroundColor: iconColor }}
          />
          {/* Icon chính */}
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>

        {/* 2. Phần Text ở giữa */}
        <View className="flex-1 justify-center">
          <Text className="text-gray-500 text-sm mb-1">
            {label}
          </Text>
          <Text
            className="text-gray-900 text-base font-semibold"
            numberOfLines={1}
          >
            {value}
          </Text>
        </View>

        {/* 3. Nút Action (Sửa) bên phải */}
        {actionLabel && (
          <Pressable
            onPress={onPressAction}
            className="bg-blue-50 px-4 py-2 rounded-full active:opacity-70"
          >
            <Text className="text-blue-600 text-xs font-bold">
              {actionLabel}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}