import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

// Định nghĩa permissions cho từng action dựa trên matrix cung cấp
const SALES_ORDER_PERMISSIONS = {
  view_list: [
    "admin",
    "seller",
    "manager",
    "sup_picker",
    "Delivery Supervisor", // Note: Ensure this matches the exact role string in your DB/Auth system
    "accountant",
  ],
  view_detail: [
    "admin",
    "seller",
    "manager",
    "sup_picker",
    "Delivery Supervisor",
    "accountant",
  ],
  // Có thể thêm quyền edit, create, v.v. nếu cần sau này
} as const;

export const useSalesOrderPermissions = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const userRole = user?.role || "";

  // Check permissions
  const canViewList = SALES_ORDER_PERMISSIONS.view_list.includes(
    userRole as any,
  );
  const canViewDetail = SALES_ORDER_PERMISSIONS.view_detail.includes(
    userRole as any,
  );

  // Navigation callbacks
  const navigateToDetail = (orderId: string) => {
    if (canViewDetail) {
      router.push(`/(shared)/sales-orders/${orderId}` as any);
    } else {
      Alert.alert("Thông báo", "Bạn không có quyền xem chi tiết đơn hàng này");
    }
  };

  const navigateToList = () => {
    if (canViewList) {
      router.push(`/(shared)/sales-orders/salesOrdersList` as any);
    } else {
      Alert.alert("Thông báo", "Bạn không có quyền xem danh sách đơn hàng");
    }
  };

  return {
    // Permissions
    canViewList,
    canViewDetail,
    userRole,

    // Navigation
    navigateToDetail,
    navigateToList,
  };
};

// Route Guard Hook - Dùng trong các màn hình cần bảo vệ
export const useSalesOrderRouteGuard = (
  requiredPermission: "view_list" | "view_detail",
) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const userRole = user?.role || "";

  useEffect(() => {
    const hasPermission = SALES_ORDER_PERMISSIONS[requiredPermission].includes(
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
              // Redirect về màn hình default của role hiện tại (giống product permissions)
              if (userRole) {
                router.replace(`/(${userRole})` as any);
              } else {
                router.replace("/login" as any);
              }
            },
          },
        ],
      );
    }
  }, [userRole, requiredPermission]);

  return SALES_ORDER_PERMISSIONS[requiredPermission].includes(userRole as any);
};
