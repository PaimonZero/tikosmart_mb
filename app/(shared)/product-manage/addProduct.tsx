import Feather from '@expo/vector-icons/Feather';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as yup from 'yup';

import { useProductRouteGuard } from '@/hooks/useProductPermissions';
import { uploadImage } from '@/services/productService';
import { clearSelectedCategory } from '@/store/categorySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchListSuppliers } from '@/store/supplierSlice';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import Components
import ImagePickerBottomSheet from '@/components/product/productForm/ImagePickerBottomSheet';
import ProductClassification from '@/components/product/productForm/ProductClassification';
import ProductGeneralInfo from '@/components/product/productForm/ProductGeneralInfo';
import ProductImagePicker from '@/components/product/productForm/ProductImagePicker';
import ProductInventoryConfig from '@/components/product/productForm/ProductInventoryConfig';
import ProductStorageRule from '@/components/product/productForm/ProductStorageRule';
import ProductUnits from '@/components/product/productForm/ProductUnits';
import SupplierBottomSheet from '@/components/product/productForm/SupplierBottomSheet';
import { createProduct } from '@/store/productSlice';
import { toast } from 'sonner-native';

// Schema Validation
const schema = yup.object({
    skuCode: yup.string().required('Mã SKU là bắt buộc'),
    name: yup.string().required('Tên sản phẩm là bắt buộc'),
    categoryId: yup.string().required('Vui lòng chọn danh mục'),
    supplierId: yup.string().required('Vui lòng chọn nhà cung cấp'),
    lowStockThreshold: yup.number().typeError('Phải là số').min(0, 'Không được âm').required(),
    nearExpiryDays: yup.number().typeError('Phải là số').min(0, 'Không được âm').required(),
    packUnit: yup.string().required('Đơn vị đóng gói là bắt buộc'),
    mainUnit: yup.string().required('Đơn vị chính là bắt buộc'),
    storageRule: yup.string().optional(),
});

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

