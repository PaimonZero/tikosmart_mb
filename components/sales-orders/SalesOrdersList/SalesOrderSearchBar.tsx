import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SalesOrderSearchBarProps {
    keyword: string;
    onChangeText: (text: string) => void;
    onSubmit?: () => void;
    onClear: () => void;
    onFilterPress?: () => void;
}

export const SalesOrderSearchBar = ({
    keyword,
    onChangeText,
    onSubmit,
    onClear,
    onFilterPress,
}: SalesOrderSearchBarProps) => {
    return (
        <View
            className="bg-white px-3 py-2 flex-row items-center gap-2"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
            }}
        >
            {/* Search input */}
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-3 border border-gray-200">
                <Ionicons name="search" size={18} color="#135BEC" />
                <TextInput
                    className="flex-1 ml-2 text-base text-gray-800"
                    placeholder="Tìm kiếm đơn hàng, khách hàng..."
                    placeholderTextColor="#9CA3AF"
                    value={keyword}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmit}
                    returnKeyType="search"
                />
                {keyword.length > 0 && (
                    <TouchableOpacity onPress={onClear} className="p-1">
                        <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter button */}
            {/* <TouchableOpacity
                onPress={onFilterPress}
                className="bg-white border border-gray-200 rounded-xl p-2.5"
                activeOpacity={0.7}
            >
                <Ionicons name="filter" size={20} color="#4B5563" />
            </TouchableOpacity> */}
        </View>
    );
};
