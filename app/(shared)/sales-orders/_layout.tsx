import { Stack } from "expo-router";
import React from "react";

export default function SalesOrdersLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="salesOrdersList"
                options={{ title: "Danh sách đơn hàng" }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: "Chi tiết đơn hàng" }}
            />
        </Stack>
    );
}
