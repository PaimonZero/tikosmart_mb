// import React, { useMemo, useState } from 'react';
// import { Alert, StyleSheet, View } from 'react-native';
// import { Button, TextInput } from 'react-native-paper';

// import { responsiveFont, responsiveHeight } from '@/assets/utils/responsive';
// import { ProfileSection } from '@/components/profile/ProfileSection';
// import { changePasswordAsync } from '@/store/authSlice';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';

// export function ProfileSecuritySection() {
//   const dispatch = useAppDispatch();
//   const status = useAppSelector((s) => s.auth.status);

//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [showOld, setShowOld] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const canSubmit = useMemo(() => {
//     return !!oldPassword && !!newPassword && newPassword === confirmPassword && status !== 'loading';
//   }, [oldPassword, newPassword, confirmPassword, status]);

//   const onSubmit = async () => {
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ các trường.');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       Alert.alert('Không khớp', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
//       return;
//     }

//     const res = await dispatch(changePasswordAsync({ oldPassword, newPassword }));
//     if (changePasswordAsync.fulfilled.match(res)) {
//       setOldPassword('');
//       setNewPassword('');
//       setConfirmPassword('');
//       Alert.alert('Thành công', 'Đổi mật khẩu thành công.');
//       return;
//     }

//     Alert.alert('Thất bại', (res.payload as string) || 'Đổi mật khẩu thất bại.');
//   };

//   return (
//     <ProfileSection title="BẢO MẬT">
//       <View style={styles.fieldWrap}>
//         <TextInput
//           mode="outlined"
//           label="Mật khẩu cũ"
//           value={oldPassword}
//           secureTextEntry={!showOld}
//           onChangeText={setOldPassword}
//           right={
//             <TextInput.Icon
//               icon={showOld ? 'eye-off' : 'eye'}
//               onPress={() => setShowOld((v) => !v)}
//             />
//           }
//         />
//       </View>

//       <View style={styles.fieldWrap}>
//         <TextInput
//           mode="outlined"
//           label="Mật khẩu mới"
//           value={newPassword}
//           secureTextEntry={!showNew}
//           onChangeText={setNewPassword}
//           right={
//             <TextInput.Icon
//               icon={showNew ? 'eye-off' : 'eye'}
//               onPress={() => setShowNew((v) => !v)}
//             />
//           }
//         />
//       </View>

//       <View style={styles.fieldWrap}>
//         <TextInput
//           mode="outlined"
//           label="Xác nhận mật khẩu mới"
//           value={confirmPassword}
//           secureTextEntry={!showConfirm}
//           onChangeText={setConfirmPassword}
//           right={
//             <TextInput.Icon
//               icon={showConfirm ? 'eye-off' : 'eye'}
//               onPress={() => setShowConfirm((v) => !v)}
//             />
//           }
//         />
//       </View>

//       <Button
//         mode="contained"
//         onPress={onSubmit}
//         disabled={!canSubmit}
//         loading={status === 'loading'}
//         style={styles.button}
//         labelStyle={styles.buttonLabel}
//       >
//         Đổi mật khẩu
//       </Button>
//     </ProfileSection>
//   );
// }

// const styles = StyleSheet.create({
//   fieldWrap: {
//     marginTop: responsiveHeight(10),
//   },
//   button: {
//     marginTop: responsiveHeight(14),
//     borderRadius: 12,
//   },
//   buttonLabel: {
//     fontSize: responsiveFont(14),
//     fontWeight: '700',
//     paddingVertical: responsiveHeight(4),
//   },
// });
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { ProfileSection } from '@/components/profile/ProfileSection';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

export function ProfileSecuritySection() {
  const router = useRouter();
  return (
    <ProfileSection title="BẢO MẬT">
      <TouchableOpacity className='p-4 flex-row items-center' onPress={() => { router.push('/change-password')}}> 
        <View className="w-12 h-12 rounded-2xl mr-4 overflow-hidden justify-center items-center relative">
          {/* Lớp nền màu mờ (Opacity 10%) */}
          <View
            className="absolute w-full h-full opacity-10"
            //màu đỏ
            style={{ backgroundColor: '#ef4444' }}
          />
          {/* Icon chính */}
          <MaterialIcons name="lock-reset" size={24} color="#ef4444" />
        </View>
        {/* 2. Phần Text ở giữa */}
        <View className="flex-1 justify-center">
          <Text className="text-gray-900 text-base font-semibold">
            Đổi mật khẩu
          </Text>
          <Text
            className="text-gray-500 text-sm mb-1"
            numberOfLines={1}
          >
            Cập nhật mật khẩu mới
          </Text>
        </View>

        <View>
          <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    </ProfileSection>
  );
}
