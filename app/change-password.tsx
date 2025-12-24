import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { PasswordInput } from '@/components/change-password/PasswordInput';
import { ValidationItem } from '@/components/change-password/ValidationItem';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  //Dialog confirm
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const isLengthValid = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isComplexityValid = hasUpperCase && hasLowerCase && hasNumber;
  const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const canSave = isLengthValid && isComplexityValid && isMatch && currentPassword.length > 0;

  const changePassword = async() => {
    // Thực hiện logic thay đổi mật khẩu ở đây    
    
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="bg-blue-50 p-4 rounded-xl flex-row items-start mb-6">
          <MaterialIcons name="history" size={20} color="#3b82f6" style={{ marginTop: 2 }} />
          <Text className="ml-3 text-slate-600 text-sm leading-5 flex-1">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu của bạn với bất kỳ ai.
            Mật khẩu mới cần đủ mạnh để đảm bảo an toàn cho tài khoản.
          </Text>
        </View>

        <PasswordInput
          label="Mật khẩu cũ"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          show={showCurrent}
          setShow={setShowCurrent}
          placeholder="Nhập mật khẩu hiện tại"
          icon="vpn-key"
        />

        <PasswordInput
          label="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          show={showNew}
          setShow={setShowNew}
          placeholder="Nhập mật khẩu mới"
          icon="lock"
          error={newPassword.length > 0 && (!isLengthValid || !isComplexityValid)}
        />

        <View className="mb-5 ml-1">
          <ValidationItem isValid={isLengthValid} text="Tối thiểu 8 ký tự" />
          <ValidationItem isValid={isComplexityValid} text="Bao gồm chữ hoa, chữ thường và số" />
        </View>

        <PasswordInput
          label="Xác nhận mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          show={showConfirm}
          setShow={setShowConfirm}
          placeholder="Nhập lại mật khẩu mới"
          icon="lock-reset"
          error={confirmPassword.length > 0 && !isMatch}
        />
        {confirmPassword.length > 0 && !isMatch && (
          <Text className="text-red-500 text-xs mt-1 ml-1">
            Mật khẩu xác nhận không trùng khớp
          </Text>
        )}

        <Pressable
          disabled={!canSave}
          onPress={() => console.log('Lưu thay đổi', newPassword)}
          className={`rounded-full py-3.5 items-center mb-4 ${canSave ? 'bg-blue-500' : 'bg-blue-300'}`}
        >
          <Text className="text-white font-bold text-base">Lưu thay đổi</Text>
        </Pressable>

        <Pressable
          onPress={() => { router.back(); }}
          className="items-center py-2"
        >
          <Text className="text-gray-500 font-semibold">Hủy bỏ</Text>
        </Pressable>
      </ScrollView>
      <ConfirmDialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
        onConfirm={changePassword}
        title="Xác nhận thay đổi mật khẩu"
        content="Bạn có chắc chắn muốn thay đổi mật khẩu không?"
        cancelLabel="Hủy"
        confirmLabel="Đồng ý"
        isDanger={true}
      />
    </KeyboardAvoidingView>
  );
}