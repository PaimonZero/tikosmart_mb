import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { forgotPasswordAsync } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

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
        res?.message || 'Đã gửi liên kết đặt lại mật khẩu đến email của bạn. Hãy mở email và bấm link để đặt lại.'
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
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>
          Quên mật khẩu
        </ThemedText>
        <ThemedText style={styles.subtitle}>Nhập email để nhận liên kết đặt lại mật khẩu</ThemedText>

        <ThemedText style={styles.label}>Địa chỉ email</ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!isLoading}
          placeholder="abc@gmail.com"
          style={styles.input}
        />

        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <ThemedText style={styles.buttonText}>Xác nhận</ThemedText>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()} disabled={isLoading} style={styles.linkRow}>
          <ThemedText type="link">Quay lại</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    gap: 12,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#111',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  linkRow: {
    alignItems: 'center',
    marginTop: 8,
  },
});
