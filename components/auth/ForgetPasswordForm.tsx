import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text, TextInput } from 'react-native-paper';

import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import { forgotPasswordAsync } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner-native';

type ForgetPasswordFormProps = {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
};

export default function ForgetPasswordForm({ email, setEmail, isLoading }: ForgetPasswordFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const canSubmit = useMemo(() => email.trim().length > 0 && !isLoading, [email, isLoading]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    try {
      const res = await dispatch(forgotPasswordAsync(email.trim())).unwrap();
      toast.success(res?.message || 'Đã gửi liên kết đặt lại mật khẩu đến email. Vui lòng kiểm tra hộp thư.', { duration: 5000 });
      router.back();
    } catch (e: any) {
      toast.error((typeof e === 'string' && e) || e?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
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
  );
}

const styles = StyleSheet.create({
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