import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Checkbox, Text, TextInput } from 'react-native-paper';

import { responsiveFont, responsiveHeight, responsiveWidth } from '@/assets/utils/responsive';
import LoginGoogle from '@/components/auth/LoginGoogle';
import { fetchCurrentUser, loginUser, setCredentials } from '@/store/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

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
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const scrollRef = useRef<ScrollView>(null);

    // Animated value cho hiệu ứng sóng ngang
    const translateX = useRef(new Animated.Value(0)).current;

    const googleData = useMemo(() => {
        const v = params?.data;
        return Array.isArray(v) ? v[0] : v;
    }, [params?.data]);

    const googleError = useMemo(() => {
        const v = params?.error;
        return Array.isArray(v) ? v[0] : v;
    }, [params?.error]);

    // Handle Google OAuth deep-link return (backend redirects here with ?data or ?error)
    useEffect(() => {
        if (!googleData && !googleError) return;

        const run = async () => {
            // Close in-app browser ASAP
            try {
                await WebBrowser.dismissBrowser();
            } catch {
                // ignore
            }

            if (googleError) {
                Alert.alert('Đăng nhập thất bại', decodeURIComponent(googleError));
                // Clear params by replacing the same route without query
                router.replace('/login');
                return;
            }

            if (!googleData) {
                return;
            }

            try {
                const raw = decodeURIComponent(googleData);
                const responseData = JSON.parse(raw);

                const user = responseData?.user ?? responseData?.data?.user ?? null;
                const token =
                    responseData?.accessToken ??
                    responseData?.access_token ??
                    responseData?.token ??
                    null;

                if (!user || !token) {
                    Alert.alert('Lỗi', 'Thiếu user/token từ server');
                    router.replace('/login');
                    return;
                }

                dispatch(setCredentials({ user, token, remember: true }));
                // Fetch full profile, but don't block navigation.
                void dispatch(fetchCurrentUser());
                router.replace('/(tabs)');
            } catch (e) {
                console.error('google deep link parse error:', e);
                Alert.alert('Lỗi', 'Dữ liệu server trả về không hợp lệ');
                router.replace('/login');
            }
        };

        void run();
    }, [dispatch, googleData, googleError, router]);

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

    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates?.height ?? 0);
        });
        const hideSub = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
            setKeyboardHeight(0);
            // Reset ScrollView offset so it won't keep a blank gap after keyboard dismiss.
            scrollRef.current?.scrollTo({ y: 0, animated: false });
        });
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const scrollToForm = () => {
        // Let layout settle, then scroll.
        requestAnimationFrame(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        });
    };

    const canSubmit = useMemo(() => {
        return emailOrUsername.trim().length > 0 && password.length > 0 && !isLoading;
    }, [emailOrUsername, password, isLoading]);

    const onSubmit = async () => {
        if (!canSubmit) return;
        try {
            await dispatch(loginUser({ emailOrUsername: emailOrUsername.trim(), password, remember })).unwrap();
            await dispatch(fetchCurrentUser()).unwrap();
            Alert.alert('Đăng nhập thành công', remember ? 'Đã ghi nhớ đăng nhập.' : 'Đăng nhập thành công.');
            router.replace('/(tabs)');
        } catch (e: any) {
            Alert.alert('Đăng nhập thất bại', (typeof e === 'string' && e) || e?.message || 'Vui lòng kiểm tra lại thông tin.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            // Android already resizes the window; using "height" often causes leftover gaps.
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            {/* Animated background */}
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

            <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: keyboardVisible ? keyboardHeight : 0 }}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={keyboardVisible}
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never"
            >
                {/* Logo + App name */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoWrapper}>
                        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
                    </View>
                    <Text style={styles.appName}>TIKOSMART</Text>
                </View>

                {/* Main Card */}
                <View style={styles.flexGrow}>
                    <Card style={styles.card} mode="elevated">
                        <Card.Content style={styles.cardContent}>
                            <Text style={styles.headerTitle}>Chào mừng trở lại!</Text>
                            <Text style={styles.subtitle}>Đăng nhập để quản lý bán hàng</Text>

                            {/* Input Email/User */}
                            <TextInput
                                label="Tài khoản"
                                value={emailOrUsername}
                                onChangeText={setEmailOrUsername}
                                onFocus={scrollToForm}
                                autoCapitalize="none"
                                mode="outlined"
                                disabled={isLoading}
                                placeholder="Email hoặc tên đăng nhập"
                                style={styles.input}
                                outlineStyle={styles.inputOutline}
                                activeOutlineColor="#2196F3"
                                left={<TextInput.Icon icon="account" color={(isFocused) => isFocused ? '#2196F3' : '#aaa'} />}
                            />

                            {/* Input Password */}
                            <TextInput
                                label="Mật khẩu"
                                value={password}
                                onChangeText={setPassword}
                                onFocus={scrollToForm}
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

                            {/* Row: Remember Me & Forgot Password */}
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

                            {/* Submit Button */}
                            <Button
                                mode="contained"
                                onPress={onSubmit}
                                style={styles.button}
                                contentStyle={styles.buttonContent}
                                labelStyle={styles.buttonLabel}
                                loading={isLoading}
                                buttonColor="#2196F3"
                            >
                                Đăng nhập
                            </Button>

                            {/* Social login */}
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
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    flexGrow: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    // --- Logo Styles ---
    logoContainer: {
        alignItems: 'center',
        marginTop: responsiveHeight(80),
        marginBottom: responsiveHeight(10),
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
        justifyContent: 'flex-end',
        paddingBottom: 0,
        minHeight: screenHeight * 0.7,
    },
    cardContent: {
        paddingVertical: responsiveHeight(20),
        paddingHorizontal: responsiveWidth(20),
        flexGrow: 1,
        justifyContent: 'flex-end',
        paddingBottom: responsiveHeight(24),
        marginBottom: responsiveHeight(20),
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
        marginTop: responsiveHeight(40),
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
    }
});