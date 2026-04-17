import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateOnlineCount, updateOnlineStatusBatch } from "@/store/userSlice";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { socket } from "@/utils/socketManager";

function useUserStatusSocket() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!userId) return;

    // Khi socket đã connect, thông báo mình online
    const handleConnect = () => {
      socket.emit("user:online", userId);
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);

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
          if (!socket.connected) {
            socket.connect();
          }
          socket.emit("user:online", userId);
        }
      },
    );

    return () => {
      socket.off("connect", handleConnect);
      socket.off("users:status");
      socket.off("user:onlineCount");
      subscription.remove();
    };
  }, [userId, dispatch]);
}

export default useUserStatusSocket;
