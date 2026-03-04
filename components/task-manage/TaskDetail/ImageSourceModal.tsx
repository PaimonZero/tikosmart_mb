import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

type ImageSourceModalProps = {
    visible: boolean;
    onClose: () => void;
    onPickFromLibrary: () => void;
    onTakePhoto: () => void;
    disabled?: boolean;
};

export default function ImageSourceModal({
    visible,
    onClose,
    onPickFromLibrary,
    onTakePhoto,
    disabled,
}: ImageSourceModalProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);

    // snap points representing the height
    const snapPoints = useMemo(() => ['35%', '40%'], []);

    // callbacks
    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                onClose();
            }
        },
        [onClose]
    );

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        []
    );

    // effects
    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: 'white', borderRadius: 24 }}
            handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
        >
            <BottomSheetView className="flex-1 px-5 pt-2 pb-8">
                <Text className="text-lg font-bold text-gray-900 mb-1">Tải ảnh minh chứng</Text>
                <Text className="text-sm text-gray-500 mb-6">Chọn cách bạn muốn cung cấp hình ảnh cho sản phẩm</Text>

                <View className="gap-3">
                    <Pressable
                        disabled={!!disabled}
                        onPress={() => {
                            bottomSheetRef.current?.close();
                            onPickFromLibrary();
                        }}
                        className={`w-full flex-row items-center rounded-2xl px-4 py-4 border border-gray-200 bg-white ${disabled ? 'opacity-60' : ''}`}
                    >
                        <Ionicons name="images-outline" size={24} color="#374151" />
                        <Text className="text-base font-semibold text-gray-900 ml-3">Chọn từ thư viện</Text>
                    </Pressable>

                    <Pressable
                        disabled={!!disabled}
                        onPress={() => {
                            bottomSheetRef.current?.close();
                            onTakePhoto();
                        }}
                        className={`w-full flex-row items-center rounded-2xl px-4 py-4 border border-gray-200 bg-white ${disabled ? 'opacity-60' : ''}`}
                    >
                        <Ionicons name="camera-outline" size={24} color="#374151" />
                        <Text className="text-base font-semibold text-gray-900 ml-3">Chụp ảnh mới</Text>
                    </Pressable>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}
