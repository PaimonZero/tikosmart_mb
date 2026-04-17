import { Stack } from 'expo-router';
import React from 'react';

export default function ProductManageLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="productList"
                options={{
                    title: 'Quản lý sản phẩm',
                }}
            />
            <Stack.Screen
                name="addProduct"
                options={{
                    title: 'Thêm sản phẩm',
                }}
            />
        </Stack>
    );
}
