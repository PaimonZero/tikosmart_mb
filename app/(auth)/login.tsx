import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import DynamicBackground from '@/components/auth/DynamicBackground';
import { LoginButton } from '@/components/auth/LoginButton';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginLogo } from '@/components/auth/LoginLogo';
import { LoginOptions } from '@/components/auth/LoginOptions';
import { LoginSocial } from '@/components/auth/LoginSocial';
import { fetchCurrentUser, loginUser, setCredentials } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Card, Text } from 'react-native-paper';
import { toast } from 'sonner-native';

export default function LoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ data?: string | string[]; error?: string | string[] }>();
    const dispatch = useAppDispatch();
    const { status } = useAppSelector((s) => s.auth);

    const isLoading = status === 'loading';

    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ✅ Thêm state cho validation errors
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // --- State kiểm soát bàn phím ---
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    // --- 1. Lắng nghe sự kiện bàn phím ---
    useEffect(() => {
        const keyboardShowEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
        const keyboardHideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

        const showSubscription = Keyboard.addListener(keyboardShowEvent, () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener(keyboardHideEvent, () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // --- Xử lý Google Deep Link ---
    const googleData = useMemo(() => {
        const v = params?.data;
        return Array.isArray(v) ? v[0] : v;
    }, [params?.data]);

    const googleError = useMemo(() => {
        const v = params?.error;
        return Array.isArray(v) ? v[0] : v;
    }, [params?.error]);

    useEffect(() => {
        if (!googleData && !googleError) return;
        const run = async () => {
            try { await WebBrowser.dismissBrowser(); } catch { }

            if (googleError) {
                toast.error('Đăng nhập thất bại', { description: decodeURIComponent(googleError), duration: 5000 },);
                router.replace('/login');
                return;
            }
            if (!googleData) return;

            try {
                const raw = decodeURIComponent(googleData);
                const responseData = JSON.parse(raw);
                const user = responseData?.user ?? responseData?.data?.user ?? null;
                const token = responseData?.accessToken ?? responseData?.access_token ?? responseData?.token ?? null;

                if (!user || !token) {
                    console.error('Lỗi', 'Thiếu user/token từ server');
                    router.replace('/login');
                    return;
                }

                dispatch(setCredentials({ user, token, remember: true }));
                void dispatch(fetchCurrentUser());
                router.replace('/(tabs)');
            } catch (e) {
                console.error('google deep link parse error:', e);
                toast.error('Lỗi', { description: 'Dữ liệu server trả về không hợp lệ', duration: 5000 });
                router.replace('/login');
            }
        };
        void run();
    }, [dispatch, googleData, googleError, router]);

    // const canSubmit = useMemo(() => {
    //     return !isLoading;
    // }, [isLoading]);

    const onSubmit = async () => {
        let hasError = false;
        if (!emailOrUsername.trim()) {
            setEmailError('Tài khoản là bắt buộc');
            hasError = true;
        } else {
            setEmailError('');
        }
        if (!password) {
            setPasswordError('Mật khẩu là bắt buộc');
            hasError = true;
        } else {
            setPasswordError('');
        }
        if (hasError) return;

        try {
            await dispatch(loginUser({ emailOrUsername: emailOrUsername.trim(), password, remember })).unwrap();
            await dispatch(fetchCurrentUser()).unwrap();
            router.replace('/(tabs)');
            toast.success(remember ? 'Đã ghi nhớ đăng nhập.' : 'Đăng nhập thành công.', { duration: 3000 });
        } catch (e: any) {
            toast.error('Đăng nhập thất bại', { description: (typeof e === 'string' && e) || e?.message || 'Vui lòng kiểm tra lại thông tin.', duration: 5000 });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Background Animation - Tuyệt đối, không bị cuộn */}
            <DynamicBackground />

            {/* Main Logic xử lý bàn phím */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                // TRICK: Android để undefined để không bị "nhảy" layout, iOS dùng padding
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        // TRICK: Đổi layout động. 
                        // - Khi gõ (visible): flex-start để ScrollView hoạt động bình thường -> Textinput tự trồi lên
                        // - Bình thường: flex-end để layout chìm xuống đáy đẹp mắt
                        contentContainerStyle={[
                            styles.scrollContent,
                            {
                                justifyContent: isKeyboardVisible ? 'flex-start' : 'flex-end',
                                // Thêm padding bottom khi gõ để nút đăng nhập không bị sát mép phím quá
                                paddingBottom: isKeyboardVisible ? 20 : 0
                            }
                        ]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Logo + App name */}
                        <LoginLogo />

                        {/* Main Card */}
                        <Card style={styles.card} mode="elevated">
                            <Card.Content style={styles.cardContent}>
                                <Text style={styles.headerTitle}>Chào mừng trở lại!</Text>
                                <Text style={styles.subtitle}>Đăng nhập để quản lý bán hàng</Text>

                                <LoginForm
                                    emailOrUsername={emailOrUsername}
                                    setEmailOrUsername={setEmailOrUsername}
                                    password={password}
                                    setPassword={setPassword}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    isLoading={isLoading}
                                    emailError={emailError}
                                    setEmailError={setEmailError}
                                    passwordError={passwordError}
                                    setPasswordError={setPasswordError}
                                />

                                <LoginOptions
                                    remember={remember}
                                    setRemember={setRemember}
                                    onForgotPassword={() => router.push('/forget-password')}
                                />

                                <LoginButton
                                    onPress={onSubmit}
                                    isLoading={isLoading}
                                />

                                <LoginSocial />
                            </Card.Content>
                        </Card>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    scrollContent: {
        flexGrow: 1,
    },
    // --- Card Styles ---
    card: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: '#fff',
        elevation: 10,
        marginHorizontal: 0,
        marginBottom: 0,
        paddingBottom: 0,
    },
    cardContent: {
        paddingVertical: responsiveHeight(20),
        paddingHorizontal: responsiveWidth(20),
        paddingBottom: responsiveHeight(24),
    },
    headerTitle: {
        fontSize: responsiveFont(25),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: responsiveHeight(10),
    },
    subtitle: {
        fontSize: responsiveFont(14),
        color: '#666',
        textAlign: 'center',
        marginBottom: responsiveHeight(25),
    },
});