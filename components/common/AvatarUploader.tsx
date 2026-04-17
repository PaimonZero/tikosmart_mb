import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import apiClient from '@/services/apiClient';
import { toast } from 'sonner-native';

type AvatarUploaderRenderProps = {
	pickAndUpload: () => Promise<void>;
	pickFromLibraryAndUpload: () => Promise<void>;
	takePhotoAndUpload: () => Promise<void>;
	isUploading: boolean;
};

type AvatarUploaderProps = {
	onUploaded: (url: string) => void | Promise<void>;
	onError?: (err: unknown) => void;
	children: (props: AvatarUploaderRenderProps) => React.ReactNode;
};

const guessMimeFromUri = (uri: string) => {
	const lower = uri.toLowerCase();
	if (lower.endsWith('.png')) return 'image/png';
	if (lower.endsWith('.webp')) return 'image/webp';
	if (lower.endsWith('.heic')) return 'image/heic';
	return 'image/jpeg';
};

const guessFileNameFromUri = (uri: string) => {
	const last = uri.split('/').pop();
	return last && last.includes('.') ? last : `upload_${Date.now()}.jpg`;
};

export default function AvatarUploader({ onUploaded, onError, children }: AvatarUploaderProps) {
	const [isUploading, setIsUploading] = useState(false);

	const uploadAsset = useCallback(
		async (asset: { uri: string; mimeType?: string | null } | null | undefined) => {
			if (!asset?.uri) return;

			setIsUploading(true);

			const uri = asset.uri;
			const name = guessFileNameFromUri(uri);
			const type = asset.mimeType || guessMimeFromUri(uri);

			const form = new FormData();
			form.append('file', { uri, name, type } as any);

			const res = await apiClient.post('/upload', form, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			const url = res?.data?.url ?? res?.data?.data?.url;
			if (!url) throw new Error('Upload failed - no URL returned');

			await onUploaded(url);
		},
		[onUploaded]
	);

	const pickFromLibraryAndUpload = useCallback(async () => {
		if (isUploading) return;

		try {
			const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!perm.granted) {
				toast.error('Quyền truy cập bị từ chối', { description: 'Vui lòng cho phép truy cập Thư viện ảnh để tải ảnh lên.' });
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.85,
			});

			if (result.canceled) return;
			await uploadAsset(result.assets?.[0]);
		} catch (e) {
			onError?.(e);
			toast.error('Lỗi upload ảnh', { description: (e as any)?.response?.data?.message || (e as any)?.message || 'Không thể upload ảnh.' });
		} finally {
			setIsUploading(false);
		}
	}, [isUploading, uploadAsset, onError]);

	const takePhotoAndUpload = useCallback(async () => {
		if (isUploading) return;

		try {
			const perm = await ImagePicker.requestCameraPermissionsAsync();
			if (!perm.granted) {
				toast.error('Quyền truy cập bị từ chối', { description: 'Vui lòng cho phép truy cập Camera để chụp ảnh.' });
				return;
			}

			const result = await ImagePicker.launchCameraAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.85,
			});

			if (result.canceled) return;
			await uploadAsset(result.assets?.[0]);
		} catch (e) {
			onError?.(e);
			toast.error('Lỗi chụp/upload ảnh', { description: (e as any)?.response?.data?.message || (e as any)?.message || 'Không thể chụp/upload ảnh.' });
		} finally {
			setIsUploading(false);
		}
	}, [isUploading, uploadAsset, onError]);

	// Backward-compatible alias: pick from library
	const pickAndUpload = pickFromLibraryAndUpload;

	return (
		<>{children({ pickAndUpload, pickFromLibraryAndUpload, takePhotoAndUpload, isUploading })}</>
	);
}
