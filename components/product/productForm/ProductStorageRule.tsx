import React from 'react';
import { Control, Controller } from 'react-hook-form';
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

interface ProductStorageRuleProps {
    control: Control<FormData>;
}

export default function ProductStorageRule({ control }: ProductStorageRuleProps) {
    return (
        <View className="gap-4">
            <Controller
                control={control}
                name="storageRule"
                render={({ field: { onChange, value } }) => (
                    <View>
                        <Text className="text-gray-600 mb-1 font-medium">Quy tắc lưu trữ</Text>
                        <TextInput
                            className="border border-gray-200 rounded-lg px-4 py-3 bg-white h-32"
                            placeholder="Ví dụ: Để nơi khô ráo..."
                            multiline
                            textAlignVertical="top"
                            value={value}
                            onChangeText={onChange}
                        />
                    </View>
                )}
            />
        </View>
    );
}
