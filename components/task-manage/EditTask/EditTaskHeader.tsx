import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EditTaskHeaderProps {
  title?: string;
  onBack: () => void;
  disabled?: boolean;
}

export default function EditTaskHeader({
  title = "Cập nhật nhiệm vụ",
  onBack,
  disabled = false,
}: EditTaskHeaderProps) {
  return (
    <View className="px-4 py-3 flex-row items-center border-b border-gray-100 bg-white">
      <TouchableOpacity onPress={onBack} disabled={disabled} className="p-2 -ml-2">
        <ArrowLeft size={24} color="#1f2937" />
      </TouchableOpacity>
      <Text className="text-lg font-bold ml-2">{title}</Text>
    </View>
  );
}
