import { PickerUser, usePickerList } from '@/hooks/usePickerList';
import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetTextInput,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { Search, User, X } from 'lucide-react-native';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PackerPickerSheetProps {
    onSelect: (user: PickerUser) => void;
}

const PackerPickerSheet = forwardRef<BottomSheetModal, PackerPickerSheetProps>(
    ({ onSelect }, ref) => {
        const snapPoints = useMemo(() => ['60%', '80%'], []);
        const { pickers, loading, hasMore, loadInitial, loadMore, search } = usePickerList();
        const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

        useEffect(() => {
            loadInitial();
        }, []);

        const handleSearch = useCallback((text: string) => {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => search(text), 400);
        }, [search]);

        const handleSelect = useCallback((user: PickerUser) => {
            onSelect(user);
            (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
        }, [onSelect, ref]);

        const renderItem = useCallback(({ item }: { item: PickerUser }) => (
            <TouchableOpacity
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
            >
                <View className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Image
                        source={{ uri: item.avatar }}
                        style={{ width: 18, height: 18 }}
                        contentFit="cover"
                    />
                </View>
                <Text className="text-base text-gray-800 font-medium flex-1">{item.fullName}</Text>
            </TouchableOpacity>
        ), [handleSelect]);

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

        const renderFooter = useCallback(() => {
            if (!loading) return null;
            return (
                <View className="py-4 items-center">
                    <ActivityIndicator size="small" color="#2563EB" />
                </View>
            );
        }, [loading]);

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                index={0}
                enableDynamicSizing={false}
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
                backgroundStyle={{
                    backgroundColor: '#FAFAFA', // Màu nền hơi xám sáng/trắng nổi bật
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    borderWidth: 2,
                    borderColor: '#E5E7EB',
                }}
            >
                <BottomSheetView className="flex-1">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 pb-3 border-b border-gray-100">
                        <Text className="text-lg font-bold text-gray-800">Chọn người đóng gói</Text>
                        <TouchableOpacity onPress={() => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()}>
                            <X size={22} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Search */}
                    <View className="flex-row items-center mx-4 mt-3 mb-2 px-3 py-2 bg-gray-100 rounded-xl">
                        <Search size={16} color="#6B7280" />
                        <BottomSheetTextInput
                            placeholder="Tìm theo tên..."
                            placeholderTextColor="#9CA3AF"
                            onChangeText={handleSearch}
                            className="flex-1 ml-2 text-base text-gray-800"
                            style={{ paddingVertical: 0 }}
                        />
                    </View>

                    {/* List */}
                    <BottomSheetFlatList
                        data={pickers}
                        keyExtractor={(item: PickerUser) => item.id}
                        renderItem={renderItem}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.3}
                        ListEmptyComponent={
                            !loading ? (
                                <View className="items-center py-12">
                                    <User size={36} color="#D1D5DB" />
                                    <Text className="text-gray-400 mt-2 text-sm">Không tìm thấy người đóng gói</Text>
                                </View>
                            ) : null
                        }
                    />
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

export default PackerPickerSheet;
