import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

interface FormData {
    skuCode: string;
    name: string;
    categoryId: string;
    supplierId: string;
    lowStockThreshold: number;
    nearExpiryDays: number;
    packUnit: string;
    mainUnit: string;
    storageRule: string | undefined;
}

interface ProductUnitsProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
}

export default function ProductUnits({ control, errors }: ProductUnitsProps) {
    return (
        <View className="gap-4">
            <Text className="text-lg font-bold text-gray-800">Đơn vị tính</Text>
            <View className="flex-row gap-4">
                <Controller
                    control={control}
                    name="packUnit"
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-1">
                            <Text className="text-gray-600 mb-1 font-medium">Đơn vị đóng gói <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="border border-gray-200 rounded-lg px-4 py-3 bg-white"
                                placeholder="Hộp, chai..."
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.packUnit && <Text className="text-red-500 text-sm mt-1">{errors.packUnit.message}</Text>}
                        </View>
                    )}
                />
                <Controller
                    control={control}
                    name="mainUnit"
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-1">
                            <Text className="text-gray-600 mb-1 font-medium">Đơn vị chính <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="border border-gray-200 rounded-lg px-4 py-3 bg-white"
                                placeholder="Thùng, lốc..."
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.mainUnit && <Text className="text-red-500 text-sm mt-1">{errors.mainUnit.message}</Text>}
                        </View>
                    )}
                />
            </View>
        </View>
    );
}
