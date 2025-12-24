import { responsiveFont, responsiveHeight } from '@/assets/utils/responsive';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

interface LoginButtonProps {
  onPress: () => void;
  isLoading: boolean;
}

export function LoginButton({ onPress, isLoading }: LoginButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={styles.button}
      contentStyle={styles.buttonContent}
      labelStyle={styles.buttonLabel}
      loading={isLoading}
      buttonColor="#2196F3"
      disabled={isLoading}
    >
      Đăng nhập
    </Button>
  );
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    marginTop: responsiveHeight(5),
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: responsiveHeight(8),
  },
  buttonLabel: {
    fontSize: responsiveFont(16),
  },
});