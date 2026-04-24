import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Tab {
    key: string;
    label: string;
}

interface SalesOrderDetailTabBarProps {
    tabs: Tab[];
    activeKey: string;
    onPress: (key: string) => void;
}

export const SalesOrderDetailTabBar = ({ tabs, activeKey, onPress }: SalesOrderDetailTabBarProps) => {
    return (
        <View className="bg-gray-200 flex-row">
            {tabs.map((tab) => {
                const isActive = tab.key === activeKey;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => onPress(tab.key)}
                        className={`flex-1 items-center py-3 border-b-2 ${isActive ? "border-blue-600" : "border-transparent"}`}
                    >
                        <Text className={`text-base font-semibold ${isActive ? "text-blue-600" : "text-gray-600"}`}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
