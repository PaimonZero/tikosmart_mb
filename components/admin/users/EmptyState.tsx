import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
}

export default function EmptyState({
    icon = "people-outline",
    title,
    description,
}: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center py-16 px-6">
            <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
                <Ionicons name={icon} size={48} color="#9CA3AF" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
                {title}
            </Text>
            {description && (
                <Text className="text-sm text-gray-500 text-center max-w-xs">
                    {description}
                </Text>
            )}
        </View>
    );
}
