import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface UserSearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    placeholder?: string;
}

export default function UserSearchBar({
    searchQuery,
    onSearchChange,
    placeholder = "Tìm kiếm theo tên, username, email...",
}: UserSearchBarProps) {
    return (
        <View className="px-4 py-3">
            <View className="flex-row items-center bg-white rounded-xl px-4 py-1 shadow-sm border border-gray-200">
                <Ionicons name="search" size={20} color="#9CA3AF" />
                <TextInput
                    className="flex-1 ml-3 text-base text-gray-900 z-10"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholderTextColor="#9CA3AF"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onSearchChange("")}>
                        <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
