import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginGoogle from './LoginGoogle';
import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';

export function LoginSocial() {
  return (
    <View style={styles.socialSection}>
      <View style={styles.socialDividerRow}>
        <View style={styles.socialDividerLine} />
        <Text style={styles.socialTitle}>Hoặc đăng nhập với</Text>
        <View style={styles.socialDividerLine} />
      </View>
      <LoginGoogle />
    </View>
  );
}

const styles = StyleSheet.create({
  socialSection: {
    marginTop: responsiveHeight(30),
    alignItems: 'center',
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: responsiveHeight(10),
  },
  socialDividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e0e0e0',
  },
  socialTitle: {
    fontSize: responsiveFont(13),
    color: '#888',
    marginHorizontal: responsiveWidth(12),
  },
});