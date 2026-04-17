import { responsiveFont, responsiveHeight } from '@/assets/utils/responsive';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

interface LoginOptionsProps {
  remember: boolean;
  setRemember: (value: boolean) => void;
  onForgotPassword: () => void;
}

export function LoginOptions({ remember, setRemember, onForgotPassword }: LoginOptionsProps) {
  return (
    <View style={styles.optionsRow}>
      <View style={styles.rememberContainer}>
        <Checkbox
          status={remember ? 'checked' : 'unchecked'}
          onPress={() => setRemember(!remember)}
          color="#2196F3"
        />
        <Text style={styles.rememberText}>Ghi nhớ</Text>
      </View>

      <TouchableOpacity onPress={onForgotPassword}>
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(20),
    marginTop: responsiveHeight(-5),
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: responsiveFont(13),
    color: '#555',
    marginLeft: 4,
  },
  forgotText: {
    fontSize: responsiveFont(13),
    color: '#2196F3',
    fontWeight: '600',
  },
});