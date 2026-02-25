import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Dialog, Portal } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ConfirmDialogProps {
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    cancelLabel?: string;
    confirmLabel?: string;
    isDanger?: boolean;
    isLoading?: boolean;
}

export function ConfirmDialog({
    visible,
    onDismiss,
    onConfirm,
    title,
    content,
    cancelLabel = 'Hủy bỏ',
    confirmLabel = 'Đồng ý',
    isDanger = false,
    isLoading = false,
}: ConfirmDialogProps) {

    // Xác định màu chủ đạo dựa trên isDanger
    const primaryColor = isDanger ? '#ef4444' : '#3b82f6'; // Red-500 : Blue-500
    const bgColor = isDanger ? 'bg-red-50' : 'bg-blue-50';
    const iconName = isDanger ? 'warning-amber' : 'info-outline';

    return (
        <Portal>
            {/* Override style của Dialog để background trắng và bo góc đẹp hơn */}
            <Dialog
                visible={visible}
                onDismiss={onDismiss}
                style={{ backgroundColor: 'white', borderRadius: 24 }}
            >
                <View className="items-center p-5">

                    {/* 1. ICON CIRCLE: Điểm nhấn thị giác */}
                    <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${bgColor}`}>
                        <MaterialIcons name={iconName} size={40} color={primaryColor} />
                    </View>

                    {/* 2. TITLE: To, đậm, rõ ràng */}
                    <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                        {title}
                    </Text>

                    {/* 3. CONTENT: Màu xám nhẹ, dễ đọc */}
                    <Text className="text-gray-500 text-center text-base leading-5 mb-8 px-2">
                        {content}
                    </Text>

                    {/* 4. BUTTON GROUP: Nút to, dễ bấm */}
                    <View className="flex-row w-full gap-6">
                        {/* Nút Hủy */}
                        <TouchableOpacity
                            onPress={onDismiss}
                            disabled={isLoading}
                            className="flex-1 py-3.5 bg-gray-100 rounded-xl items-center justify-center active:bg-gray-200"
                        >
                            <Text className="text-gray-700 font-semibold text-base">
                                {cancelLabel}
                            </Text>
                        </TouchableOpacity>

                        {/* Nút Xác nhận */}

                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 py-3.5 rounded-xl flex-row items-center justify-center space-x-2 ${
                                // Logic màu nền: Nếu đang loading thì nhạt hơn chút
                                isDanger
                                    ? (isLoading ? 'bg-red-400' : 'bg-red-500')
                                    : (isLoading ? 'bg-blue-400' : 'bg-blue-600')
                                }`}
                        >
                            {/* Nếu loading = true thì hiện vòng xoay */}
                            {isLoading && <ActivityIndicator size="small" color="white" />}

                            <Text className="text-white font-bold text-base">
                                {isLoading ? 'Đang xử lý...' : confirmLabel}
                                {/* Hoặc bạn có thể giữ nguyên confirmLabel nếu muốn */}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
        </Portal>
    );
}