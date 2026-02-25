import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import ForgetPasswordForm from '@/components/auth/ForgetPasswordForm';
import ForgetPasswordLogo from '@/components/auth/ForgetPasswordLogo';
import { useAppSelector } from '@/store/hooks';
import DynamicBackground from '@/components/auth/DynamicBackground';

export default function ForgetPasswordScreen() {
  const { status } = useAppSelector((s) => s.auth);
  const isLoading = status === 'loading';

  const [email, setEmail] = useState('');

  // State kiểm soát bàn phím
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // --- Lắng nghe sự kiện bàn phím ---
  useEffect(() => {
    const keyboardShowEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const keyboardHideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

    const showSubscription = Keyboard.addListener(keyboardShowEvent, () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(keyboardHideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 1. Background nằm tuyệt đối phía sau */}
      <DynamicBackground />

      {/* 2. KeyboardAvoidingView xử lý logic đẩy view */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // Android tắt behavior để ScrollView tự lo, iOS dùng padding
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                // Khi phím hiện: flex-start để input trôi lên trên.
                // Khi phím tắt: center để form nằm giữa màn hình đẹp mắt.
                justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
                // Thêm padding top khi bàn phím hiện để logo không bị sát mép trên
                paddingTop: isKeyboardVisible ? responsiveHeight(40) : 0,
                // Thêm padding bottom để scroll được xuống dưới cùng
                paddingBottom: isKeyboardVisible ? 20 : responsiveHeight(20),
              }
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo Section */}
            <ForgetPasswordLogo />

            {/* Form Card */}
            <ForgetPasswordForm email={email} setEmail={setEmail} isLoading={isLoading} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(10),
    // justifyContent đã chuyển vào inline style để xử lý động
  },
});