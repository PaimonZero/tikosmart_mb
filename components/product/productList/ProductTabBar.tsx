import React from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";

export interface TabItem {
    key: string;
    title: string;
    status: string;
}

interface ProductTabBarProps {
    tabs: TabItem[];
    selectedStatus: string;
    onTabPress: (status: string) => void;
}

export const ProductTabBar: React.FC<ProductTabBarProps> = ({
    tabs,
    selectedStatus,
    onTabPress,
}) => {
    return (
        <View className="border-b border-gray-100">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                {tabs.map((tab) => {
                    const isSelected = selectedStatus === tab.status;
                    return (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => onTabPress(tab.status)}
                            className="mr-6 py-3 relative justify-center items-center"
                        >
                            <Text
                                style={{
                                    color: isSelected ? '#2563EB' : '#6B7280',
                                    fontWeight: isSelected ? '700' : '500',
                                    fontSize: 14,
                                }}
                            >
                                {tab.title}
                            </Text>
                            {isSelected && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        width: '100%',
                                        height: 3,
                                        backgroundColor: '#2563EB',
                                    }}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};
