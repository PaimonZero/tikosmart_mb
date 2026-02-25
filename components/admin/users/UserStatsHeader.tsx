import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import type { User } from "./types";

interface UserStatsHeaderProps {
    users: User[];
    total?: number;
    onlineCount?: number;
    activeCount?: number;
}

export default function UserStatsHeader({ users, total, onlineCount, activeCount }: UserStatsHeaderProps) {
    const totalUsers = total ?? users.length;
    const activeUsers = activeCount ?? users.filter((u) => u.status === "active").length;
    const onlineUsers = onlineCount ?? users.filter((u) => u.online).length;

    const stats = [
        {
            label: "Tổng số",
            value: totalUsers,
            icon: "people" as const,
            color: "#3B82F6",
            bgColor: "#EFF6FF",
        },
        {
            label: "Hoạt động",
            value: activeUsers,
            icon: "checkmark-circle" as const,
            color: "#10B981",
            bgColor: "#F0FDF4",
        },
        {
            label: "Trực tuyến",
            value: onlineUsers,
            icon: "radio-button-on" as const,
            color: "#F59E0B",
            bgColor: "#FFFBEB",
        },
    ];

    return (
        <View className="px-4 py-3">
            <View className="flex-row gap-3">
                {stats.map((stat, index) => (
                    <View
                        key={index}
                        className="flex-1 flex-row items-center rounded-2xl p-3"
                        style={{
                            backgroundColor: stat.bgColor,
                            borderWidth: 1,
                            borderColor: stat.color + "20",
                        }}
                    >
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: stat.color + "20" }}
                        >
                            <Ionicons name={stat.icon} size={20} color={stat.color} />
                        </View>
                        <View>
                            <Text
                                className="text-xl font-bold"
                                style={{ color: stat.color }}
                            >
                                {stat.value}
                            </Text>
                            <Text className="text-xs font-medium text-gray-600">
                                {stat.label}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
