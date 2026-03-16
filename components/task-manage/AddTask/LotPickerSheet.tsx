import { useAppDispatch } from '@/store/hooks';
import { fetchInventoryLotsByDepartmentAndProduct } from '@/store/inventoryLotSlice';
import {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { Box, X } from 'lucide-react-native';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface LotItem {
    id: string;
    lotNo: string;
    qtyOnHand: number;
    mainUnit: string;
    expiryDate?: string;
    [key: string]: any;
}

interface LotPickerSheetProps {
    departmentId: string;
    productId: string;
    onSelect: (lot: LotItem) => void;
}

const LotPickerSheet = forwardRef<BottomSheetModal, LotPickerSheetProps>(
    ({ departmentId, productId, onSelect }, ref) => {
        const dispatch = useAppDispatch();
        const snapPoints = useMemo(() => ['60%', '80%'], []);
        const [lots, setLots] = useState<LotItem[]>([]);
        const [loading, setLoading] = useState(false);

        const loadLots = useCallback(async () => {
            if (!departmentId || !productId) return;
            setLoading(true);
            try {
                const res = await dispatch(
                    fetchInventoryLotsByDepartmentAndProduct({ departmentId, productId, params: {} })
                ).unwrap();

                const data: LotItem[] = (res?.items || res?.data || []).filter(
                    (lot: LotItem) =>
                        lot.qtyOnHand > 0 && new Date(lot.expiryDate || '') > new Date()
                );
                setLots(data);
            } catch (err) {
                console.error('LotPickerSheet loadLots error:', err);
            } finally {
                setLoading(false);
            }
        }, [dispatch, departmentId, productId]);

        useEffect(() => {
            loadLots();
        }, [loadLots]);

        const handleSelect = useCallback((lot: LotItem) => {
            onSelect(lot);
            (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
        }, [onSelect, ref]);

        const renderItem = useCallback(({ item }: { item: LotItem }) => {
            const expiry = item.expiryDate
                ? dayjs(item.expiryDate).format('DD/MM/YYYY')
                : 'N/A';
            const isNearExpiry =
                item.expiryDate &&
                dayjs(item.expiryDate).diff(dayjs(), 'day') <= 30;

            return (
                <TouchableOpacity
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                    className="px-4 py-3.5 border-b border-gray-100"
                >
                    <View className="flex-row items-center justify-between mb-1">
                        <View className="bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                            <Text className="text-sm font-bold text-indigo-600">{item.lotNo}</Text>
                        </View>
                        <Text className="text-sm font-bold text-gray-800">
                            {item.qtyOnHand} {item.mainUnit}
                        </Text>
                    </View>
                    <Text className={`text-xs mt-1 ${isNearExpiry ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>
                        HSD: {expiry} {isNearExpiry ? '⚠️' : ''}
                    </Text>
                </TouchableOpacity>
            );
        }, [handleSelect]);

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                index={0}
                enableDynamicSizing={false}
                enablePanDownToClose
                handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
                backgroundStyle={{
                    backgroundColor: '#FAFAFA',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    borderWidth: 2,
                    borderColor: '#E5E7EB',
                }}
            >
                <BottomSheetView className="flex-1">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 pb-3 border-b border-gray-100">
                        <View className="flex-row items-center">
                            <Box size={18} color="#4F46E5" />
                            <Text className="text-lg font-bold text-gray-800 ml-2">Chọn lô hàng</Text>
                        </View>
                        <TouchableOpacity onPress={() => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()}>
                            <X size={22} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    {loading ? (
                        <View className="flex-1 items-center justify-center py-12">
                            <ActivityIndicator size="large" color="#4F46E5" />
                            <Text className="text-gray-400 mt-2 text-sm">Đang tải lô hàng...</Text>
                        </View>
                    ) : (
                        <BottomSheetFlatList
                            data={lots}
                            keyExtractor={(item: any) => item.id}
                            renderItem={renderItem}
                            ListEmptyComponent={
                                <View className="items-center py-12">
                                    <Box size={36} color="#D1D5DB" />
                                    <Text className="text-gray-400 mt-2 text-sm">Không có lô hàng phù hợp</Text>
                                </View>
                            }
                        />
                    )}
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

export default LotPickerSheet;
