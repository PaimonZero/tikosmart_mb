import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import type { UserFilters } from "./types";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "./types";

interface UserFilterBarProps {
    filters: UserFilters;
    onFiltersChange: (filters: UserFilters) => void;
}

export default function UserFilterBar({
    filters,
    onFiltersChange,
}: UserFilterBarProps) {
    const [expanded, setExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const toggleExpanded = () => {
        const toValue = expanded ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }).start();
        setExpanded(!expanded);
    };

    const maxHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 500],
    });

    const toggleRole = (roleValue: string) => {
        const newRoles = filters.roles.includes(roleValue)
            ? filters.roles.filter((r) => r !== roleValue)
            : [...filters.roles, roleValue];
        onFiltersChange({ ...filters, roles: newRoles });
    };

    const setStatus = (statusValue: string | null) => {
        onFiltersChange({ ...filters, status: statusValue });
    };

    const setOnlineStatus = (onlineStatus: "all" | "online" | "offline") => {
        onFiltersChange({ ...filters, onlineStatus });
    };

    const clearFilters = () => {
        onFiltersChange({
            roles: [],
            status: null,
            onlineStatus: "all",
        });
    };

    const activeFilterCount =
        filters.roles.length +
        (filters.status ? 1 : 0) +
        (filters.onlineStatus !== "all" ? 1 : 0);

    return (
        <View className="bg-white border-b border-gray-100">
            {/* Filter Toggle Button */}
            <TouchableOpacity
                onPress={toggleExpanded}
                activeOpacity={0.7}
                className="flex-row items-center justify-between px-4 py-3"
            >
                <View className="flex-row items-center gap-2">
                    <Ionicons
                        name="filter"
                        size={20}
                        color={activeFilterCount > 0 ? "#3B82F6" : "#6B7280"}
                    />
                    <Text
                        className="text-base font-semibold"
                        style={{
                            color: activeFilterCount > 0 ? "#3B82F6" : "#374151",
                        }}
                    >
                        Bộ lọc
                    </Text>
                    {activeFilterCount > 0 && (
                        <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
                            <Text className="text-xs font-bold text-white">
                                {activeFilterCount}
                            </Text>
                        </View>
                    )}
                </View>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6B7280"
                />
            </TouchableOpacity>

            {/* Filter Content */}
            <Animated.View style={{ maxHeight, overflow: "hidden" }}>
                <View className="px-4 pb-4">
                    {/* Role Filter */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                            Vai trò
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {ROLE_OPTIONS.map((role) => {
                                const isSelected = filters.roles.includes(role.value);
                                return (
                                    <TouchableOpacity
                                        key={role.value}
                                        onPress={() => toggleRole(role.value)}
                                        activeOpacity={0.7}
                                        className="px-3 py-2 rounded-xl border-2"
                                        style={{
                                            backgroundColor: isSelected ? role.color + "20" : "white",
                                            borderColor: isSelected ? role.color : "#E5E7EB",
                                        }}
                                    >
                                        <Text
                                            className="text-xs font-semibold"
                                            style={{
                                                color: isSelected ? role.color : "#6B7280",
                                            }}
                                        >
                                            {role.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Status Filter */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                            Trạng thái
                        </Text>
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={() => setStatus(null)}
                                activeOpacity={0.7}
                                className="flex-1 px-4 py-2.5 rounded-xl border-2"
                                style={{
                                    backgroundColor:
                                        filters.status === null ? "#F3F4F6" : "white",
                                    borderColor: filters.status === null ? "#6B7280" : "#E5E7EB",
                                }}
                            >
                                <Text
                                    className="text-sm font-semibold text-center"
                                    style={{
                                        color: filters.status === null ? "#374151" : "#9CA3AF",
                                    }}
                                >
                                    Tất cả
                                </Text>
                            </TouchableOpacity>
                            {STATUS_OPTIONS.map((status) => {
                                const isSelected = filters.status === status.value;
                                return (
                                    <TouchableOpacity
                                        key={status.value}
                                        onPress={() => setStatus(status.value)}
                                        activeOpacity={0.7}
                                        className="flex-1 px-4 py-2.5 rounded-xl border-2"
                                        style={{
                                            backgroundColor: isSelected
                                                ? status.color + "20"
                                                : "white",
                                            borderColor: isSelected ? status.color : "#E5E7EB",
                                        }}
                                    >
                                        <Text
                                            className="text-sm font-semibold text-center"
                                            style={{
                                                color: isSelected ? status.color : "#9CA3AF",
                                            }}
                                        >
                                            {status.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Online Status Filter */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                            Trạng thái trực tuyến
                        </Text>
                        <View className="flex-row gap-2">
                            {[
                                { value: "all", label: "Tất cả" },
                                { value: "online", label: "Trực tuyến" },
                                { value: "offline", label: "Ngoại tuyến" },
                            ].map((option) => {
                                const isSelected = filters.onlineStatus === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() =>
                                            setOnlineStatus(
                                                option.value as "all" | "online" | "offline",
                                            )
                                        }
                                        activeOpacity={0.7}
                                        className="flex-1 px-4 py-2.5 rounded-xl border-2"
                                        style={{
                                            backgroundColor: isSelected ? "#3B82F620" : "white",
                                            borderColor: isSelected ? "#3B82F6" : "#E5E7EB",
                                        }}
                                    >
                                        <Text
                                            className="text-sm font-semibold text-center"
                                            style={{
                                                color: isSelected ? "#3B82F6" : "#9CA3AF",
                                            }}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Clear Filters Button */}
                    {activeFilterCount > 0 && (
                        <TouchableOpacity
                            onPress={clearFilters}
                            activeOpacity={0.7}
                            className="bg-gray-100 rounded-xl py-3 items-center"
                        >
                            <Text className="text-sm font-semibold text-gray-700">
                                Xóa tất cả bộ lọc
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </View>
    );
}
