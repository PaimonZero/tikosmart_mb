import { responsiveFont, responsiveHeight } from '@/assets/utils/responsive';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TextInput } from 'react-native-paper';

interface LoginFormProps {
  emailOrUsername: string;
  setEmailOrUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  isLoading: boolean;
  emailError: string;
  setEmailError: (value: string) => void;
  passwordError: string;
  setPasswordError: (value: string) => void;
}

export function LoginForm({
  emailOrUsername,
  setEmailOrUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  emailError,
  setEmailError,
  passwordError,
  setPasswordError,
}: LoginFormProps) {
  return (
    <>
      <TextInput
        label="Tài khoản *"
        value={emailOrUsername}
        onChangeText={(text) => {
          setEmailOrUsername(text);
          if (emailError) setEmailError('');
        }}
        autoCapitalize="none"
        mode="outlined"
        disabled={isLoading}
        placeholder="Email hoặc tên đăng nhập"
        style={styles.input}
        outlineStyle={styles.inputOutline}
        activeOutlineColor="#2196F3"
        error={!!emailError}
        left={<TextInput.Icon icon="account" color={(isFocused) => (isFocused ? '#2196F3' : '#aaa')} />}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        label="Mật khẩu *"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (passwordError) setPasswordError('');
        }}
        secureTextEntry={!showPassword}
        mode="outlined"
        disabled={isLoading}
        placeholder="Nhập mật khẩu"
        style={styles.input}
        outlineStyle={styles.inputOutline}
        activeOutlineColor="#2196F3"
        error={!!passwordError}
        left={<TextInput.Icon icon="lock" color={(isFocused) => (isFocused ? '#2196F3' : '#aaa')} />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
    </>
  );
}
const styles = StyleSheet.create({
  input: {
    marginBottom: responsiveHeight(16),
    backgroundColor: '#fff',
    height: responsiveHeight(55),
    fontSize: responsiveFont(15),
  },
  inputOutline: {
    borderRadius: 12,
    borderColor: '#e0e0e0',
  },
  errorText: {
    fontSize: responsiveFont(12),
    color: '#d32f2f', // Red color for error
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(8),
  },
})