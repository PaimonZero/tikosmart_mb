import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, Text, Divider } from 'react-native-paper';

import { fetchCurrentUser, logoutUserAsync } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, status, hasFetchedProfile } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!hasFetchedProfile) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, hasFetchedProfile]);

  const userPretty = useMemo(() => {
    try {
      return JSON.stringify(user, null, 2);
    } catch {
      return String(user);
    }
  }, [user]);

  const onLogout = async () => {
    await dispatch(logoutUserAsync());
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card} mode="elevated">
        <Card.Title
          title="Thông tin tài khoản"
          titleStyle={styles.title}
        />
        <Card.Content>
          <Text style={styles.status}>Trạng thái: <Text style={{ fontWeight: 'bold' }}>{status}</Text></Text>
          <Divider style={styles.divider} />

          <Text style={styles.label}>Access Token</Text>
          <View style={styles.box}>
            <Text style={styles.mono}>{token || '(null)'}</Text>
          </View>

          <Text style={[styles.label, { marginTop: responsiveHeight(16) }]}>User</Text>
          <View style={styles.box}>
            <Text style={styles.mono}>{userPretty || '(null)'}</Text>
          </View>

          <Button
            mode="contained"
            onPress={onLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutText}
            contentStyle={styles.logoutContent}
            buttonColor="#b00020"
          >
            Đăng xuất
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: responsiveWidth(16),
    backgroundColor: '#f7f7f7',
  },
  card: {
    borderRadius: responsiveWidth(16),
    paddingVertical: responsiveHeight(12),
    elevation: 6,
  },
  title: {
    fontSize: responsiveFont(22),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  status: {
    fontSize: responsiveFont(15),
    marginBottom: responsiveHeight(8),
    textAlign: 'center',
  },
  divider: {
    marginVertical: responsiveHeight(8),
  },
  label: {
    fontSize: responsiveFont(15),
    fontWeight: '600',
    marginBottom: responsiveHeight(4),
    marginTop: responsiveHeight(8),
  },
  box: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: responsiveWidth(12),
    padding: responsiveWidth(12),
    backgroundColor: '#fff',
  },
  mono: {
    fontSize: responsiveFont(12),
    fontFamily: 'monospace',
    opacity: 0.85,
  },
  logoutButton: {
    marginTop: responsiveHeight(24),
    borderRadius: responsiveWidth(12),
  },
  logoutContent: {
    paddingVertical: responsiveHeight(10),
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveFont(16),
  },
});