import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';

// Import các utils và assets giống màn hình Login
import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import { forgotPasswordAsync } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// Đảm bảo đường dẫn ảnh đúng như cấu trúc dự án của bạn
const bgImage = require('@/assets/images/login-background.png');
const logoImage = require('@/assets/images/tikoSmart.png');

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ForgetPasswordScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.auth);
  const isLoading = status === 'loading';

  const [email, setEmail] = useState('');

  const canSubmit = useMemo(() => email.trim().length > 0 && !isLoading, [email, isLoading]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      const res = await dispatch(forgotPasswordAsync(email.trim())).unwrap();
      Alert.alert(
        'Thành công',
        res?.message || 'Đã gửi liên kết đặt lại mật khẩu đến email. Vui lòng kiểm tra hộp thư.'
      );
      router.replace('/login');
    } catch (e: any) {
      Alert.alert(
        'Lỗi',
        (typeof e === 'string' && e) || e?.message || 'Có lỗi xảy ra, vui lòng thử lại.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background Image full màn hình */}
      <ImageBackground
        source={bgImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
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

          {/* Form Card - Đặt giữa màn hình */}
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
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)', // Lớp phủ nhẹ để text dễ đọc hơn nếu ảnh nền quá sáng
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // Quan trọng: Canh giữa nội dung theo chiều dọc
    paddingHorizontal: responsiveWidth(20),
    paddingBottom: responsiveHeight(20),
  },
  
  // --- Logo Styles (Giống Login nhưng nhỏ hơn một chút để cân đối) ---
  logoContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(30),
  },
  logoWrapper: {
    width: responsiveWidth(70),
    height: responsiveWidth(70),
    borderRadius: responsiveWidth(35),
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
    width: responsiveWidth(60),
    height: responsiveWidth(60),
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
    // Không dùng marginHorizontal ở đây vì đã padding ở ScrollView
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