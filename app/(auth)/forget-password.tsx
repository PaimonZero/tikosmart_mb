import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';

import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import { forgotPasswordAsync } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const bgImage = require('@/assets/images/login-background.png');
const logoImage = require('@/assets/images/tikoSmart.png');


export default function ForgetPasswordScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
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

  const canSubmit = useMemo(() => email.trim().length > 0 && !isLoading, [email, isLoading]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      const res = await dispatch(forgotPasswordAsync(email.trim())).unwrap();
      Alert.alert(
        'Thành công',
        res?.message || 'Đã gửi liên kết đặt lại mật khẩu đến email. Vui lòng kiểm tra hộp thư.'
      );
      router.back();
    } catch (e: any) {
      Alert.alert(
        'Lỗi',
        (typeof e === 'string' && e) || e?.message || 'Có lỗi xảy ra, vui lòng thử lại.'
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 1. Background nằm tuyệt đối phía sau */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <ImageBackground
          source={bgImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </View>

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
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Image source={logoImage} style={styles.logo} resizeMode="contain" />
              </View>
              <Text style={styles.appName}>TIKOSMART</Text>
            </View>

            {/* Form Card */}
            <Card style={styles.card} mode="elevated">
              <Card.Content style={styles.cardContent}>
                <Text style={styles.headerTitle}>Quên mật khẩu?</Text>
                <Text style={styles.subtitle}>
                  Nhập địa chỉ email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
                </Text>

                <TextInput
                  label="Địa chỉ Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  mode="outlined"
                  disabled={isLoading}
                  placeholder="email@gmail.com"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  activeOutlineColor="#2196F3"
                  left={<TextInput.Icon icon="email-outline" color={(isFocused) => isFocused ? '#2196F3' : '#aaa'} />}
                />

                <Button
                  mode="contained"
                  onPress={onSubmit}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  loading={isLoading}
                  disabled={!canSubmit}
                  buttonColor="#2196F3"
                >
                  Gửi xác nhận
                </Button>

                <Button
                  mode="text"
                  onPress={() => router.back()}
                  style={styles.backButton}
                  labelStyle={styles.backButtonLabel}
                  disabled={isLoading}
                  textColor="#666"
                >
                  Quay lại đăng nhập
                </Button>
              </Card.Content>
            </Card>
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
  // --- Logo Styles ---
  logoContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(30),
  },
  logoWrapper: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: responsiveWidth(40),
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(10),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
  },
  appName: {
    fontSize: responsiveFont(24),
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  // --- Card Styles ---
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 8,
  },
  cardContent: {
    paddingVertical: responsiveHeight(25),
    paddingHorizontal: responsiveWidth(15),
  },
  headerTitle: {
    fontSize: responsiveFont(22),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: responsiveHeight(8),
  },
  subtitle: {
    fontSize: responsiveFont(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: responsiveHeight(25),
    lineHeight: 20,
  },
  // --- Input & Buttons ---
  input: {
    marginBottom: responsiveHeight(20),
    backgroundColor: '#fff',
    height: responsiveHeight(55),
    fontSize: responsiveFont(15),
  },
  inputOutline: {
    borderRadius: 12,
    borderColor: '#e0e0e0',
  },
  button: {
    borderRadius: 50,
    marginTop: responsiveHeight(5),
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: responsiveHeight(6),
  },
  buttonLabel: {
    fontSize: responsiveFont(16),
    fontWeight: '600',
  },
  backButton: {
    marginTop: responsiveHeight(15),
  },
  backButtonLabel: {
    fontSize: responsiveFont(14),
  },
});