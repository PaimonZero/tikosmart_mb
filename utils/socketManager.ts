import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.EXPO_PUBLIC_API_SOCKET_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "";


// Khởi tạo instance của Socket.IO (Singleton pattern)
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'], // Thêm polling để tăng độ ổn định trên mobile
});

/**
 * Khởi tạo kết nối Socket.IO với JWT Token
 */
export const connectSocket = (token: string) => {
  if (!token) {
    console.error('[Socket] Không tìm thấy hợp lệ token để kết nối.');
    return socket;
  }

  
  // Nếu đã kết nối nhưng token thay đổi hoặc chưa kết nối
  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  } else if (JSON.stringify(socket.auth) !== JSON.stringify({ token })) {
    socket.auth = { token };
    socket.disconnect().connect();
  } else {
  }

  return socket;
};

/**
 * Ngắt kết nối Socket.IO
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

/**
 * Gửi vị trí shipper lên server
 */
export const emitShipperLocation = (data: { runId?: string | number, lat: number, lng: number }) => {
  if (socket.connected) {
    socket.emit('shipper_location_update', data);
  } else {
    // console.warn('[Socket] Không thể gửi vị trí: Chưa kết nối socket.');
  }
};
