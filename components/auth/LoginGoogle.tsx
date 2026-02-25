import { responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
// Import action set credentials từ slice của bạn (ví dụ)

// Đảm bảo trình duyệt đóng lại khi quay về app (iOS)
WebBrowser.maybeCompleteAuthSession();

export default function LoginGoogle() {
    // ============================================================
    // CẤU HÌNH ĐỊA CHỈ BACKEND (QUAN TRỌNG)
    // ============================================================
    // Thay 192.168.1.X bằng IP máy tính của bạn (dùng ipconfig/ifconfig để xem)
    // TUYỆT ĐỐI KHÔNG DÙNG "localhost" vì điện thoại sẽ không hiểu
    const BACKEND_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/google/init`;
    // console.log("Backend URL:", BACKEND_URL);
    const handleLogin = async () => {
        try {
            // Mở trình duyệt trỏ đến Server Node.js
            await WebBrowser.openBrowserAsync(BACKEND_URL);
        } catch (error) {
            console.log("Error opening browser:", error);
            Alert.alert("Lỗi", "Không thể mở trình duyệt");
        }
    };

    // Return UI giống như trong file Login cũ của bạn (Icon Google)
    return (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialIconWrap} onPress={handleLogin}>
                    <Image source={require('@/assets/images/google.png')} style={styles.socialIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsiveHeight(10),
    },
    socialIconWrap: {
        marginHorizontal: responsiveWidth(10),
        backgroundColor: '#f5f5f5',
        borderRadius: 24,
        padding: 8,
        elevation: 2,
    },
    socialIcon: {
        width: 32,
        height: 32,
    },
})