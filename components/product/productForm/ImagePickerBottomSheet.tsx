import { Ionicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { RefObject, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ImagePickerBottomSheetProps {
    sheetRef: RefObject<BottomSheetModal | null>;
    onPickImage: (mode: 'camera' | 'library') => void;
}

export default function ImagePickerBottomSheet({ sheetRef, onPickImage }: ImagePickerBottomSheetProps) {
    const snapPoints = useMemo(() => ['35%'], []);

    return (
        <BottomSheetModal
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: 'white' }}
            handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
            backdropComponent={(props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />}
        >
            <BottomSheetView className="flex-1 px-6 py-4">
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-gray-800 text-center">Chọn ảnh sản phẩm</Text>
                    <Text className="text-sm text-gray-500 text-center mt-1">Chọn nguồn ảnh của bạn</Text>
                </View>

                {/* Options */}
                <View className="gap-3 pb-5">
                    {/* Camera Option */}
                    <TouchableOpacity
                        onPress={() => onPickImage('camera')}
                        className="flex-row items-center bg-blue-50 rounded-2xl p-4 border border-blue-100 active:bg-blue-100"
                    >
                        <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                            <Ionicons name="camera" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-800">Chụp ảnh mới</Text>
                            <Text className="text-sm text-gray-500">Sử dụng camera để chụp</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Library Option */}
                    <TouchableOpacity
                        onPress={() => onPickImage('library')}
                        className="flex-row items-center bg-purple-50 rounded-2xl p-4 border border-purple-100 active:bg-purple-100"
                    >
                        <View className="w-12 h-12 bg-purple-500 rounded-full items-center justify-center mr-4">
                            <Ionicons name="images" size={24} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-800">Chọn từ thư viện</Text>
                            <Text className="text-sm text-gray-500">Chọn ảnh có sẵn</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
}
