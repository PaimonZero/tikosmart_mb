import EditTaskLotSheet, { EditLotItem } from "@/components/task-manage/EditTask/EditTaskLotSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Box, Minus, Package, Plus } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import ImageView from "react-native-image-viewing";
import { toast } from "sonner-native";

export interface EditTaskItemRow {
  key: string;
  itemId: string;
  orderItemId: string;
  lotId?: string;
  preQty: number;
  postQty?: number;
  note: string;
  productName: string;
  image?: string;
  sku?: string;
  remain: number;
  productId: string;
  preEvd?: string;
  postEvd?: string;
  initPreQty: number;
  initRemain: number;
  initTotalNeeded: number;
}

interface EditTaskProductRowProps {
  item: EditTaskItemRow;
  allItems: EditTaskItemRow[];
  lotsByItem: Record<string, EditLotItem[]>;
  onChange: (key: string, field: keyof EditTaskItemRow, value: any) => void;
}

export default function EditTaskProductRow({
  item,
  allItems,
  lotsByItem,
  onChange,
}: EditTaskProductRowProps) {
  const lotSheetRef = useRef<BottomSheetModal>(null);
  const lots = lotsByItem[item.orderItemId] || [];
  const selectedLot = useMemo(() => lots.find((l) => l.id === item.lotId), [lots, item.lotId]);

  const [viewerVisible, setViewerVisible] = useState(false);

  const maxQty = useMemo(() => {
    const sameItems = allItems.filter((i) => i.orderItemId === item.orderItemId);

    const initPreSum = sameItems.reduce(
      (sum, i) => sum + (Number(i.initPreQty) || 0),
      0
    );
    const initRemainOnce = sameItems.length > 0
      ? Math.max(...sameItems.map((i) => Number(i.initRemain || 0)))
      : 0;
    const groupTarget = initPreSum + initRemainOnce;

    const totalOtherQty = sameItems
      .filter((i) => i.key !== item.key)
      .reduce((sum, i) => sum + (Number(i.preQty) || 0), 0);

    const remainAvailable = Math.max(groupTarget - totalOtherQty, 0);

    const lotQty = selectedLot?.qtyOnHand || 0;
    const lotQtyAvailable = lotQty + Number(item.initPreQty || 0);

    return item.lotId
      ? Math.min(remainAvailable, lotQtyAvailable)
      : remainAvailable;
  }, [allItems, item.key, item.lotId, item.orderItemId, item.initPreQty, item.initRemain, selectedLot?.qtyOnHand]);

  const handleQtyChange = useCallback(
    (delta: number) => {
      const newVal = Math.max(0, Math.min(maxQty, (item.preQty || 0) + delta));
      onChange(item.key, "preQty", newVal);
    },
    [item.key, item.preQty, maxQty, onChange]
  );

  const handleQtyInput = useCallback(
    (text: string) => {
      const num = parseInt(text) || 0;
      if (num > maxQty) {
        toast.warning(`Số lượng tối đa là ${maxQty}`);
        onChange(item.key, "preQty", maxQty);
      } else {
        onChange(item.key, "preQty", num);
      }
    },
    [item.key, maxQty, onChange]
  );
  return (
    <View className="bg-white mb-2 mx-2 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <View className="px-4 pt-4 pb-3 flex-row items-center border-b border-gray-100/50">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => item.image && setViewerVisible(true)}
          className="w-14 h-14 rounded-xl bg-gray-50 items-center justify-center mr-3 border border-gray-100 overflow-hidden"
        >
          {item.image ? (
            <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Package size={24} color="#9CA3AF" />
          )}
        </TouchableOpacity>
        <View className="flex-1 justify-center ml-1">
          <Text className="text-base font-bold leading-tight text-gray-900 pr-2" numberOfLines={2}>
            {item.productName}
          </Text>
          <View className="mt-1">
            <Text className="text-xs text-blue-600 font-medium">{item.sku || "N/A"}</Text>
          </View>
        </View>
        <View className="bg-blue-100 px-2.5 py-1 rounded-full ml-3 mt-1 self-start">
          <Text className="text-sm font-bold text-blue-600">Còn {item.remain}</Text>
        </View>
      </View>

      <View className="px-4 py-3 gap-y-3">
        <View>
          <Text className="text-sm text-gray-500 mb-1.5 font-medium">Lô hàng</Text>
          <TouchableOpacity
            onPress={() => lotSheetRef.current?.present()}
            activeOpacity={0.7}
            className={`flex-row items-center justify-between border rounded-lg px-3 py-2.5 ${item.lotId ? "bg-indigo-50 border-indigo-300" : "bg-gray-50 border-gray-200"}`}
          >
            {item.lotId && selectedLot ? (
              <View className="flex-1">
                <Text className="text-sm font-semibold text-indigo-700">{selectedLot.lotNo}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Tồn: {selectedLot.qtyOnHand} {selectedLot.mainUnit || ""}
                </Text>
              </View>
            ) : (
              <Text className="text-sm text-gray-400 flex-1">Chọn lô hàng...</Text>
            )}
            <Box size={16} color={item.lotId ? "#4F46E5" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>

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
              className={`w-9 h-9 rounded-lg items-center justify-center border ${item.preQty >= maxQty ? "bg-gray-100 border-gray-200" : "bg-blue-600 border-blue-600"}`}
              disabled={item.preQty >= maxQty}
            >
              <Plus size={16} color={item.preQty >= maxQty ? "#9CA3AF" : "#FFFFFF"} />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text className="text-sm text-gray-500 mb-1.5 font-medium">Ghi chú</Text>
          <TextInput
            value={item.note}
            onChangeText={(text) => onChange(item.key, "note", text)}
            placeholder="Ghi chú cho sản phẩm này..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={2}
            style={{ textAlignVertical: "top" }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 min-h-[60px]"
          />
        </View>
      </View>

      <EditTaskLotSheet
        ref={lotSheetRef}
        lots={lots}
        onSelect={(lot) => onChange(item.key, "lotId", lot.id)}
      />

      {item.image && (
        <ImageView
          images={[{ uri: item.image }]}
          imageIndex={0}
          visible={viewerVisible}
          onRequestClose={() => setViewerVisible(false)}
        />
      )}
    </View>
  );
}
