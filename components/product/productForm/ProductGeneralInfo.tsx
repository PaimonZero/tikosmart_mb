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

interface ProductGeneralInfoProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
}

export default function ProductGeneralInfo({ control, errors }: ProductGeneralInfoProps) {
    return (
        <View className="gap-4">
            <Text className="text-lg font-bold text-gray-800">Thông tin chung</Text>

            <Controller
                control={control}
                name="skuCode"
                render={({ field: { onChange, value } }) => (
                    <View>
                        <Text className="text-gray-600 mb-1 font-medium">Mã SKU <Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg px-4 py-3 bg-white"
                            placeholder="Nhập mã SKU"
                            value={value}
                            onChangeText={onChange}
                        />
                        {errors.skuCode && <Text className="text-red-500 text-sm mt-1">{errors.skuCode.message}</Text>}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <View>
                        <Text className="text-gray-600 mb-1 font-medium">Tên sản phẩm <Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg px-4 py-3 bg-white"
                            placeholder="Nhập tên sản phẩm"
                            value={value}
                            onChangeText={onChange}
                        />
                        {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name.message}</Text>}
                    </View>
                )}
            />
        </View>
    );
}
