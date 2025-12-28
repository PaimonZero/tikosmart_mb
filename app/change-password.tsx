import React, { useState } from 'react';
import {
  View,
  Text,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { PasswordInput } from '@/components/change-password/PasswordInput';
import { ValidationItem } from '@/components/change-password/ValidationItem';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { changePasswordAsync } from '@/store/authSlice';
import { toast } from 'sonner-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  //Dialog confirm
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const dispatch = useAppDispatch();
  const isLengthValid = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isComplexityValid = hasUpperCase && hasLowerCase && hasNumber;
  const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const canSave = isLengthValid && isComplexityValid && isMatch && oldPassword.length > 0;
  // loading state của change password
  const changePasswordStatus = useAppSelector((s) => s.auth.changePasswordStatus);
  const isLoading = changePasswordStatus === 'loading';
  const changePassword = async () => {
    try {
      await dispatch(changePasswordAsync({ oldPassword, newPassword })).unwrap();
      toast.success('Đổi mật khẩu thành công', {
        duration: 3000,
      });
      router.back();
    } catch (error) {
      toast.error('Đổi mật khẩu thất bại', {
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
        duration: 5000,
      });
    }
  }
  return (
   <KeyboardAwareScrollView
      className="flex-1 bg-white px-4 py-6"
      contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}  // Bật cho Android
      extraScrollHeight={Platform.OS === 'ios' ? 0 : 50}  // Điều chỉnh khoảng cách cuộn bổ sung nếu cần
    >
        <View className="bg-blue-50 p-4 rounded-xl flex-row items-start mb-6">
          <MaterialIcons name="history" size={20} color="#3b82f6" style={{ marginTop: 2 }} />
          <Text className="ml-3 text-slate-600 text-sm leading-5 flex-1">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu của bạn với bất kỳ ai.
            Mật khẩu mới cần đủ mạnh để đảm bảo an toàn cho tài khoản.
          </Text>
        </View>

        <PasswordInput
          label="Mật khẩu cũ"
          value={oldPassword}
          onChangeText={setOldPassword}
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
          onPress={() => setIsDialogVisible(true)}
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
      <ConfirmDialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
        onConfirm={changePassword}
        title="Xác nhận thay đổi mật khẩu"
        content="Bạn có chắc chắn muốn thay đổi mật khẩu không?"
        cancelLabel="Hủy"
        confirmLabel="Đồng ý"
        isDanger={true}
        isLoading={isLoading}
      />
    </KeyboardAwareScrollView >
  );
}