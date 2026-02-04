import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Control, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';

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

interface ProductClassificationProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    watch: UseFormWatch<FormData>;
    supplierList: any[];
    selectedSupplier: any;
    selectedCategory: any;
    onSupplierPress: () => void;
    onCategoryPress: () => void;
}

export default function ProductClassification({
    errors,
    watch,
    selectedSupplier,
    selectedCategory,
    onSupplierPress,
    onCategoryPress,
}: ProductClassificationProps) {
    return (
        <View className="gap-4">
            <Text className="text-lg font-bold text-gray-800">Phân loại</Text>

            {/* Supplier Select */}
            <View>
                <Text className="text-gray-600 mb-1 font-medium">Nhà cung cấp <Text className="text-red-500">*</Text></Text>
                <TouchableOpacity
                    onPress={onSupplierPress}
                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white flex-row justify-between items-center"
                >
                    <Text className={selectedSupplier ? "text-gray-900" : "text-gray-400"}>
                        {selectedSupplier ? selectedSupplier.name : "Chọn nhà cung cấp"}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
                {errors.supplierId && <Text className="text-red-500 text-sm mt-1">{errors.supplierId.message}</Text>}
            </View>

            {/* Category Select */}
            <View>
                <Text className="text-gray-600 mb-1 font-medium">Danh mục <Text className="text-red-500">*</Text></Text>
                <TouchableOpacity
                    onPress={onCategoryPress}
                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white flex-row justify-between items-center"
                >
                    <Text className={watch('categoryId') ? "text-gray-900" : "text-gray-400"}>
                        {selectedCategory ? selectedCategory.name : "Chọn danh mục"}
                    </Text>
                    <Feather name="chevron-right" size={20} color="#666" />
                </TouchableOpacity>
                {errors.categoryId && <Text className="text-red-500 text-sm mt-1">{errors.categoryId.message}</Text>}
            </View>
        </View>
    );
}
