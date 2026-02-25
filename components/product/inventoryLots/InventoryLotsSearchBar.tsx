import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface InventoryLotsSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const InventoryLotsSearchBar: React.FC<InventoryLotsSearchBarProps> = ({
    searchQuery,
    onSearchChange,
}) => {
    return (
        <View className="bg-white px-5 py-3 border-b border-gray-100">
            <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 flex-row items-center">
                <Feather name="search" size={20} color="#9CA3AF" />
                <TextInput
                    className="flex-1 ml-3 text-base text-gray-900"
                    placeholder="Tìm theo mã lô, kho..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onSearchChange('')}>
                        <Feather name="x-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
