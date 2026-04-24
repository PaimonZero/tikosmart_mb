import React from 'react';
import { View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export function ValidationItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <View className="flex-row items-center mt-2">
      <MaterialIcons
        name={isValid ? 'check-circle' : 'radio-button-unchecked'}
        size={18}
        color={isValid ? '#22c55e' : '#9ca3af'}
      />
      <Text className={`ml-2 text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {text}
      </Text>
    </View>
  );
}