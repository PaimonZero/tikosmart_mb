import { useEffect } from 'react';
import { socket } from '../utils/socketManager';

/**
 * Hook dùng để tự động subscribe và unsubscribe socket rooms
 * @param {string[]} rooms - Ví dụ: ['room:sales_orders', 'room:customers']
 */
const useSubscribeRooms = (rooms: string[] = []) => {
  useEffect(() => {
    if (!rooms || rooms.length === 0) return;

    const subscribeToRooms = () => {
      rooms.forEach((room) => {
        if (socket.connected) {
          socket.emit('join_room', room);
        } else {
        }
      });
    };

    if (socket.connected) {
      subscribeToRooms();
    }

    socket.on('connect', subscribeToRooms);

    return () => {
      socket.off('connect', subscribeToRooms);
      rooms.forEach((room) => {
        if (socket.connected) {
          socket.emit('leave_room', room);
        }
      });
    };
  }, [JSON.stringify(rooms)]);
};

export default useSubscribeRooms;
