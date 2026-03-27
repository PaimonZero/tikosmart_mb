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
                    title: 'Chuyến giao hàng',
                }}
            />
            {/* Sẽ thêm [id] và addDeliveryRun sau */}
        </Stack>
    );
}
