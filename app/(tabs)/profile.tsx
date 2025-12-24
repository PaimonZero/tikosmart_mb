import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import AvatarUploader from '@/components/common/AvatarUploader';
import LogoutButton from '@/components/profile/LogoutButton';
import AvatarSourceModal from '@/components/profile/AvatarSourceModal';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfilePersonalInfoSection } from '@/components/profile/ProfilePersonalInfoSection';
import { ProfileSecuritySection } from '@/components/profile/ProfileSecuritySection';
import { ProfileSummaryCard } from '@/components/profile/ProfileSummaryCard';
import { fetchCurrentUser, logoutUserAsync, updateUserAsync } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

export default function ProfileScreen() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { user, hasFetchedProfile, hasHydrated, updateUserStatus } = useAppSelector((s) => s.auth);
	const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

	useEffect(() => {
		if (!hasFetchedProfile) {
			void dispatch(fetchCurrentUser());
		}
	}, [dispatch, hasFetchedProfile]);

	const isLoadingProfile = !hasHydrated || (!hasFetchedProfile && !user);

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

					<AvatarUploader
						onUploaded={async (url) => {
							// Backend yêu cầu field: avatar
							await dispatch(updateUserAsync({ avatar: url })).unwrap();
							// updateUserAsync.fulfilled đã set state.user = response.data.data
							// => avatar hiển thị ngay, không cần fetch lại
							toast.success('Đã cập nhật ảnh đại diện.', { duration: 3000 });
						}}
					>
						{({ pickFromLibraryAndUpload, takePhotoAndUpload, isUploading }) => (
							<>
								<ProfileSummaryCard
									name={user?.fullName || 'Người dùng Tikosmart'}
									username={user?.username || 'tikouser'}
									avatarUrl={user?.avatar}
									role={user?.role}
									onPressChangeAvatar={() => {
										if (isUploading || updateUserStatus === 'loading') return;
										setIsAvatarModalOpen(true);
									}}
									isUploadingAvatar={isUploading || updateUserStatus === 'loading'}
								/>

								<AvatarSourceModal
									visible={isAvatarModalOpen}
									disabled={isUploading || updateUserStatus === 'loading'}
									onClose={() => setIsAvatarModalOpen(false)}
									onPickFromLibrary={() => {
										setIsAvatarModalOpen(false);
										void pickFromLibraryAndUpload();
									}}
									onTakePhoto={() => {
										setIsAvatarModalOpen(false);
										void takePhotoAndUpload();
									}}
								/>
							</>
						)}
					</AvatarUploader>


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
