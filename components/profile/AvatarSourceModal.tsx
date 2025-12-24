import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

type AvatarSourceModalProps = {
	visible: boolean;
	onClose: () => void;
	onPickFromLibrary: () => void;
	onTakePhoto: () => void;
	disabled?: boolean;
};

export default function AvatarSourceModal({
	visible,
	onClose,
	onPickFromLibrary,
	onTakePhoto,
	disabled,
}: AvatarSourceModalProps) {
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
				<Pressable className="bg-white rounded-t-3xl px-5 pt-5 pb-8" onPress={() => {}}>
					<Text className="text-lg font-bold text-gray-900">Chọn ảnh đại diện</Text>
					<Text className="text-sm text-gray-500 mt-1">Chọn cách bạn muốn cập nhật avatar</Text>

					<View className="mt-5 gap-3">
						<Pressable
							disabled={!!disabled}
							onPress={onPickFromLibrary}
							className={`w-full rounded-2xl px-4 py-4 border border-gray-200 ${
								disabled ? 'opacity-60' : ''
							}`}
						>
							<Text className="text-base font-semibold text-gray-900">Chọn từ thư viện</Text>
						</Pressable>

						<Pressable
							disabled={!!disabled}
							onPress={onTakePhoto}
							className={`w-full rounded-2xl px-4 py-4 border border-gray-200 ${
								disabled ? 'opacity-60' : ''
							}`}
						>
							<Text className="text-base font-semibold text-gray-900">Chụp ảnh</Text>
						</Pressable>

						<Pressable onPress={onClose} className="w-full rounded-2xl px-4 py-4 bg-gray-100">
							<Text className="text-base font-semibold text-gray-700 text-center">Hủy</Text>
						</Pressable>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
}
