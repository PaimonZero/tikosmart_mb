import EditTaskHeader from "@/components/task-manage/EditTask/EditTaskHeader";
import EditTaskInfoCard from "@/components/task-manage/EditTask/EditTaskInfoCard";
import { EditLotItem } from "@/components/task-manage/EditTask/EditTaskLotSheet";
import { EditTaskItemRow } from "@/components/task-manage/EditTask/EditTaskProductRow";
import EditTaskProductSection from "@/components/task-manage/EditTask/EditTaskProductSection";
import EditTaskSkeleton from "@/components/task-manage/EditTask/EditTaskSkeleton";
import { useTaskRouteGuard } from "@/hooks/useTaskPermission";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInventoryLotsByDepartmentAndProduct } from "@/store/inventoryLotSlice";
import { fetchProductById } from "@/store/productSlice";
import { fetchSalesOrderById } from "@/store/salesOrdersSlice";
import { fetchTaskById, updateTask } from "@/store/taskSlice";
import { fetchUserById } from "@/store/userSlice";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function EditTaskScreen() {
  useTaskRouteGuard("edit");

  const { id: taskIdParam } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const packerSheetRef = useRef<BottomSheetModal>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [taskDetail, setTaskDetail] = useState<any>(null);
  const [orderDetail, setOrderDetail] = useState<any>(null);
  const [items, setItems] = useState<EditTaskItemRow[]>([]);
  const [lotsByItem, setLotsByItem] = useState<Record<string, EditLotItem[]>>({});
  const [productInfoMap, setProductInfoMap] = useState<Record<string, any>>({});
  const [packerId, setPackerId] = useState("");
  const [packerName, setPackerName] = useState("");
  const [packerAvatar, setPackerAvatar] = useState<string | undefined>(undefined);
  const [supervisorAvatar, setSupervisorAvatar] = useState<string | undefined>(undefined);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadData = useCallback(async () => {
    if (!taskIdParam) return;
    setLoading(true);
    try {
      const res = await dispatch(fetchTaskById(taskIdParam as string)).unwrap();
      const data = res?.data || res;
      setTaskDetail(data);

      // Fetch supervisor info for avatar
      if (data.supervisorId) {
        dispatch(fetchUserById(data.supervisorId)).unwrap()
          .then(u => setSupervisorAvatar(u.avatar))
          .catch(() => {});
      }

      const orderRes = await dispatch(fetchSalesOrderById(data.orderId)).unwrap();
      const orderData = orderRes?.data || orderRes;
      setOrderDetail(orderData);

      setPackerId(data.packerId || "");
      setPackerName(data.packerName || "");
      
      // Fetch packer info for avatar
      if (data.packerId) {
        dispatch(fetchUserById(data.packerId)).unwrap()
          .then(u => setPackerAvatar(u.avatar))
          .catch(() => {});
      }

      setDeadline(data.deadline ? new Date(data.deadline) : null);
      setNote(data.note || "");

      // Collect initial items
      const rawItems = data?.items || [];
      
      // Fetch product info for consistency (images, true SKU)
      const pIds = rawItems.map((i: any) => {
        const oiId = i.orderItemId || i.order_item_id;
        const oi = orderData?.items?.find((o: any) => o.id === oiId);
        return oi?.productId;
      }).filter(Boolean);

      const pMap: Record<string, any> = {};
      if (pIds.length > 0) {
        const uniquePIds = [...new Set(pIds)];
        const pResults = await Promise.allSettled(
          uniquePIds.map((pId) => dispatch(fetchProductById(pId as string)).unwrap())
        );
        pResults.forEach((r, idx) => {
          if (r.status === "fulfilled") {
            const pData = r.value?.data || r.value;
            pMap[uniquePIds[idx] as string] = pData;
          }
        });
        setProductInfoMap(pMap);
      }

      const mappedItems: EditTaskItemRow[] = rawItems.map((i: any) => {
        const safeOrderItemId = i.orderItemId || i.order_item_id;
        const orderItem = orderData?.items?.find((oi: any) => oi.id === safeOrderItemId);
        const productData = pMap[orderItem?.productId];

        const initPreQty = Number(i.preQty || 0);
        const initRemain = Number(orderItem?.remain || 0);
        const initTotalNeeded = initPreQty + initRemain;

        return {
          key: i.id,
          itemId: i.id,
          orderItemId: safeOrderItemId,
          lotId: i.lotId,
          preQty: Number(i.preQty || 0),
          postQty: Number(i.postQty || 0),
          productName: i.productName || orderItem?.productName || productData?.name || "",
          remain: Number(orderItem?.remain || 0),
          note: i.note || "",
          productId: orderItem?.productId,
          image: productData?.imgUrl || orderItem?.productImage,
          sku: productData?.skuCode || orderItem?.sku,
          preEvd: i.preEvd,
          postEvd: i.postEvd,
          initPreQty,
          initRemain,
          initTotalNeeded,
        };
      });

      setItems(mappedItems);

      const departmentId = orderData?.departmentId;
      if (departmentId && mappedItems.length > 0) {
        const results = await Promise.allSettled(
          mappedItems.map((i) =>
            dispatch(
              fetchInventoryLotsByDepartmentAndProduct({
                departmentId,
                productId: i.productId,
                params: {},
              })
            ).unwrap()
          )
        );

        const selectedLotIdsByOrderItem: Record<string, Set<string>> = {};
        mappedItems.forEach((i) => {
          if (!selectedLotIdsByOrderItem[i.orderItemId]) {
            selectedLotIdsByOrderItem[i.orderItemId] = new Set();
          }
          if (i.lotId) {
            selectedLotIdsByOrderItem[i.orderItemId].add(i.lotId);
          }
        });

        const lotsMap: Record<string, EditLotItem[]> = {};
        results.forEach((r, idx) => {
          const orderItemId = mappedItems[idx].orderItemId;
          if (r.status === "fulfilled") {
            const rawLots = r.value?.items || r.value?.data || [];
            const validLots = rawLots.filter((lot: any) => {
              const notExpired = new Date(lot.expiryDate || "") > new Date();
              const hasQty = lot.qtyOnHand > 0;
              const isSelected = selectedLotIdsByOrderItem[orderItemId]?.has(lot.id);
              return (hasQty && notExpired) || isSelected;
            });
            lotsMap[orderItemId] = validLots;
          } else {
            lotsMap[orderItemId] = [];
          }
        });
        setLotsByItem(lotsMap);
      }
    } catch (err: any) {
      toast.error("Không thể tải dữ liệu nhiệm vụ", {
        description: err?.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, taskIdParam]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleItemChange = useCallback((key: string, field: keyof EditTaskItemRow, value: any) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, [field]: value } : i)));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!taskDetail?.id) return;
    if (!packerId) {
      toast.warning("Vui lòng chọn người đóng gói");
      return;
    }
    if (!deadline) {
      toast.warning("Vui lòng chọn hạn chót");
      return;
    }

    const validItems = items.filter((i) => i.lotId && i.preQty > 0);
    if (validItems.length === 0) {
      toast.warning("Vui lòng chọn lô hàng và nhập số lượng");
      return;
    }

    const payload = {
      packerId,
      deadline: deadline.toISOString(),
      note,
      items: validItems.map((i) => ({
        id: i.itemId,
        orderItemId: i.orderItemId,
        lotId: i.lotId,
        preQty: Number(i.preQty || 0),
        postQty: Number(i.postQty || 0),
        preEvd: i.preEvd || "",
        postEvd: i.postEvd || "",
        note: i.note || "",
      })),
    };

    setSaving(true);
    try {
      await dispatch(updateTask({ id: taskDetail.id, data: payload })).unwrap();
      toast.success("Cập nhật nhiệm vụ thành công");
      router.back();
    } catch (err: any) {
      toast.error("Không thể cập nhật nhiệm vụ", {
        description: err?.message || "Có lỗi xảy ra",
      });
    } finally {
      setSaving(false);
    }
  }, [deadline, dispatch, items, note, packerId, router, taskDetail?.id]);

  const supervisorName = useMemo(() => {
    if (taskDetail?.supervisorName) return taskDetail.supervisorName;
    return user?.fullName || user?.username || "";
  }, [taskDetail?.supervisorName, user?.fullName, user?.username]);

  if (loading) {
    return <EditTaskSkeleton />;
  }
  
  return (
    <BottomSheetModalProvider>
      <SafeAreaView className="flex-1 bg-gray-100" edges={["top", "bottom"]}>
        <EditTaskHeader onBack={() => router.back()} disabled={saving} />

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
          enableOnAndroid
          extraScrollHeight={24}
        >
          <EditTaskInfoCard
            orderNo={orderDetail?.orderNo}
            customerName={orderDetail?.customerName}
            supervisorName={supervisorName}
            supervisorAvatar={supervisorAvatar}
            packerId={packerId}
            packerName={packerName}
            packerAvatar={packerAvatar}
            deadline={deadline}
            note={note}
            showDatePicker={showDatePicker}
            packerSheetRef={packerSheetRef}
            onNoteChange={setNote}
            onOpenDatePicker={() => setShowDatePicker(true)}
            onDateChange={(date) => {
              setShowDatePicker(false);
              if (date) setDeadline(date);
            }}
            onPackerSelect={(picker) => {
              setPackerId(picker.id);
              setPackerName(picker.fullName || picker.username || "");
              setPackerAvatar(picker.avatar);
            }}
          />

          <EditTaskProductSection
            items={items}
            lotsByItem={lotsByItem}
            onChange={handleItemChange}
          />
        </KeyboardAwareScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-lg">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={saving}
            className={`rounded-xl flex-row items-center justify-center py-4 ${saving ? "bg-blue-400" : "bg-blue-600"}`}
          >
            <Text className="text-white font-bold text-base">
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}
