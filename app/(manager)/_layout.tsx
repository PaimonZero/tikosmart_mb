import { Redirect, Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import CustomHomeHeader from "@/components/homepage/CustomHomeHeader";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAppSelector } from "@/store/hooks";
import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ManagerTabLayout() {
    const { isAuthenticated, hasHydrated } = useAppSelector((s) => s.auth);

    if (!hasHydrated) return null;

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#007AFF",
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Trang chủ",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="house.fill" color={color} />
                    ),
                    header: () => <CustomHomeHeader />,
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: "Sản phẩm",
                    tabBarIcon: ({ color }) => (
                        <Feather name="package" size={24} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="salesOrders"
                options={{
                    title: "Đơn hàng",
                    tabBarIcon: ({ color }) => (
                        <Feather name="shopping-cart" size={24} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="taskManage"
                options={{
                    title: "Soạn hàng",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="package-variant" size={24} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Tài khoản",
                    tabBarIcon: ({ color }) => (
                        <Feather name="user" size={24} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
