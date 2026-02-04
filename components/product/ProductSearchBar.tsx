import { IconSymbol } from "@/components/ui/icon-symbol";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface ProductSearchBarProps {
    keyword: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    onClear: () => void;
}

export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
    keyword,
    onChangeText,
    onSubmit,
    onClear,
}) => {
    return (
        <View className="px-4 py-3 flex-row items-center space-x-3">
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 h-11">
                <FontAwesome5 name="search" size={16} color="#9CA3AF" />
                <TextInput
                    className="flex-1 ml-2 text-base text-gray-800 h-full"
                    placeholder="Tìm tên, mã SKU..."
                    placeholderTextColor="#9CA3AF"
                    value={keyword}
                    onChangeText={onChangeText}
                    returnKeyType="search"
                    onSubmitEditing={onSubmit}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {keyword.length > 0 && (
                    <TouchableOpacity onPress={onClear} className="mr-3">
                        <IconSymbol name="xmark.circle.fill" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onSubmit}>
                    <FontAwesome5 name="search" size={16} color="#007AFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
