import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { User } from "./types";
import { ROLE_OPTIONS } from "./types";

interface UserCardProps {
    user: User;
    onPress: (user: User) => void;
}

export default function UserCard({ user, onPress }: UserCardProps) {
    const getRoleLabel = (role: string) => {
        return ROLE_OPTIONS.find((r) => r.value === role)?.label || role;
    };

    const getRoleColor = (role: string) => {
        return ROLE_OPTIONS.find((r) => r.value === role)?.color || "#6B7280";
    };

    const getStatusColor = (status?: string) => {
        return status === "active" ? "#10B981" : "#EF4444";
    };

    return (
        <TouchableOpacity
            onPress={() => onPress(user)}
            activeOpacity={0.7}
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
            }}
        >
            <View className="flex-row items-center">
                {/* Avatar with Online Indicator */}
                <View className="relative mr-4">
                    <View
                        className="w-16 h-16 rounded-full items-center justify-center overflow-hidden"
                        style={{
                            backgroundColor: user.online ? "#10B98120" : "#F3F4F6",
                            borderWidth: 2,
                            borderColor: user.online ? "#10B981" : "transparent",
                        }}
                    >
                        {user.avatar ? (
                            <Image
                                source={{ uri: user.avatar }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <Text className="text-2xl font-bold text-gray-700">
                                {user.fullName.charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </View>
                    {user.online && (
                        <View
                            className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white"
                            style={{
                                shadowColor: "#10B981",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                            }}
                        />
                    )}
                </View>

                {/* User Info */}
                <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                        <Text className="text-base font-bold text-gray-900 flex-1">
                            {user.fullName}
                        </Text>
                        {user.online && (
                            <View className="px-2 py-0.5 bg-green-50 rounded-full">
                                <Text className="text-xs font-medium text-green-600">
                                    Online
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text className="text-sm text-gray-500 mb-2">@{user.username}</Text>

                    {/* Email and Phone */}
                    {(user.email || user.phone) && (
                        <View className="mb-2 gap-1">
                            {user.email && (
                                <View className="flex-row items-center">
                                    <Ionicons name="mail-outline" size={14} color="#6B7280" />
                                    <Text className="text-xs text-gray-600 ml-1.5">
                                        {user.email}
                                    </Text>
                                </View>
                            )}
                            {user.phone && (
                                <View className="flex-row items-center">
                                    <Ionicons name="call-outline" size={14} color="#6B7280" />
                                    <Text className="text-xs text-gray-600 ml-1.5">
                                        {user.phone}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Role and Status Badges */}
                    <View className="flex-row items-center gap-2 flex-wrap">
                        <View
                            className="px-3 py-1 rounded-full"
                            style={{
                                backgroundColor: getRoleColor(user.role) + "20",
                            }}
                        >
                            <Text
                                className="text-xs font-semibold"
                                style={{ color: getRoleColor(user.role) }}
                            >
                                {getRoleLabel(user.role)}
                            </Text>
                        </View>
                        <View
                            className="px-3 py-1 rounded-full"
                            style={{
                                backgroundColor: getStatusColor(user.status) + "20",
                            }}
                        >
                            <Text
                                className="text-xs font-semibold"
                                style={{ color: getStatusColor(user.status) }}
                            >
                                {user.status === "active" ? "Hoạt động" : "Vô hiệu hóa"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Chevron */}
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </View>
        </TouchableOpacity>
    );
}
