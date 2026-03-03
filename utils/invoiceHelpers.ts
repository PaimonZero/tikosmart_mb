import dayjs from "dayjs";

// ── Currency & Date ───────────────────────────────────────────────────────────

export const formatCurrency = (value?: number | null): string => {
  if (value == null) return "—";
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export const formatDate = (iso?: string | null): string =>
  iso ? dayjs(iso).format("DD/MM/YYYY") : "—";

export const formatTax = (rate?: number | null): string => {
  if (rate == null) return "0%";
  return `${(rate * 100).toFixed(0)}%`;
};

// Màu sắc và text cho các trạng thái invoice
export const statusColor: Record<string, { color: string; text: string }> = {
  open: { color: "green", text: "Đang mở" },
  paid: { color: "blue", text: "Đã thanh toán" },
  cancelled: { color: "red", text: "Đã hủy" },
  draft: { color: "orange", text: "Nháp" },
};

/** Lấy config cho trạng thái invoice, fallback nếu không tìm thấy */
export const getInvoiceStatus = (status?: string) =>
  statusColor[status ?? ""] ?? { color: "gray", text: status ?? "—" };
