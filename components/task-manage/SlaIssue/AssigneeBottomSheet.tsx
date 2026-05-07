import React, { RefObject } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ListRenderItemInfo } from 'react-native';
import { BottomSheetModal, BottomSheetTextInput, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { AssigneeOption } from './SlaIssueAssignees';

interface AssigneeBottomSheetProps {
  sheetRef: RefObject<BottomSheetModal | null>;
  snapPoints: string[];
  backdrop: (props: any) => React.ReactElement | null;
  keyword: string;
  onKeywordChange: (text: string) => void;
  options: AssigneeOption[];
  selectedAssignees: AssigneeOption[];
  onToggle: (user: AssigneeOption) => void;
  onLoadMore: () => void;
  loading: boolean;
  moreLoading: boolean;
}

const AssigneeBottomSheet: React.FC<AssigneeBottomSheetProps> = ({
  sheetRef,
  snapPoints,
  backdrop,
  keyword,
  onKeywordChange,
  options,
  selectedAssignees,
  onToggle,
  onLoadMore,
  loading,
  moreLoading,
}) => {
  const renderItem = ({ item }: ListRenderItemInfo<AssigneeOption>) => {
    const selected = selectedAssignees.some((a) => a.id === item.id);
    return (
      <TouchableOpacity
        onPress={() => onToggle(item)}
        activeOpacity={0.8}
        className={`px-4 py-3 flex-row items-center justify-between border-b border-gray-100 ${
          selected ? "bg-blue-50" : "bg-white"
        }`}
      >
        <View className="flex-row items-center flex-1">
          {item.avatar ? (
            <Image
              source={{ uri: item.avatar }}
              className="w-9 h-9 rounded-full mr-3"
              resizeMode="cover"
            />
          ) : (
            <View className="w-9 h-9 rounded-full bg-blue-500 mr-3 items-center justify-center">
              <Text className="text-xs font-bold text-white">
                {(item.fullName || "?").trim().charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text
              className="text-sm font-semibold text-gray-800"
              numberOfLines={1}
            >
              {item.fullName}
            </Text>
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              @{item.username}
            </Text>
          </View>
        </View>
        <Text
          className={`text-xs font-semibold ${
            selected ? "text-blue-700" : "text-gray-500"
          }`}
        >
          {selected ? "Đã chọn" : "Chọn"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      backdropComponent={backdrop}
      handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
      backgroundStyle={{
        backgroundColor: "#FAFAFA",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 1,
        borderColor: "#E5E7EB",
      }}
    >
      <View className="px-4 pb-3 border-b border-gray-100 bg-white pt-2 rounded-t-[24px]">
        <Text className="text-lg font-bold text-gray-800">
          Chọn người xử lý
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          Chạm để chọn hoặc bỏ chọn người được tag
        </Text>
      </View>

      <View className="mx-4 mt-3 mb-2">
        <BottomSheetTextInput
          value={keyword}
          onChangeText={onKeywordChange}
          placeholder="Tìm theo tên hoặc username..."
          placeholderTextColor="#9CA3AF"
          className="border border-gray-300 rounded-xl px-3 py-2.5 bg-white text-gray-900"
        />
      </View>

      <BottomSheetFlatList<AssigneeOption>
        data={options}
        keyExtractor={(item: AssigneeOption) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        ListEmptyComponent={
          loading ? (
            <View className="py-6 items-center">
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : (
            <View className="py-6 px-4">
              <Text className="text-sm text-gray-500">
                Không có người dùng phù hợp
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          moreLoading ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#2563EB" />
            </View>
          ) : null
        }
      />
    </BottomSheetModal>
  );
};

export default React.memo(AssigneeBottomSheet);
