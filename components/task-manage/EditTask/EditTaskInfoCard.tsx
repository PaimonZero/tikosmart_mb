import EditTaskPackerSheet from "@/components/task-manage/EditTask/EditTaskPackerSheet";
import { PickerUser } from "@/hooks/usePickerList";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { Calendar, ChevronDown, FileText, Info, Users } from "lucide-react-native";
import React, { RefObject } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface EditTaskInfoCardProps {
  orderNo?: string;
  customerName?: string;
  supervisorName?: string;
  supervisorAvatar?: string;
  packerId: string;
  packerName: string;
  packerAvatar?: string;
  deadline: Date | null;
  note: string;
  showDatePicker: boolean;
  packerSheetRef: RefObject<BottomSheetModal | null>;
  onNoteChange: (text: string) => void;
  onOpenDatePicker: () => void;
  onDateChange: (date?: Date) => void;
  onPackerSelect: (user: PickerUser) => void;
}

export default function EditTaskInfoCard({
  orderNo,
  customerName,
  supervisorName,
  supervisorAvatar,
  packerId,
  packerName,
  packerAvatar,
  deadline,
  note,
  showDatePicker,
  packerSheetRef,
  onNoteChange,
  onOpenDatePicker,
  onDateChange,
  onPackerSelect,
}: EditTaskInfoCardProps) {
  const deadlineLabel = deadline
    ? dayjs(deadline).format("DD/MM/YYYY HH:mm")
    : "Chọn ngày giờ...";

  return (
    <>
      <View className="bg-white mx-2 mt-4 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <View className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex-row items-center gap-2">
          <Info size={20} color="#2563EB" />
          <Text className="text-base font-bold text-blue-700">Thông tin chung</Text>
        </View>

        <View className="px-4 py-3 border-b border-gray-100">
          <Text className="text-sm text-gray-500 mb-1 font-medium">Đơn hàng</Text>
          <View className="flex-row items-center">
            <FileText size={15} color="#2563EB" />
            <Text className="ml-2 text-base font-bold text-gray-800">{orderNo || "-"}</Text>
          </View>
          {customerName ? (
            <Text className="text-xs text-gray-400 mt-0.5 ml-5">{customerName}</Text>
          ) : null}
        </View>

        <View className="px-4 py-3 border-b border-gray-100">
          <Text className="text-sm text-gray-500 mb-1 font-medium">Giám sát</Text>
          <View className="flex-row items-center">
            {supervisorAvatar ? (
              <Image
                source={{ uri: supervisorAvatar }}
                style={{ width: 25, height: 25, borderRadius: 12 }}
                contentFit="cover"
                className="mr-2 border border-gray-200"
              />
            ) : (
              <View className="w-[25px] h-[25px] rounded-full bg-blue-100 items-center justify-center mr-2 border border-blue-200">
                <Text className="text-[10px] font-bold text-blue-700">
                  {(supervisorName || "").substring(0, 1).toUpperCase()}
                </Text>
              </View>
            )}
            <Text className="ml-2 text-base font-semibold text-gray-700">{supervisorName || "-"}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => packerSheetRef.current?.present()}
          activeOpacity={0.7}
          className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between"
        >
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1 font-medium">
              Người đóng gói <Text className="text-red-400">*</Text>
            </Text>
            <View className="flex-row items-center">
              {packerId ? (
                packerAvatar ? (
                  <Image
                    source={{ uri: packerAvatar }}
                    style={{ width: 25, height: 25, borderRadius: 9 }}
                    contentFit="cover"
                    className="mr-2 border border-gray-200"
                  />
                ) : (
                  <View className="w-[25px] h-[25px] rounded-full bg-blue-100 items-center justify-center mr-2 border border-blue-200">
                    <Text className="text-[10px] font-bold text-blue-700">
                      {packerName.substring(0, 1).toUpperCase()}
                    </Text>
                  </View>
                )
              ) : (
                <Users size={16} color="#9CA3AF" />
              )}
              <Text className={`text-base flex-1 ${packerId ? "ml-0 font-semibold text-gray-800" : "ml-2 text-gray-400"}`}>
                {packerName || "Chọn người đóng gói..."}
              </Text>
            </View>
          </View>
          <ChevronDown size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenDatePicker}
          activeOpacity={0.7}
          className="px-4 py-3 border-b border-gray-100 flex-row items-center justify-between"
        >
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1 font-medium">
              Hạn chót <Text className="text-red-400">*</Text>
            </Text>
            <View className="flex-row items-center">
              <Calendar size={15} color={deadline ? "#2563EB" : "#9CA3AF"} />
              <Text className={`ml-2 text-base ${deadline ? "font-semibold text-gray-800" : "text-gray-400"}`}>
                {deadlineLabel}
              </Text>
            </View>
          </View>
          <ChevronDown size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View className="px-4 py-3">
          <Text className="text-sm text-gray-500 mb-1.5 font-medium">Ghi chú nhiệm vụ</Text>
          <TextInput
            value={note}
            onChangeText={onNoteChange}
            placeholder="Ghi chú thêm cho nhiệm vụ..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 bg-gray-50 min-h-[80px]"
          />
        </View>
      </View>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        date={deadline || new Date()}
        minimumDate={new Date()}
        onConfirm={(date) => onDateChange(date)}
        onCancel={() => onDateChange(undefined)}
        confirmTextIOS="Xác nhận"
        cancelTextIOS="Hủy"
      />

      <EditTaskPackerSheet ref={packerSheetRef} onSelect={onPackerSelect} />
    </>
  );
}
