import React from 'react';
import { StyleSheet } from 'react-native';

import { ProfileInfoRow } from '@/components/profile/ProfileInfoRow';
import { ProfileSection } from '@/components/profile/ProfileSection';

type ProfilePersonalInfoSectionProps = {
  user: any | null;
};

export function ProfilePersonalInfoSection({ user }: ProfilePersonalInfoSectionProps) {
  
  return (
    <ProfileSection title="THÔNG TIN CÁ NHÂN">
      {/* Dòng 1: Họ và tên (Màu xanh dương) */}
      <ProfileInfoRow
        icon="badge" // Hoặc 'account-box'
        label="Họ và tên"
        value={user?.fullName || 'Người dùng Tikosmart'}
        iconColor="#3b82f6"
      />

      {/* Dòng 2: Email (Màu tím) */}
      <ProfileInfoRow
        icon="email"
        label="Email"
        value={user?.email || '—'}
        iconColor="#a855f7"
      />

      {/* Dòng 3: Số điện thoại (Màu xanh lá - Có nút Sửa) */}
      <ProfileInfoRow
        icon="phone"
        label="Số điện thoại"
        value={user?.phone || '—'}
        iconColor="#22c55e"
        actionLabel="Sửa"
        onPressAction={() => console.log('Sửa sđt')}
      />

      {/* Dòng 4: Tên phòng ban (Màu cam) */}
      <ProfileInfoRow
        icon="apartment" // Hoặc 'business'
        label="Tên phòng ban"
        value={user?.departmentName || 'Kho Hệ thống'}
        iconColor="#f97316"
      />

      {/* Dòng 5: Mã phòng ban (Màu tím nhạt/Indigo) - Item cuối không border */}
      <ProfileInfoRow
        icon="qr-code"
        label="Mã phòng ban"
        value={user?.departmentCode || '—'}
        iconColor="#6366f1"
        isLast={true}
      />
    </ProfileSection>
  );
}