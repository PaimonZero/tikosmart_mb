import LotPickerSheet, { LotItem } from '@/components/task-manage/AddTask/LotPickerSheet';
import { TaskItemRow } from '@/hooks/useTaskSubmit';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { Box, CornerDownRight, Layers, Minus, Plus, Trash2 } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { toast } from 'sonner-native';

interface ProductItemRowProps {
    item: TaskItemRow;
    lotsByItem: Record<string, LotItem[]>;
    allItems: TaskItemRow[];
    departmentId: string;
    onLotFetched: (orderItemId: string, lots: LotItem[]) => void;
    onChange: (key: string, field: keyof TaskItemRow, value: any) => void;
    onAddSubRow: (item: TaskItemRow) => void;
    onDelete: (key: string) => void;
    isSubRow?: boolean;
}

const ProductItemRow = ({
    item,
    lotsByItem,
    allItems,
    departmentId,
    onLotFetched,
    onChange,
    onAddSubRow,
    onDelete,
    isSubRow = false,
}: ProductItemRowProps) => {
    const lotSheetRef = useRef<BottomSheetModal>(null);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

    const lots = lotsByItem[item.orderItemId] || [];
    const selectedLot = lots.find((l) => l.id === item.lotId);
    const lotQty = selectedLot?.qtyOnHand || 0;

    // Tổng preQty của các dòng khác cùng orderItemId
    const totalOtherQty = allItems
        .filter((i) => i.orderItemId === item.orderItemId && i.key !== item.key)
        .reduce((sum, i) => sum + (Number(i.preQty) || 0), 0);

    const remainAvailable = Math.max(item.remain - totalOtherQty, 0);
    const maxQty = item.lotId ? Math.min(remainAvailable, lotQty) : remainAvailable;

    const handleQtyChange = useCallback((delta: number) => {
        const newVal = Math.max(0, Math.min(maxQty, (item.preQty || 0) + delta));
        onChange(item.key, 'preQty', newVal);
    }, [item.key, item.preQty, maxQty, onChange]);

    const handleQtyInput = useCallback((text: string) => {
        const num = parseInt(text) || 0;
        if (num > maxQty) {
            toast.warning(`Số lượng tối đa là ${maxQty}`);
            onChange(item.key, 'preQty', maxQty);
        } else {
            onChange(item.key, 'preQty', num);
        }
    }, [item.key, maxQty, onChange]);

    const renderCard = () => (
        <View className={`bg-white mb-2 rounded-xl border overflow-hidden ${
            isSubRow 
                ? 'border-dashed border-indigo-200 bg-indigo-50/20 shadow-none' 
                : 'border-gray-200 shadow-sm'
        }`}>
            {/* Product name header */}
            <View className={`px-4 pt-3 pb-3 flex-row items-center ${isSubRow ? 'bg-indigo-100/30' : 'bg-gray-50'} border-b border-gray-100`}>
                {item.image && !isSubRow ? (
                    <>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsImageViewerVisible(true)}>
                            <Image
                                source={{ uri: item.image }}
                                style={{ width: 60, height: 60, borderRadius: 6 }}
                                contentFit="cover"
                                className="mr-3 border border-gray-200"
                            />
                        </TouchableOpacity>

                        <ImageView
                            images={[{ uri: item.image }]}
                            imageIndex={0}
                            visible={isImageViewerVisible}
                            onRequestClose={() => setIsImageViewerVisible(false)}
                            presentationStyle="overFullScreen"
                        />
                    </>
                ) : (
                    <View className={`w-10 h-10 rounded-md items-center justify-center mr-3 border ${
                        isSubRow ? 'bg-indigo-100 border-indigo-200' : 'bg-gray-200 border-gray-300'
                    }`}>
                        {isSubRow ? (
                            <Layers size={20} color="#4F46E5" />
                        ) : (
                            <Box size={20} color="#9CA3AF" />
                        )}
                    </View>
                )}

                <View className="flex-1 justify-center ml-2">
                    <View className="flex-row items-center flex-wrap">
                        <Text className={`text-base font-bold leading-tight mr-2 ${
                            isSubRow ? 'text-indigo-600/80 font-semibold' : 'text-gray-800'
                        }`} numberOfLines={1}>
                            {item.productName}
                        </Text>
                        {isSubRow && (
                            <View className="bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200">
                                <Text className="text-[10px] font-bold text-indigo-600 uppercase">Lô bổ sung</Text>
                            </View>
                        )}
                    </View>
                    {item.sku && (
                        <Text className="text-xs text-gray-500 mt-0.5">{item.sku}</Text>
                    )}
                </View>

                <View className="bg-blue-100 px-2.5 py-1 rounded-full ml-3 mt-1 self-start">
                    <Text className="text-sm font-bold text-blue-600">Còn {item.remain}</Text>
                </View>
            </View>

            <View className="px-4 py-3 gap-y-3">
                {/* Lô hàng selector */}
                <View>
                    <Text className="text-sm text-gray-500 mb-1.5 font-medium">Lô hàng</Text>
                    <TouchableOpacity
                        onPress={() => lotSheetRef.current?.present()}
                        activeOpacity={0.7}
                        className={`flex-row items-center justify-between border rounded-lg px-3 py-2.5 ${item.lotId ? 'bg-indigo-50 border-indigo-300' : 'bg-gray-50 border-gray-200'}`}
                    >
                        {item.lotId && selectedLot ? (
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-indigo-700">{selectedLot.lotNo}</Text>
                                <Text className="text-xs text-gray-500 mt-0.5">
                                    Tồn: {selectedLot.qtyOnHand} {selectedLot.mainUnit}
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-sm text-gray-400 flex-1">Chọn lô hàng...</Text>
                        )}
                        <Box size={16} color={item.lotId ? '#4F46E5' : '#9CA3AF'} />
                    </TouchableOpacity>
                </View>

                {/* Số lượng chuẩn bị */}
                <View>
                    <Text className="text-sm text-gray-500 mb-1.5 font-medium">
                        Số lượng chuẩn bị <Text className="text-gray-400">(tối đa: {maxQty})</Text>
                    </Text>
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => handleQtyChange(-1)}
                            className="w-9 h-9 rounded-lg bg-gray-100 items-center justify-center border border-gray-200"
                        >
                            <Minus size={16} color="#374151" />
                        </TouchableOpacity>
                        <TextInput
                            value={String(item.preQty || 0)}
                            onChangeText={handleQtyInput}
                            keyboardType="numeric"
                            className="flex-1 mx-2 text-center text-base font-bold text-gray-800 border border-gray-200 rounded-lg py-2 bg-white"
                        />
                        <TouchableOpacity
                            onPress={() => handleQtyChange(1)}
                            className={`w-9 h-9 rounded-lg items-center justify-center border ${item.preQty >= maxQty ? 'bg-gray-100 border-gray-200' : 'bg-blue-600 border-blue-600'}`}
                            disabled={item.preQty >= maxQty}
                        >
                            <Plus size={16} color={item.preQty >= maxQty ? '#9CA3AF' : '#FFFFFF'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Ghi chú */}
                <View>
                    <Text className="text-sm text-gray-500 mb-1.5 font-medium">Ghi chú</Text>
                    <TextInput
                        value={item.note}
                        onChangeText={(text) => onChange(item.key, 'note', text)}
                        placeholder="Ghi chú cho sản phẩm này..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={2}
                        style={{ textAlignVertical: 'top' }}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 min-h-[60px]"
                    />
                </View>

                {/* Actions */}
                <View className="flex-row justify-between pt-1">
                    {!isSubRow && (
                        <TouchableOpacity
                            onPress={() => onAddSubRow(item)}
                            activeOpacity={0.7}
                            className="flex-row items-center px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-200"
                        >
                            <Plus size={16} color="#4F46E5" />
                            <Text className="text-sm font-medium text-indigo-600 ml-1">Thêm lô</Text>
                        </TouchableOpacity>
                    )}
                    {isSubRow && (
                        <TouchableOpacity
                            onPress={() => onDelete(item.key)}
                            activeOpacity={0.7}
                            className="flex-row items-center px-3 py-1.5 bg-red-50 rounded-lg border border-red-200 ml-auto"
                        >
                            <Trash2 size={16} color="#EF4444" />
                            <Text className="text-sm font-medium text-red-500 ml-1">Xoá</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Lot picker sheet */}
            <LotPickerSheet
                ref={lotSheetRef}
                departmentId={departmentId}
                productId={item.productId}
                onSelect={(lot) => {
                    onChange(item.key, 'lotId', lot.id);
                    // cache lots cho orderItem này
                    onLotFetched(item.orderItemId, lots.length ? lots : [lot]);
                }}
            />
        </View>
    );

    if (isSubRow) {
        return (
            <View className="flex-row items-start mx-2 mb-2">
                <View className="w-8 items-center pt-2">
                    <CornerDownRight size={22} color="#C7D2FE" />
                </View>
                <View className="flex-1">
                    {renderCard()}
                </View>
            </View>
        );
    }

    return (
        <View className="mx-2 mb-2">
            {renderCard()}
        </View>
    );
};

export default ProductItemRow;
