import { useAppSelector } from "@/store/hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

// Định nghĩa permissions cho từng action
const PRODUCT_PERMISSIONS = {
  view: ["admin", "manager", "seller", "accountant", "sup_picker", "picker"],
  add: ["admin", "manager"],
  edit: ["admin", "manager"],
} as const;

export const useProductPermissions = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const userRole = user?.role || "";

  // Check permissions
  const canView = PRODUCT_PERMISSIONS.view.includes(userRole as any);
  const canAdd = PRODUCT_PERMISSIONS.add.includes(userRole as any);
  const canEdit = PRODUCT_PERMISSIONS.edit.includes(userRole as any);

  // Navigation với shared product-manage paths
  const navigateToDetail = (productId: string) => {
    if (canView) {
      router.push(`/(shared)/product-manage/${productId}` as any);
    } else {
      Alert.alert("Thông báo", "Bạn không có quyền xem sản phẩm này");
    }
  };

  const navigateToAdd = () => {
    if (canAdd) {
      router.push(`/(shared)/product-manage/addProduct` as any);
    } else {
      Alert.alert("Thông báo", "Bạn không có quyền thêm sản phẩm");
    }
  };

  const navigateToEdit = (productId: string) => {
    if (canEdit) {
      router.push(`/(shared)/product-manage/${productId}/editProduct` as any);
    } else {
      Alert.alert("Thông báo", "Bạn không có quyền sửa sản phẩm");
    }
  };

  return {
    // Permissions
    canView,
    canAdd,
    canEdit,
    userRole,

    // Navigation
    navigateToDetail,
    navigateToAdd,
    navigateToEdit,
  };
};

// Route Guard Hook - Dùng trong các màn hình cần bảo vệ
export const useProductRouteGuard = (
  requiredPermission: "view" | "add" | "edit",
) => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const userRole = user?.role || "";

  useEffect(() => {
    const hasPermission = PRODUCT_PERMISSIONS[requiredPermission].includes(
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
              // Redirect về màn products của role hiện tại
              if (userRole) {
                router.replace(`/(${userRole})/products` as any);
              } else {
                router.replace("/login" as any);
              }
            },
          },
        ],
      );
    }
  }, [userRole, requiredPermission]);

  return PRODUCT_PERMISSIONS[requiredPermission].includes(userRole as any);
};
