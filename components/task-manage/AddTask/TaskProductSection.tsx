import { LotItem } from '@/components/task-manage/AddTask/LotPickerSheet';
import ProductItemRow from '@/components/task-manage/AddTask/ProductItemRow';
import { TaskItemRow } from '@/hooks/useTaskSubmit';
import React from 'react';
import { Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

interface TaskProductSectionProps {
    items: TaskItemRow[];
    lotsByItem: Record<string, LotItem[]>;
    departmentId: string;
    onLotFetched: (orderItemId: string, lots: LotItem[]) => void;
    onChange: (key: string, field: keyof TaskItemRow, value: any) => void;
    onAddSubRow: (item: TaskItemRow) => void;
    onDelete: (key: string) => void;
}

const TaskProductSection = ({
    items,
    lotsByItem,
    departmentId,
    onLotFetched,
    onChange,
    onAddSubRow,
    onDelete,
}: TaskProductSectionProps) => {
    return (
        <>
            {/* Section header */}
            <View className="mt-5 mb-2 px-2 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Feather name="package" size={20} color="#4F46E5" />
                    <Text className="text-base font-bold text-gray-700 ml-2">Danh sách sản phẩm</Text>
                </View>
                <Text className="text-sm text-gray-400">{items.length} sản phẩm</Text>
            </View>

            {/* Items */}
            {items.length === 0 ? (
                <View className="items-center py-10 mx-2 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Text className="text-3xl mb-2"><Feather name="package" size={20} color="#4F46E5" /></Text>
                    <Text className="text-gray-400 text-sm">Không có sản phẩm cần chuẩn bị</Text>
                </View>
            ) : (
                items.map((item) => {
                    const isSubRow = item.key.includes('-sub-');
                    return (
                        <ProductItemRow
                            key={item.key}
                            item={item}
                            lotsByItem={lotsByItem}
                            allItems={items}
                            departmentId={departmentId}
                            onLotFetched={onLotFetched}
                            onChange={onChange}
                            onAddSubRow={onAddSubRow}
                            onDelete={onDelete}
                            isSubRow={isSubRow}
                        />
                    );
                })
            )}
        </>
    );
};

export default TaskProductSection;
