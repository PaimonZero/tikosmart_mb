import { createTask } from "@/services/taskService";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { toast } from "sonner-native";

export interface TaskItemRow {
  key: string;
  orderItemId: string;
  lotId?: string;
  preQty: number;
  note: string;
  productName: string;
  image?: string;
  sku?: string;
  remain: number;
  productId: string;
}

export interface TaskFormValues {
  packerId: string;
  deadline: Date;
  note?: string;
}

export const useTaskSubmit = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(
    async (orderId: string, values: TaskFormValues, items: TaskItemRow[]) => {
      // 1. Lọc các item hợp lệ: phải có lotId và preQty > 0
      const validItems = items.filter((i) => i.lotId && i.preQty > 0);

      if (validItems.length === 0) {
        toast.warning(
          "Vui lòng chọn lô hàng và nhập số lượng cho ít nhất 1 sản phẩm",
        );
        return false;
      }

      // 2. Kiểm tra tổng preQty không vượt remain theo từng orderItemId
      const grouped: Record<string, number> = {};
      for (const item of validItems) {
        grouped[item.orderItemId] =
          (grouped[item.orderItemId] || 0) + item.preQty;
      }

      for (const [orderItemId, totalQty] of Object.entries(grouped)) {
        const itemInfo = validItems.find((x) => x.orderItemId === orderItemId);
        if (itemInfo && totalQty > itemInfo.remain) {
          toast.error(
            `Tổng số lượng của "${itemInfo.productName}" (${totalQty}) vượt quá số còn lại (${itemInfo.remain})`,
          );
          return false;
        }
      }

      // 3. Build payload
      const payload = {
        orderId,
        packerId: values.packerId,
        deadline: values.deadline.toISOString(),
        note: values.note || "",
        items: validItems.map((i) => ({
          orderItemId: i.orderItemId,
          lotId: i.lotId!,
          preQty: i.preQty,
          postQty: 0,
          preEvd: "",
          postEvd: "",
          note: i.note,
        })),
      };

      setSubmitting(true);
      try {
        await createTask(payload);
        toast.success("Tạo nhiệm vụ thành công!");
        router.back();
        return true;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || err?.message || "Đã xảy ra lỗi";
        toast.error(`Không thể tạo nhiệm vụ: ${msg}`);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [router],
  );

  return { submit, submitting };
};
