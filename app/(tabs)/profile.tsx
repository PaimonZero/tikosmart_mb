import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import LogoutButton from '@/components/profile/LogoutButton';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfilePersonalInfoSection } from '@/components/profile/ProfilePersonalInfoSection';
import { ProfileSecuritySection } from '@/components/profile/ProfileSecuritySection';
import { ProfileSummaryCard } from '@/components/profile/ProfileSummaryCard';
import { fetchCurrentUser, logoutUserAsync } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { user, hasFetchedProfile, status, hasHydrated } = useAppSelector((s) => s.auth);

	useEffect(() => {
		if (!hasFetchedProfile) {
			void dispatch(fetchCurrentUser());
		}
	}, [dispatch, hasFetchedProfile]);

	const isLoadingProfile = !hasHydrated || status === 'loading' || (!hasFetchedProfile && !user);

	if (isLoadingProfile) {
		return (
			<SafeAreaView style={styles.safe} edges={['top']}>
				<View style={[styles.container, styles.loadingWrap]}>
					<ActivityIndicator size="large" />
				</View>
			</SafeAreaView>
		);
	}
	const onLogout = async () => {
		await dispatch(logoutUserAsync());
		router.replace('/login');
	};

	return (
		<SafeAreaView style={styles.safe} edges={['top']}>
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					<ProfileHeader />

					<ProfileSummaryCard
						name={user?.fullName || 'Người dùng Tikosmart'}
						username={user?.username || 'tikouser'}
						avatarUrl={user?.avatar}
						role={user?.role}
						onPressChangeAvatar={() => Alert.alert('Thông báo', 'Chức năng đổi ảnh đại diện chưa được hỗ trợ.')}
					/>

					<ProfilePersonalInfoSection user={user} />
					<ProfileSecuritySection />
					<LogoutButton
						logoutAction={() => onLogout()}
					/>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: '#F3F4F6',
	},
	loadingWrap: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	scrollContent: {
		paddingHorizontal: responsiveWidth(16),
		paddingTop: responsiveHeight(8),
		paddingBottom: responsiveHeight(18),
		gap: responsiveHeight(12),
	},
});
