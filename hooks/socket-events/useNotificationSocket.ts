import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addNotification } from "@/store/notificationSlice";
import { socket } from "@/utils/socketManager";

export default function useNotificationSocket() {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;

    const handleConnect = () => {
      socket.emit("notification:join", userId);
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);

    socket.on("notification:new", (notification: any) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification:new");
    };
  }, [userId, dispatch]);
}
