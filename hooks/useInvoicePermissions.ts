import { useAppSelector } from "@/store/hooks";

// Chỉ các role sau mới được xem tab hóa đơn bán hàng
const INVOICE_ALLOWED_ROLES = ["admin", "seller", "accountant"] as const;

type InvoiceAllowedRole = (typeof INVOICE_ALLOWED_ROLES)[number];

/**
 * Hook kiểm tra quyền xem tab hóa đơn bán hàng.
 * Các role được phép: admin, seller, accountant.
 */
export const useInvoiceTabPermission = () => {
  const { user } = useAppSelector((state) => state.auth);
  const userRole = (user?.role || "") as string;

  const canViewInvoice = INVOICE_ALLOWED_ROLES.includes(
    userRole as InvoiceAllowedRole,
  );

  return { canViewInvoice, userRole };
};
