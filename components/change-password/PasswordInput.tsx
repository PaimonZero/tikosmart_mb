import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  error?: boolean;
}

export function PasswordInput({
  label,
  value,
  onChangeText,
  show,
  setShow,
  placeholder,
  icon,
  error,
}: PasswordInputProps) {
  return (
    <View className="mb-5">
      <Text className="text-gray-900 font-semibold mb-2">{label}</Text>
      <View className={`flex-row items-center border rounded-xl px-3 bg-white h-14 ${error ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}`}>
        <MaterialIcons name={icon} size={20} color="#9ca3af" />
        <TextInput
          className="flex-1 ml-3 text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={!show}
          value={value}
          onChangeText={onChangeText}
        />
        <Pressable onPress={() => setShow(!show)}>
          <MaterialIcons
            name={show ? 'visibility' : 'visibility-off'}
            size={20}
            color="#9ca3af"
          />
        </Pressable>
      </View>
    </View>
  );
}