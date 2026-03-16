import { Stack } from "expo-router";
import React from "react";

export default function TaskManageLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{ title: "Danh sách nhiệm vụ" }}
            />
            <Stack.Screen
                name="[id]"
                options={{ title: "Chi tiết nhiệm vụ" }}
            />
            <Stack.Screen
                name="[id]/update-item"
                options={{ title: "Cập nhật sản phẩm soạn" }}
            />
            <Stack.Screen
                name="[id]/edit"
                options={{ title: "Cập nhật nhiệm vụ" }}
            />
            <Stack.Screen
                name="add-task"
                options={{
                    title: "Chọn đơn hàng",
                }}
            />
            <Stack.Screen
                name="add-task-form"
                options={{
                    title: "Tạo nhiệm vụ",
                }}
            />
        </Stack>
    );
}

