import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface ProductImagePickerProps {
    imageUri: string | null;
    onPress: () => void;
}

export default function ProductImagePicker({ imageUri, onPress }: ProductImagePickerProps) {
    return (
        <View className="w-full">
            <TouchableOpacity
                onPress={onPress}
                className="w-full h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center overflow-hidden"
            >
                {imageUri ? (
                    <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <View className="items-center">
                        <Feather name="camera" size={32} color="#9CA3AF" />
                        <Text className="text-gray-400 mt-2">Thêm ảnh sản phẩm</Text>
                    </View>
                )}
            </TouchableOpacity>
            {/* Lưu ý ảnh không được vượt quá 2MB và đúng định dạng PNG, JPG, HEIC */}
            <Text className="text-sm text-gray-400 mt-2">Lưu ý: ảnh không được vượt quá 2MB và đúng định dạng PNG, JPG, HEIC</Text>
        </View>
    );
}
