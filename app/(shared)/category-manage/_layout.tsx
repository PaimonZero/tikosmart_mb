import { Stack } from 'expo-router';

export default function CategoryManageLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'white' } }}>
            <Stack.Screen name="select" options={{ title: 'Chọn danh mục', headerShown: false }} />
            <Stack.Screen name="upsert" options={{ title: 'Thêm/Sửa danh mục', headerShown: false }} />
        </Stack>
    );
}
