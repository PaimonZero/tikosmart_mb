import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { checkResetTokenAsync, resetPasswordAsync } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((s) => s.auth);
  const isLoading = status === 'loading';

  const params = useLocalSearchParams<{ token?: string }>();
  const token = params.token;

  // null = checking, true = valid, false = invalid
  const [validToken, setValidToken] = useState<boolean | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const didCheckRef = useRef(false);

  useEffect(() => {
    if (didCheckRef.current) return;
    didCheckRef.current = true;

    if (!token) {
      setValidToken(false);
      return;
    }

    dispatch(checkResetTokenAsync(token))
      .unwrap()
      .then(() => setValidToken(true))
      .catch(() => setValidToken(false));
  }, [dispatch, token]);

  const canSubmit = useMemo(() => {
    return !!token && validToken === true && newPassword.length > 0 && !isLoading;
  }, [token, validToken, newPassword, isLoading]);

  const onSubmit = async () => {
    if (!canSubmit || !token) return;

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const res = await dispatch(resetPasswordAsync({ token, password: newPassword })).unwrap();
      Alert.alert('Thành công', res?.message || 'Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.');
      router.replace('/login');
    } catch (e: any) {
      const msg = (typeof e === 'string' && e) || e?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.';
      Alert.alert('Lỗi', msg);

      const lower = msg.toLowerCase();
      if (lower.includes('hết hạn') || lower.includes('invalid') || lower.includes('không hợp lệ')) {
        setValidToken(false);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        {validToken === null ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <ThemedText style={{ marginTop: 12, opacity: 0.7 }}>Đang xác thực liên kết...</ThemedText>
          </View>
        ) : validToken ? (
          <>
            <ThemedText type="title" style={styles.title}>
              Cập nhật mật khẩu mới
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Vui lòng nhập mật khẩu mới để cập nhật cho tài khoản của bạn
            </ThemedText>

            <ThemedText style={styles.label}>Mật khẩu mới</ThemedText>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              editable={!isLoading}
              placeholder="Mật khẩu mới"
              style={styles.input}
            />

            <ThemedText style={styles.label}>Xác nhận mật khẩu mới</ThemedText>
            <TextInput
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              editable={!isLoading}
              placeholder="Xác nhận mật khẩu mới"
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
          </>
        ) : (
          <View style={styles.center}>
            <ThemedText style={[styles.subtitle, { color: '#b00020' }]}>
              Liên kết đặt lại không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.
            </ThemedText>

            <View style={styles.actionsRow}>
              <Pressable style={styles.secondaryButton} onPress={() => router.replace('/forget-password')}>
                <ThemedText>Yêu cầu đặt lại</ThemedText>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => router.replace('/login')}>
                <ThemedText>Về đăng nhập</ThemedText>
              </Pressable>
            </View>
          </View>
        )}
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
  center: {
    alignItems: 'center',
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
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});
