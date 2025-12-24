import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Button, Card, Checkbox, Text, TextInput } from 'react-native-paper';
import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import LoginGoogle from '@/components/auth/LoginGoogle';
import { fetchCurrentUser, loginUser, setCredentials } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from 'sonner-native';

const bgImage = require('@/assets/images/login-background.png');
const logoImage = require('@/assets/images/tikoSmart.png');

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

    // --- State kiểm soát bàn phím ---
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    // Animated value cho hiệu ứng sóng ngang
    const translateX = useRef(new Animated.Value(0)).current;

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

    // --- Animation Loop ---
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: -screenWidth,
                    duration: 20000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [translateX]);

    const canSubmit = useMemo(() => {
        return emailOrUsername.trim().length > 0 && password.length > 0 && !isLoading;
    }, [emailOrUsername, password, isLoading]);

    const onSubmit = async () => {
        if (!canSubmit) return;
        try {
            await dispatch(loginUser({ emailOrUsername: emailOrUsername.trim(), password, remember })).unwrap();
            await dispatch(fetchCurrentUser()).unwrap();
            toast.success(remember ? 'Đã ghi nhớ đăng nhập.' : 'Đăng nhập thành công.', { duration: 3000 });
            router.replace('/(tabs)');
        } catch (e: any) {
            toast.error('Đăng nhập thất bại', { description: (typeof e === 'string' && e) || e?.message || 'Vui lòng kiểm tra lại thông tin.', duration: 5000 });
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Background Animation - Tuyệt đối, không bị cuộn */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        width: screenWidth * 2,
                        height: screenHeight,
                        transform: [{ translateX }],
                    },
                ]}
                pointerEvents="none"
            >
                <ImageBackground source={bgImage} style={{ width: '100%', height: '100%' }} resizeMode="cover">
                    <View style={styles.overlay} />
                </ImageBackground>
            </Animated.View>

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
                        <View style={styles.logoContainer}>
                            <View style={styles.logoWrapper}>
                                <Image source={logoImage} style={styles.logo} resizeMode="contain" />
                            </View>
                            <Text style={styles.appName}>TIKOSMART</Text>
                        </View>

                        {/* Main Card */}
                        <Card style={styles.card} mode="elevated">
                            <Card.Content style={styles.cardContent}>
                                <Text style={styles.headerTitle}>Chào mừng trở lại!</Text>
                                <Text style={styles.subtitle}>Đăng nhập để quản lý bán hàng</Text>

                                <TextInput
                                    label="Tài khoản"
                                    value={emailOrUsername}
                                    onChangeText={setEmailOrUsername}
                                    autoCapitalize="none"
                                    mode="outlined"
                                    disabled={isLoading}
                                    placeholder="Email hoặc tên đăng nhập"
                                    style={styles.input}
                                    outlineStyle={styles.inputOutline}
                                    activeOutlineColor="#2196F3"
                                    left={<TextInput.Icon icon="account" color={(isFocused) => isFocused ? '#2196F3' : '#aaa'} />}
                                />

                                <TextInput
                                    label="Mật khẩu"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    mode="outlined"
                                    disabled={isLoading}
                                    placeholder="Nhập mật khẩu"
                                    style={styles.input}
                                    outlineStyle={styles.inputOutline}
                                    activeOutlineColor="#2196F3"
                                    left={<TextInput.Icon icon="lock" color={(isFocused) => isFocused ? '#2196F3' : '#aaa'} />}
                                    right={
                                        <TextInput.Icon
                                            icon={showPassword ? "eye-off" : "eye"}
                                            onPress={() => setShowPassword(!showPassword)}
                                        />
                                    }
                                />

                                <View style={styles.optionsRow}>
                                    <View style={styles.rememberContainer}>
                                        <Checkbox
                                            status={remember ? 'checked' : 'unchecked'}
                                            onPress={() => setRemember((v) => !v)}
                                            color="#2196F3"
                                        />
                                        <Text style={styles.rememberText}>Ghi nhớ</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => router.push('/forget-password')}>
                                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                                    </TouchableOpacity>
                                </View>

                                <Button
                                    mode="contained"
                                    onPress={onSubmit}
                                    style={styles.button}
                                    contentStyle={styles.buttonContent}
                                    labelStyle={styles.buttonLabel}
                                    loading={isLoading}
                                    buttonColor="#2196F3"
                                    disabled={isLoading}
                                >
                                    Đăng nhập
                                </Button>

                                <View style={styles.socialSection}>
                                    <View style={styles.socialDividerRow}>
                                        <View style={styles.socialDividerLine} />
                                        <Text style={styles.socialTitle}>Hoặc đăng nhập với</Text>
                                        <View style={styles.socialDividerLine} />
                                    </View>
                                    <LoginGoogle />
                                </View>
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
    // --- Logo Styles ---
    logoContainer: {
        alignItems: 'center',
        marginTop: responsiveHeight(60),
        marginBottom: responsiveHeight(20),
    },
    logo: {
        width: responsiveWidth(80),
        height: responsiveWidth(80),
    },
    logoWrapper: {
        width: responsiveWidth(80),
        height: responsiveWidth(80),
        borderRadius: responsiveWidth(40),
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: responsiveHeight(8),
        elevation: 4,
    },
    appName: {
        fontSize: responsiveFont(26),
        fontWeight: 'bold',
        color: '#ffffff',
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
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
    input: {
        marginBottom: responsiveHeight(16),
        backgroundColor: '#fff',
        height: responsiveHeight(55),
        fontSize: responsiveFont(15),
    },
    inputOutline: {
        borderRadius: 12,
        borderColor: '#e0e0e0',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(20),
        marginTop: responsiveHeight(-5),
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberText: {
        fontSize: responsiveFont(13),
        color: '#555',
        marginLeft: 4,
    },
    forgotText: {
        fontSize: responsiveFont(13),
        color: '#2196F3',
        fontWeight: '600',
    },
    button: {
        borderRadius: 50,
        marginTop: responsiveHeight(5),
        elevation: 2,
    },
    buttonContent: {
        paddingVertical: responsiveHeight(8),
    },
    buttonLabel: {
        fontSize: responsiveFont(16),
    },
    socialSection: {
        marginTop: responsiveHeight(30),
        alignItems: 'center',
    },
    socialDividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: responsiveHeight(10),
    },
    socialDividerLine: {
        flex: 1,
        height: 1.5,
        backgroundColor: '#e0e0e0',
    },
    socialTitle: {
        fontSize: responsiveFont(13),
        color: '#888',
        marginHorizontal: responsiveWidth(12),
    },
});