import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export interface SalesOrderTabItem {
    key: string;
    title: string;
    status: string; // matches backend status values
}

interface SalesOrderTabBarProps {
    tabs: SalesOrderTabItem[];
    selectedStatus: string;
    onTabPress: (status: string) => void;
}

export const SalesOrderTabBar = ({
    tabs,
    selectedStatus,
    onTabPress,
}: SalesOrderTabBarProps) => {
    return (
        <View
            className="bg-white border-b border-gray-100"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 4,
                zIndex: 10,
            }}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                className="flex-row"
            >
                {tabs.map((tab) => {
                    const isSelected = selectedStatus === tab.status;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => onTabPress(tab.status)}
                            className={`mr-6 py-3 border-b-2 ${isSelected ? "border-blue-600" : "border-transparent"
                                }`}
                        >
                            <Text
                                className={`text-base font-medium ${isSelected ? "text-blue-600 font-bold" : "text-gray-500"
                                    }`}
                            >
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};
