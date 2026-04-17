import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface LogoutButtonProps {
    logoutAction: () => void;
}

export default function LogoutButton({ logoutAction }: LogoutButtonProps) {
  return (
    <TouchableOpacity
        onPress={logoutAction}
        className="mt-6 w-full bg-red-50 border border-red-100 rounded-2xl py-3.5 flex-row justify-center items-center active:opacity-70"
    >
        <MaterialIcons name="logout" size={20} color="#ef4444" style={{ marginRight: 8 }} />
        
        <Text className="text-red-500 font-semibold text-base">
            Đăng xuất
        </Text>
    </TouchableOpacity>
  )
}