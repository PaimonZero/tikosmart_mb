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
        </Stack>
    );
}
