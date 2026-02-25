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

interface ProductInventoryConfigProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
}

export default function ProductInventoryConfig({ control, errors }: ProductInventoryConfigProps) {
    return (
        <View className="gap-4">
            <Text className="text-lg font-bold text-gray-800">Cấu hình kho</Text>
            <View className="flex-row gap-4">
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="lowStockThreshold"
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <Text className="text-gray-600 mb-1 font-medium">Tồn thấp nhất <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white"
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={String(value)}
                                    onChangeText={onChange}
                                />
                            </View>
                        )}
                    />
                </View>
                <View className="flex-1">
                    <Controller
                        control={control}
                        name="nearExpiryDays"
                        render={({ field: { onChange, value } }) => (
                            <View>
                                <Text className="text-gray-600 mb-1 font-medium">Cảnh báo hạn (ngày) <Text className="text-red-500">*</Text></Text>
                                <TextInput
                                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white"
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={String(value)}
                                    onChangeText={onChange}
                                />
                            </View>
                        )}
                    />
                </View>
            </View>
        </View>
    );
}
