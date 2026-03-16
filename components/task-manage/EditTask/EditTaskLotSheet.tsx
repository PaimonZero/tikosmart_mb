import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Box, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface EditLotItem {
  id: string;
  lotNo: string;
  qtyOnHand: number;
  mainUnit?: string;
  expiryDate?: string;
}

interface EditTaskLotSheetProps {
  lots: EditLotItem[];
  onSelect: (lot: EditLotItem) => void;
}

const EditTaskLotSheet = forwardRef<BottomSheetModal, EditTaskLotSheetProps>(
  ({ lots, onSelect }, ref) => {
    const snapPoints = useMemo(() => ["60%", "80%"], []);

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

    const renderItem = useCallback(
      ({ item }: { item: EditLotItem }) => (
        <TouchableOpacity
          onPress={() => {
            onSelect(item);
            (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss();
          }}
          activeOpacity={0.7}
          className="flex-row items-center px-4 py-3 border-b border-gray-100"
        >
          <View className="w-9 h-9 rounded-full bg-indigo-100 items-center justify-center mr-3">
            <Box size={16} color="#4F46E5" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800">{item.lotNo}</Text>
            <Text className="text-xs text-gray-500 mt-0.5">
              Tồn: {item.qtyOnHand} {item.mainUnit || ""}
            </Text>
          </View>
        </TouchableOpacity>
      ),
      [onSelect, ref]
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        index={0}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
        backgroundStyle={{
          backgroundColor: "#FAFAFA",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderWidth: 2,
          borderColor: "#E5E7EB",
        }}
      >
        <BottomSheetView className="flex-1">
          <View className="flex-row items-center justify-between px-4 pb-3 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-800">Chọn lô hàng</Text>
            <TouchableOpacity onPress={() => (ref as React.RefObject<BottomSheetModal>)?.current?.dismiss()}>
              <X size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <BottomSheetFlatList
            data={lots}
            keyExtractor={(item: EditLotItem) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <View className="items-center py-12">
                <Box size={36} color="#D1D5DB" />
                  <Text className="text-gray-400 mt-2 text-sm">Không có lô hàng phù hợp</Text>
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default EditTaskLotSheet;
