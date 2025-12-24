import React from 'react';
import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';

type ProfileSectionProps = {
  title: string;
  children: React.ReactNode;
} & ViewProps;

export function ProfileSection({ title, children, style, ...rest }: ProfileSectionProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View className='bg-white rounded-xl border border-gray-200 shadow-sm elevation-2'>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(14),
  },
  sectionTitle: {
    fontSize: responsiveFont(12),
    fontWeight: '700',
    opacity: 0.6,
    marginBottom: responsiveHeight(8),
    marginLeft: responsiveWidth(4),
  },
});
