import { Stack } from 'expo-router';
import React from 'react';

export default function DeliveryRunsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="deliveryRunList"
                options={{
                    title: 'Danh sách chuyến giao',
                }}
            />
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Chi tiết chuyến giao',
                }}
            />
        </Stack>
    );
}
