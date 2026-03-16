import { LotItem } from '@/components/task-manage/AddTask/LotPickerSheet';
import TaskBasicInfoCard from '@/components/task-manage/AddTask/TaskBasicInfoCard';
import TaskFormHeader from '@/components/task-manage/AddTask/TaskFormHeader';
import TaskProductSection from '@/components/task-manage/AddTask/TaskProductSection';
import { PickerUser } from '@/hooks/usePickerList';
import { useTaskPermission, useTaskRouteGuard } from '@/hooks/useTaskPermission';
import { TaskItemRow, useTaskSubmit } from '@/hooks/useTaskSubmit';
import { getProductById } from '@/services/productService';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

export default function AddTaskFormScreen() {
    useTaskRouteGuard('add');
    const { user } = useTaskPermission();

    const {
        orderId,
        orderNo,
        customerName,
        departmentId,
        orderItems: orderItemsJson,
    } = useLocalSearchParams<{
        orderId: string;
        orderNo: string;
        customerName: string;
        departmentId: string;
        orderItems: string;
    }>();

    // Parse items từ JSON param
    const parsedItems: any[] = useMemo(() => {
        try {
            return orderItemsJson ? JSON.parse(orderItemsJson) : [];
        } catch {
            return [];
        }
    }, [orderItemsJson]);

    // ─── Form state ───
    const [packerId, setPackerId] = useState('');
    const [packerName, setPackerName] = useState('');
    const [packerAvatar, setPackerAvatar] = useState('');
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [note, setNote] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    // ─── Items ───
    const [items, setItems] = useState<TaskItemRow[]>([]);
    const [lotsByItem, setLotsByItem] = useState<Record<string, LotItem[]>>({});

    const packerSheetRef = useRef<BottomSheetModal>(null);
    const { submit, submitting } = useTaskSubmit();

    // Auto-populate sản phẩm từ params và fetch details (ảnh, sku)
    useEffect(() => {
        if (parsedItems.length > 0) {
            const validItems: TaskItemRow[] = parsedItems.map((i: any) => ({
                key: i.id,
                orderItemId: i.id,
                lotId: undefined,
                preQty: 0,
                note: '',
                productName: i.productName,
                image: i.image, // từ params nếu có
                sku: i.sku,     // từ params nếu có
                remain: i.remain,
                productId: i.productId,
            }));

            setItems(validItems);

            // Fetch thêm details nếu thiếu image hoặc sku
            const productIds = [...new Set(validItems.map(i => i.productId).filter(Boolean))] as string[];
            if (productIds.length > 0) {
                Promise.allSettled(productIds.map(pid => getProductById(pid)))
                    .then(results => {
                        const detailMap: Record<string, any> = {};
                        results.forEach(result => {
                            if (result.status === "fulfilled") {
                                const data = result.value.data?.data ?? result.value.data;
                                if (data?.id) detailMap[data.id] = data;
                            }
                        });

                        setItems(prevItems => prevItems.map(item => {
                            const detail = detailMap[item.productId];
                            if (detail) {
                                return {
                                    ...item,
                                    image: item.image || detail.imgUrl,
                                    sku: item.sku || detail.skuCode,
                                    productName: detail.name || item.productName
                                };
                            }
                            return item;
                        }));
                    })
                    .catch(err => console.error("Error fetching product details in AddTaskForm", err));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Handlers ───
    const handleLotFetched = useCallback((orderItemId: string, lots: LotItem[]) => {
        setLotsByItem((prev) => ({ ...prev, [orderItemId]: lots }));
    }, []);

    const handleItemChange = useCallback((key: string, field: keyof TaskItemRow, value: any) => {
        setItems((prev) => prev.map((i) => (i.key === key ? { ...i, [field]: value } : i)));
    }, []);

    const handleAddSubRow = useCallback((item: TaskItemRow) => {
        const newRow: TaskItemRow = {
            ...item,
            key: `${item.key}-sub-${Date.now()}`,
            lotId: undefined,
            preQty: 0,
            note: '',
        };
        setItems((prev) => {
            const index = prev.findIndex((i) => i.key === item.key);
            if (index === -1) return [...prev, newRow];
            const newItems = [...prev];
            newItems.splice(index + 1, 0, newRow);
            return newItems;
        });
    }, []);

    const handleDeleteRow = useCallback((key: string) => {
        setItems((prev) => prev.filter((i) => i.key !== key));
    }, []);

    const handlePackerSelect = useCallback((pickerUser: PickerUser) => {
        setPackerId(pickerUser.id);
        setPackerName(pickerUser.fullName || pickerUser.username);
        setPackerAvatar(pickerUser.avatar || '');
    }, []);

    const handleDateChange = useCallback((date?: Date) => {
        setShowDatePicker(false);
        if (date) setDeadline(date);
    }, []);

    const handleSubmit = async () => {
        if (!packerId) {
            toast.warning('Vui lòng chọn người đóng gói');
            return;
        }
        if (!deadline) {
            toast.warning('Vui lòng chọn hạn chót');
            return;
        }
        if (!orderId) return;
        await submit(orderId, { packerId, deadline, note }, items);
    };
    return (
        <BottomSheetModalProvider>
            <SafeAreaView className="flex-1 bg-gray-100" edges={['top', 'bottom']}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />

                {/* ─── Custom Header ─── */}
                <TaskFormHeader orderNo={orderNo} />

                {/* ─── Scrollable Content ─── */}
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 110 }}
                    enableOnAndroid
                    extraScrollHeight={24}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Thông tin chung */}
                    <TaskBasicInfoCard
                        orderNo={orderNo}
                        customerName={customerName}
                        supervisorName={user?.fullName}
                        supervisorAvatar={user?.avatar}
                        packerId={packerId}
                        packerName={packerName}
                        packerAvatar={packerAvatar}
                        deadline={deadline}
                        note={note}
                        showDatePicker={showDatePicker}
                        packerSheetRef={packerSheetRef}
                        onNoteChange={setNote}
                        onOpenDatePicker={() => setShowDatePicker(true)}
                        onDateChange={handleDateChange}
                        onPackerSelect={handlePackerSelect}
                    />

                    {/* Danh sách sản phẩm */}
                    <TaskProductSection
                        items={items}
                        lotsByItem={lotsByItem}
                        departmentId={departmentId || ''}
                        onLotFetched={handleLotFetched}
                        onChange={handleItemChange}
                        onAddSubRow={handleAddSubRow}
                        onDelete={handleDeleteRow}
                    />
                </KeyboardAwareScrollView>

                {/* ─── Sticky Footer ─── */}
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 pb-6 shadow-lg">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={submitting}
                        activeOpacity={0.8}
                        className={`rounded-xl py-4 items-center ${submitting ? 'bg-blue-300' : 'bg-blue-600'}`}
                    >
                        <Text className="text-white font-bold text-lg">
                            {submitting ? 'Đang tạo...' : 'Tạo nhiệm vụ'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </BottomSheetModalProvider>
    );
}
