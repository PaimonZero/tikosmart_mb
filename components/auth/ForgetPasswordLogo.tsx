import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';

const logoImage = require('@/assets/images/tikoSmart.png');

export default function ForgetPasswordLogo() {
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
});