export default function AddProductScreen() {
    useProductRouteGuard('add');
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Redux State
    const { selectedCategory } = useAppSelector(state => state.category);
    const { suppliers, fetchStatus: supplierStatus, fetchMoreStatus } = useAppSelector(state => state.supplier);
    const supplierList = Array.isArray(suppliers) ? suppliers : suppliers.data || [];
    const supplierPagination = Array.isArray(suppliers) ? null : suppliers.pagination;

    // Local State
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [supplierPage, setSupplierPage] = useState(0);
    const [hasMoreSuppliers, setHasMoreSuppliers] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

    // Form
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: {
            skuCode: '',
            name: '',
            categoryId: '',
            supplierId: '',
            lowStockThreshold: 0,
            nearExpiryDays: 0,
            packUnit: '',
            mainUnit: '',
            storageRule: '',
        }
    });

    // Update Category when selected from Screen B
    useEffect(() => {
        if (selectedCategory) {
            setValue('categoryId', selectedCategory.id);
        }
    }, [selectedCategory]);

    // Cleanup: Clear selected category when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearSelectedCategory());
        };
    }, [dispatch]);

    // Bottom Sheet Refs
    const supplierSheetRef = useRef<BottomSheetModal>(null);
    const imageSheetRef = useRef<BottomSheetModal>(null);

    // Handlers
    const handlePickImage = async (mode: 'camera' | 'library') => {
        imageSheetRef.current?.dismiss();
        let result;

        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: undefined,
            quality: 0.8,
        };

        if (mode === 'camera') {
            const permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Quyền truy cập", "Cần quyền truy cập camera để chụp ảnh");
                return;
            }
            result = await ImagePicker.launchCameraAsync(options);
        } else {
            result = await ImagePicker.launchImageLibraryAsync(options);
        }

        if (!result.canceled) {
            const asset = result.assets[0];

            // Validate File Size (Max 2MB)
            if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
                toast.error("Ảnh quá lớn", { description: "Vui lòng chọn ảnh dưới 2MB" });
                return;
            }

            // Validate File Type
            const validExtensions = ['png', 'gif', 'heic', 'jpg', 'jpeg'];
            const fileExtension = asset.uri.split('.').pop()?.toLowerCase();

            if (!fileExtension || !validExtensions.includes(fileExtension)) {
                toast.error("Định dạng không hỗ trợ", { description: "Chỉ chấp nhận PNG, GIF, HEIC, JPG" });
                return;
            }

            setImageUri(asset.uri);
        }
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            let imgUrl = '';
            if (imageUri) {
                const uploadRes = await uploadImage(imageUri);
                imgUrl = uploadRes.url;
            }

            dispatch(createProduct({
                ...data,
                imgUrl,
            }));

            toast.success("Tạo sản phẩm thành công", { duration: 2000 });
            router.back();
        } catch (error: any) {
            toast.error("Không thể tạo sản phẩm", { description: error?.message || "Lỗi khi tạo sản phẩm", duration: 2000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Suppliers Fetch
    useEffect(() => {
        dispatch(fetchListSuppliers({ limit: 10, offset: 0 })); // Init fetch
    }, []);

    // Update hasMore when pagination changes
    useEffect(() => {
        if (supplierPagination) {
            const { total, offset, limit } = supplierPagination;
            const currentCount = (offset || 0) + supplierList.length;
            setHasMoreSuppliers(currentCount < (total || 0));
        }
    }, [supplierPagination, supplierList]);

    // Load more suppliers
    const loadMoreSuppliers = () => {
        if (fetchMoreStatus === 'loading' || !hasMoreSuppliers) return;

        const nextOffset = (supplierPage + 1) * 10;
        setSupplierPage(supplierPage + 1);
        dispatch(fetchListSuppliers({ limit: 10, offset: nextOffset }));
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                    {/* Header */}
                    <View className="px-4 py-3 border-b border-gray-100 flex-row items-center mb-2">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Feather name="chevron-left" size={28} color="#333" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold flex-1 text-center mr-8">Thêm sản phẩm</Text>
                    </View>

                    <KeyboardAwareScrollView className="flex-1" extraScrollHeight={100} enableOnAndroid>
                        <View className="p-4 gap-6 pb-24">

                            {/* Image Section */}
                            <ProductImagePicker
                                imageUri={imageUri}
                                onPress={() => imageSheetRef.current?.present()}
                            />

                            {/* General Info */}
                            <ProductGeneralInfo control={control} errors={errors} />

                            {/* Classification */}
                            <ProductClassification
                                control={control}
                                errors={errors}
                                watch={watch}
                                supplierList={supplierList}
                                selectedSupplier={selectedSupplier}
                                selectedCategory={selectedCategory}
                                onSupplierPress={() => supplierSheetRef.current?.present()}
                                onCategoryPress={() => router.push('/(shared)/category-manage/select')}
                            />

                            {/* Inventory */}
                            <ProductInventoryConfig control={control} errors={errors} />

                            {/* Units */}
                            <ProductUnits control={control} errors={errors} />

                            {/* Storage Rule */}
                            <ProductStorageRule control={control} />

                        </View>
                    </KeyboardAwareScrollView>

                    {/* Footer Button */}
                    <View className="p-4 mb-3 border-t border-gray-100 bg-white">
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className={`w-full py-3 rounded-xl items-center ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600'}`}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-lg">Tạo sản phẩm</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Modals */}

                    {/* Supplier Bottom Sheet */}
                    <SupplierBottomSheet
                        sheetRef={supplierSheetRef}
                        supplierList={supplierList}
                        fetchMoreStatus={fetchMoreStatus}
                        hasMoreSuppliers={hasMoreSuppliers}
                        onSelectSupplier={(supplier) => {
                            setValue('supplierId', supplier.id);
                            setSelectedSupplier(supplier);
                        }}
                        onLoadMore={loadMoreSuppliers}
                    />

                    {/* Image Picker Sheet */}
                    <ImagePickerBottomSheet
                        sheetRef={imageSheetRef}
                        onPickImage={handlePickImage}
                    />

                </SafeAreaView>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
