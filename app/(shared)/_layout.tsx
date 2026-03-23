import { Stack } from 'expo-router';
import React from 'react';

export default function SharedLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="product-manage"
                options={{
                    title: 'Quản lý sản phẩm',
                }}
            />
            <Stack.Screen
                name="sales-orders"
                options={{
                    title: 'Đơn hàng bán',
                }}
            />
            <Stack.Screen
                name="task-manage"
                options={{
                    title: 'Quản lý soạn hàng',
                }}
            />
        </Stack>
    );
}
