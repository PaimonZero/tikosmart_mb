import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOnlineCount, updateOnlineStatusBatch } from "@/store/userSlice";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.EXPO_PUBLIC_API_SOCKET_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "";

function useUserStatusSocket() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {

    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    // When user logs in or enters app
    socket.emit("user:online", userId);

    socket.on("users:status", (statusList: any[]) => {
      dispatch(updateOnlineStatusBatch(statusList));
    });

    socket.on("user:onlineCount", (data: { onlineCount: number }) => {
      dispatch(updateOnlineCount({ onlineCount: data.onlineCount }));
    });

    // Handle app state changes for better online/offline status
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          socket.connect();
          socket.emit("user:online", userId);
        } else if (nextAppState.match(/inactive|background/)) {
          // Optional: Disconnect on background if you want to show them as offline immediately
          // socket.disconnect();
        }
      },
    );

    return () => {
      socket.disconnect();
      subscription.remove();
    };
  }, [userId, dispatch]);
}

export default useUserStatusSocket;
