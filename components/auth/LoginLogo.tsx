import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const logoImage = require('@/assets/images/tikoSmart.png');

export function LoginLogo() {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoWrapper}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.appName}>TIKOSMART</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(60),
    marginBottom: responsiveHeight(20),
  },
  logo: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
  },
  logoWrapper: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: responsiveWidth(40),
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(8),
    elevation: 4,
  },
  appName: {
    fontSize: responsiveFont(26),
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});