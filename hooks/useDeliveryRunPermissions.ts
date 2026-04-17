import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

// Định nghĩa permissions cho từng action của Delivery Run
const DELIVERY_RUN_PERMISSIONS = {
  view: ["admin", "sup_shipper", "shipper"],
} as const;

export const useDeliveryRunPermissions = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const userRole = user?.role || "";

  // Check permissions
  const canView = DELIVERY_RUN_PERMISSIONS.view.includes(userRole as any);

  // Navigation
  const navigateToDetail = (runId: string) => {
    if (canView) {
      router.push(`/(shared)/delivery-runs/${runId}` as any);
    } else {
      Alert.alert("Thông báo", "Bạn không có quyền xem chuyến giao hàng này");
    }
  };

  return {
    // Permissions
    canView,
    userRole,

    // Navigation
    navigateToDetail,
  };
};

export const useDeliveryRunRouteGuard = (
  requiredPermission: keyof typeof DELIVERY_RUN_PERMISSIONS,
) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const userRole = user?.role || "";

  useEffect(() => {
    const hasPermission = DELIVERY_RUN_PERMISSIONS[requiredPermission].includes(
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
                router.replace(`/(${userRole})/dashboard` as any);
              } else {
                router.replace("/login" as any);
              }
            },
          },
        ],
      );
    }
  }, [userRole, requiredPermission]);

  return DELIVERY_RUN_PERMISSIONS[requiredPermission].includes(userRole as any);
};
