import { Image } from 'expo-image';
import React from 'react';
import { Modal, Pressable } from 'react-native';

type AvatarZoomModalProps = {
  visible: boolean;
  avatarUrl?: string;
  onClose: () => void;
};

export function AvatarZoomModal({ visible, avatarUrl, onClose }: AvatarZoomModalProps) {
  if (!avatarUrl) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}
        onPress={onClose}
      >
        <Image
          source={avatarUrl}
          style={{ width: '90%', height: '70%', borderRadius: 10 }}
          contentFit="contain"
        />
      </Pressable>
    </Modal>
  );
}