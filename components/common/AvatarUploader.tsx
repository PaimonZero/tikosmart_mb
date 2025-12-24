import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import apiClient from '@/services/apiClient';

type AvatarUploaderRenderProps = {
	pickAndUpload: () => Promise<void>;
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

	const pickAndUpload = useCallback(async () => {
		if (isUploading) return;

		try {
			const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!perm.granted) {
				Alert.alert('Quyền truy cập bị từ chối', 'Vui lòng cho phép truy cập Thư viện ảnh để tải ảnh lên.');
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.85,
			});

			if (result.canceled) return;

			const asset = result.assets?.[0];
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
		} catch (e) {
			onError?.(e);
			Alert.alert(
				'Lỗi upload ảnh',
				(e as any)?.response?.data?.message || (e as any)?.message || 'Không thể upload ảnh.'
			);
		} finally {
			setIsUploading(false);
		}
	}, [isUploading, onUploaded, onError]);

	return <>{children({ pickAndUpload, isUploading })}</>;
}
