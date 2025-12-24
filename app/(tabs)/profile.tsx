import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import AvatarUploader from '@/components/common/AvatarUploader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import AvatarSourceModal from '@/components/profile/AvatarSourceModal';
import { AvatarZoomModal } from '@/components/profile/AvatarZoomModal';
import { EditPhoneModal } from '@/components/profile/EditPhoneModal';
import LogoutButton from '@/components/profile/LogoutButton';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import ProfileLoading from '@/components/profile/ProfileLoading';
import { ProfilePersonalInfoSection } from '@/components/profile/ProfilePersonalInfoSection';
import { ProfileSecuritySection } from '@/components/profile/ProfileSecuritySection';
import { ProfileSummaryCard } from '@/components/profile/ProfileSummaryCard';
import { logoutUserAsync, updateUserAsync } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

export default function ProfileScreen() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { user, hasFetchedProfile, hasHydrated, updateUserStatus, logoutStatus } = useAppSelector((s) => s.auth);
	const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
	const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
	const [isEditPhoneModalOpen, setIsEditPhoneModalOpen] = useState(false);
	const [isConfirmLogoutModalOpen, setIsConfirmLogoutModalOpen] = useState(false);

	const isLoadingProfile = !hasHydrated || (!hasFetchedProfile && !user);

	if (isLoadingProfile) {
		return (
			<ProfileLoading />
		);
	}
	const onLogout = async () => {
		try {
			await dispatch(logoutUserAsync());
			router.replace('/login');
			toast.success('Đã đăng xuất khỏi tài khoản.', { duration: 3000 });
		} catch (error) {
			toast.error('Đăng xuất thất bại.', {
				description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
				duration: 5000,
			});
		}
	};
	const updateAvatar = async (url: string) => {
		try {
			// Backend yêu cầu field: avatar
			await dispatch(updateUserAsync({ avatar: url })).unwrap();
			// updateUserAsync.fulfilled đã set state.user = response.data.data
			// => avatar hiển thị ngay, không cần fetch lại
			toast.success('Đã cập nhật ảnh đại diện.', { duration: 3000 });
		} catch (error) {
			toast.error('Cập nhật ảnh đại diện thất bại.', {
				description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
				duration: 5000,
			});
		}
	};
	const updatePhone = async (newPhone: string) => {
		try {
			await dispatch(updateUserAsync({ phone: newPhone })).unwrap();
			toast.success('Đã cập nhật số điện thoại.', { duration: 3000 });
		} catch (error) {
			toast.error('Cập nhật số điện thoại thất bại.', {
				description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
				duration: 5000,
			});
			throw error; // Để modal handle error
		}
	};
	return (
		<SafeAreaView style={styles.safe} edges={['top']}>
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					<ProfileHeader />

					<AvatarUploader
						onUploaded={updateAvatar}
					>
						{({ pickFromLibraryAndUpload, takePhotoAndUpload, isUploading }) => (
							<>
								<ProfileSummaryCard
									name={user?.fullName || 'Người dùng Tikosmart'}
									username={user?.username || 'tikouser'}
									avatarUrl={user?.avatar}
									role={user?.role}
									onPressAvatar={() => setIsZoomModalOpen(true)}
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

								<AvatarZoomModal
									visible={isZoomModalOpen}
									avatarUrl={user?.avatar}
									onClose={() => setIsZoomModalOpen(false)}
								/>
							</>
						)}
					</AvatarUploader>

					<ProfilePersonalInfoSection user={user} onEditPhone={() => setIsEditPhoneModalOpen(true)} />

					<EditPhoneModal
						visible={isEditPhoneModalOpen}
						currentPhone={user?.phone}
						onClose={() => setIsEditPhoneModalOpen(false)}
						onSave={updatePhone}
						isSaving={updateUserStatus === 'loading'}
					/>

					<ProfileSecuritySection />
					<LogoutButton
						logoutAction={() => setIsConfirmLogoutModalOpen(true)}
					/>
					<ConfirmDialog
						visible={isConfirmLogoutModalOpen}
						title="Xác nhận đăng xuất"
						content="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
						confirmLabel="Đăng xuất"
						cancelLabel="Hủy"
						onConfirm={() => {
							setIsConfirmLogoutModalOpen(false);
							void onLogout();
						}}
						onDismiss={() => setIsConfirmLogoutModalOpen(false)}
						isDanger={true}
						isLoading={logoutStatus === 'loading'}
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
