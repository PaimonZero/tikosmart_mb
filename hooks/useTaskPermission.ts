import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

const TASK_PERMISSIONS = {
  view: ["admin", "manager", "picker", "sup_picker", "accountant"],
} as const;

export const useTaskPermission = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const userRole = user?.role || "";

  const canView = TASK_PERMISSIONS.view.includes(userRole as any);

  const navigateToDetail = (taskId: string | number) => {
    if (canView) {
      router.push(`/(shared)/task-manage/${taskId}` as any);
    } else {
      Alert.alert("Thông báo", "Bạn không có quyền xem nhiệm vụ này");
    }
  };

  return {
    canView,
    userRole,
    user,
    navigateToDetail,
  };
};

export const useTaskRouteGuard = (requiredPermission: "view" = "view") => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const userRole = user?.role || "";

  useEffect(() => {
    const hasPermission = TASK_PERMISSIONS[requiredPermission].includes(
      userRole as any,
    );

    if (!hasPermission) {
      Alert.alert(
        "Không có quyền truy cập",
        "Bạn không có quyền truy cập màn hình này",
        [
          {
            text: "OK",
            onPress: () => {
              if (userRole) {
                // Return to user's main dashboard
                const roleRoutes: Record<string, string> = {
                  admin: "/(admin)/dashboard",
                  manager: "/(manager)/dashboard",
                  accountant: "/(accountant)/dashboard",
                  picker: "/(picker)/dashboard",
                  sup_picker: "/(sup_picker)/dashboard",
                  shipper: "/(shipper)/dashboard",
                  sup_shipper: "/(sup_shipper)/dashboard",
                  seller: "/(seller)/dashboard",
                };
                router.replace((roleRoutes[userRole] || "/login") as any);
              } else {
                router.replace("/login" as any);
              }
            },
          },
        ],
      );
    }
  }, [userRole, requiredPermission]);

  return TASK_PERMISSIONS[requiredPermission].includes(userRole as any);
};
