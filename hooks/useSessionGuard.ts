import { useEffect, useRef } from 'react';

import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { disconnectSocket, socket } from '@/utils/socketManager';

/**
 * Hook: useSessionGuard
 *
 * Lắng nghe event `session:force_logout` từ WebSocket server.
 * Khi user login trên device khác cùng platform (mobile) → device hiện tại bị kick.
 *
 * Flow:
 * 1. Server emit `session:force_logout` tới socketId cũ
 * 2. Hook nhận event → dispatch logout → show Alert → navigate to login
 */
const useSessionGuard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const hasHandled = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      hasHandled.current = false;
      return;
    }

    const handleForceLogout = (data: { reason?: string; message?: string }) => {
      if (hasHandled.current) return;
      hasHandled.current = true;

      console.warn('[SessionGuard] Force logout received:', data);

      // 1. Show Alert
      Alert.alert(
        'Phiên đăng nhập đã kết thúc',
        data?.message ||
          'Tài khoản của bạn đã đăng nhập ở thiết bị khác. Bạn sẽ bị đăng xuất.',
        [
          {
            text: 'OK',
            onPress: () => {
              // 2. Cleanup & navigate
              disconnectSocket();
              dispatch(logout());
              router.replace('/(auth)/login');
            },
          },
        ],
        { cancelable: false }
      );
    };

    socket.on('session:force_logout', handleForceLogout);

    return () => {
      socket.off('session:force_logout', handleForceLogout);
    };
  }, [isAuthenticated, dispatch, router]);
};

export default useSessionGuard;
