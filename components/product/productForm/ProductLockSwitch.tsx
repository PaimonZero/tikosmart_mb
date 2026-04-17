import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Switch, Text, View } from 'react-native';

interface ProductLockSwitchProps {
    adminLocked: boolean;
    setAdminLocked: (value: boolean) => void;
}

export default function ProductLockSwitch({ adminLocked, setAdminLocked }: ProductLockSwitchProps) {
    return (
        <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <View className="flex-row items-center">
                <Feather name="lock" size={20} color="#4B5563" />
                <View className="ml-3">
                    <Text className="text-base font-semibold text-gray-800">Khóa sản phẩm</Text>
                    <Text className="text-sm text-gray-500">Ngăn chặn bán và đặt hàng</Text>
                </View>
            </View>
            <Switch
                value={adminLocked}
                onValueChange={setAdminLocked}
                trackColor={{ false: '#D1D5DB', true: '#EF4444' }}
                thumbColor={adminLocked ? '#fff' : '#f4f3f4'}
            />
        </View>
    );
}
