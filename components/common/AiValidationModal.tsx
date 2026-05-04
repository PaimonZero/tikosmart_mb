import React from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AlertTriangle, Bot, X, Check } from "lucide-react-native";

import Animated, { FadeIn, FadeOut, FadeInUp, FadeOutUp } from "react-native-reanimated";

interface AiInvalidDetail {
  isValid: boolean;
  reason: string;
}

interface AiValidationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  invalidImages: AiInvalidDetail[];
}

const AiValidationModal: React.FC<AiValidationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  invalidImages = [],
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center px-4">
        {/* Backdrop Fade */}
        <Animated.View 
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(300)}
          className="absolute inset-0 bg-black/60"
        />

        {/* Modal Content - Fade and Slide from Top */}
        <Animated.View 
          entering={FadeInUp.duration(500).springify().damping(20).stiffness(100)}
          exiting={FadeOutUp.duration(300)}
          className="bg-white w-full rounded-[32px] overflow-hidden shadow-2xl" 
          style={{ maxWidth: 400 }}
        >
          {/* Header with Robot Icon */}
          <View className="items-center pt-8 pb-4">
            <View className="bg-blue-500 p-5 rounded-full shadow-lg relative z-10 border-4 border-white">
              <Bot color="white" size={36} />
            </View>
            
            <TouchableOpacity 
              onPress={onCancel}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full"
            >
              <X size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="px-6 pb-8">
            <Text className="text-2xl font-bold text-center text-gray-900 mb-2">Cảnh báo từ AI</Text>
            <Text className="text-gray-500 text-center text-sm mb-6 px-4">
              Hệ thống AI nhận định một số hình ảnh có thể không phải là ảnh soạn hàng hợp lệ.
            </Text>

            {invalidImages.length > 0 && (
              <View className="bg-amber-50 rounded-2xl border border-amber-100 p-4 mb-6">
                <View className="flex-row items-center mb-3">
                  <AlertTriangle color="#d97706" size={18} />
                  <Text className="text-amber-800 font-bold ml-2 text-sm">
                    Phát hiện {invalidImages.length} lỗi tiềm ẩn:
                  </Text>
                </View>
                
                <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                  {invalidImages.map((img, idx) => (
                    <View key={idx} className="flex-row items-start mb-2 last:mb-0">
                      <View className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 mr-2" />
                      <Text className="text-amber-700 text-sm flex-1 leading-5 italic">
                        {img.reason || 'Không nhận diện được hàng hóa'}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <View className="bg-gray-50 rounded-xl p-4 mb-8">
              <Text className="text-gray-800 font-medium text-center text-sm leading-5">
                Bạn có chắc chắn muốn bỏ qua cảnh báo và tiếp tục cập nhật không?
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onCancel}
                className="flex-1 bg-gray-100 py-4 rounded-2xl items-center border border-gray-200"
              >
                <Text className="text-gray-600 font-bold text-base">Hủy bỏ</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={onConfirm}
                className="flex-2 bg-blue-600 py-4 rounded-2xl items-center shadow-md shadow-blue-400/50"
                style={{ flex: 2 }}
              >
                <View className="flex-row items-center">
                  <Check color="white" size={18} />
                  <Text className="text-white font-bold text-base ml-2">Tiếp tục lưu</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AiValidationModal;
