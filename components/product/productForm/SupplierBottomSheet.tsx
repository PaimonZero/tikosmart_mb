import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { RefObject, useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface SupplierBottomSheetProps {
    sheetRef: RefObject<BottomSheetModal | null>;
    supplierList: any[];
    fetchMoreStatus: string;
    hasMoreSuppliers: boolean;
    onSelectSupplier: (supplier: any) => void;
    onLoadMore: () => void;
}

export default function SupplierBottomSheet({
    sheetRef,
    supplierList,
    fetchMoreStatus,
    hasMoreSuppliers,
    onSelectSupplier,
    onLoadMore,
}: SupplierBottomSheetProps) {
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    const renderSupplierItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="p-4 border-b border-gray-100"
            onPress={() => {
                onSelectSupplier(item);
                sheetRef.current?.dismiss();
            }}
        >
            <Text className="text-base text-gray-800">{item.name}</Text>
        </TouchableOpacity>
    );

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
            <BottomSheetView className="flex-1 p-4">
                <Text className="text-xl font-bold mb-4">Chọn nhà cung cấp</Text>
                <BottomSheetFlatList
                    data={supplierList}
                    keyExtractor={(item: any) => item.id}
                    renderItem={renderSupplierItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    onEndReached={onLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        fetchMoreStatus === 'loading' ? (
                            <View className="py-4 items-center">
                                <ActivityIndicator size="small" color="#3B82F6" />
                            </View>
                        ) : null
                    }
                />
            </BottomSheetView>
        </BottomSheetModal>
    );
}
