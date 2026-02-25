import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { toast } from 'sonner-native';

type EditPhoneModalProps = {
  visible: boolean;
  currentPhone?: string;
  onClose: () => void;
  onSave: (newPhone: string) => Promise<void>;
  isSaving?: boolean;
};

export function EditPhoneModal({ visible, currentPhone, onClose, onSave, isSaving }: EditPhoneModalProps) {
  const [phone, setPhone] = useState(currentPhone || '');

  const handleSave = async () => {
    // Basic validation: Số điện thoại Việt Nam (10-11 số, bắt đầu 0)
    const phoneRegex = /^0\d{9,10}$/;
    if (!phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại.');
      return;
    }
    if (!phoneRegex.test(phone)) {
      toast.error('Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 số).');
      return;
    }

    try {
      await onSave(phone);
      onClose();
    } catch (error) {
      // Error handling đã có trong onSave
      console.log(error);
    }
  };

  const handleClose = () => {
    setPhone(currentPhone || ''); // Reset về giá trị cũ
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 mx-4 w-full max-w-sm">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900">Sửa số điện thoại</Text>
            <Pressable onPress={handleClose} disabled={isSaving}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </Pressable>
          </View>

          {/* Input */}
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Nhập số điện thoại (vd: 0123456789)"
            keyboardType="phone-pad"
            className="border border-gray-300 rounded-lg p-3 text-base mb-4"
            editable={!isSaving}
          />

          {/* Buttons */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              disabled={isSaving}
              className="flex-1 bg-gray-200 py-3 rounded-lg active:opacity-70"
            >
              <Text className="text-gray-700 text-center font-semibold">Hủy</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className="flex-1 bg-blue-600 py-3 rounded-lg active:opacity-70"
            >
              <Text className="text-white text-center font-semibold">
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}