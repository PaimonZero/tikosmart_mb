import { createCategory, updateCategory } from '@/store/categorySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import AntDesign from '@expo/vector-icons/AntDesign';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import * as yup from 'yup';

const schema = yup.object({
    name: yup.string().required('Tên danh mục là bắt buộc').trim(),
});

type FormData = yup.InferType<typeof schema>;

export default function CategoryUpsertScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useLocalSearchParams();
    const isEdit = !!params.id;

    const { createStatus, updateStatus } = useAppSelector((state) => state.category);
    const isLoading = createStatus === 'loading' || updateStatus === 'loading';

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: (params.name as string) || '',
        }
    });

    useEffect(() => {
        if (params.name) {
            setValue('name', params.name as string);
        }
    }, [params]);

    const onSubmit = async (data: FormData) => {
        try {
            if (isEdit) {
                await dispatch(updateCategory({ id: params.id as string, data })).unwrap();
                toast.success("Cập nhật danh mục thành công", { duration: 2000 });
                router.back();
            } else {
                await dispatch(createCategory(data)).unwrap();
                toast.success("Tạo danh mục thành công", { duration: 2000 });
                router.back();
            }
        } catch (error: any) {
            toast.error(error?.message || "Có lỗi xảy ra", { duration: 2000 });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 py-3 border-b border-gray-100 flex-row items-center gap-3">
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="left" size={24} color="#333" />
                </TouchableOpacity>
                <Text className="text-xl font-bold flex-1 text-center mr-8">
                    {isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}
                </Text>
            </View>

            <View className="p-4">
                <Text className="text-gray-700 font-medium mb-2">Tên danh mục <Text className="text-red-500">*</Text></Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className={`border rounded-lg px-4 py-3 text-base ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="Nhập tên danh mục"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            autoFocus
                        />
                    )}
                />
                {errors.name && <Text className="text-red-500 mt-1">{errors.name.message}</Text>}

                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className={`mt-6 rounded-lg py-4 items-center ${isLoading ? 'bg-blue-300' : 'bg-blue-600'}`}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">
                            {isEdit ? 'Lưu thay đổi' : 'Tạo mới'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
