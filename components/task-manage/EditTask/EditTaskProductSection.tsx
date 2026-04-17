import { EditLotItem } from "@/components/task-manage/EditTask/EditTaskLotSheet";
import EditTaskProductRow, { EditTaskItemRow } from "@/components/task-manage/EditTask/EditTaskProductRow";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text, View } from "react-native";

interface EditTaskProductSectionProps {
  items: EditTaskItemRow[];
  lotsByItem: Record<string, EditLotItem[]>;
  onChange: (key: string, field: keyof EditTaskItemRow, value: any) => void;
}

export default function EditTaskProductSection({
  items,
  lotsByItem,
  onChange,
}: EditTaskProductSectionProps) {
  return (
    <>
      <View className="mt-5 mb-2 px-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Feather name="package" size={20} color="#4F46E5" />
          <Text className="text-base font-bold text-gray-700 ml-2">Danh sách sản phẩm</Text>
        </View>
        <Text className="text-sm text-gray-400">{items.length} sản phẩm</Text>
      </View>

      {items.length === 0 ? (
        <View className="items-center py-10 mx-2 bg-white rounded-2xl border border-dashed border-gray-200">
          <Text className="text-gray-400 text-sm">Không có sản phẩm cần cập nhật</Text>
        </View>
      ) : (
        items.map((item) => (
          <EditTaskProductRow
            key={item.key}
            item={item}
            allItems={items}
            lotsByItem={lotsByItem}
            onChange={onChange}
          />
        ))
      )}
    </>
  );
}
