import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { taskSignal } from "@/services/taskSignal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInventoryLotById } from "@/store/inventoryLotSlice";
import { fetchProductById } from "@/store/productSlice";
import { fetchSalesOrderById } from "@/store/salesOrdersSlice";
import { fetchTaskById } from "@/store/taskSlice";
// Make sure this hook exists per phase 1 plan
import { useTaskPermission } from "@/hooks/useTaskPermission";

import TaskActionFooter from "@/components/task-manage/TaskDetail/TaskActionFooter";
import TaskDetailSkeleton from "@/components/task-manage/TaskDetail/TaskDetailSkeleton";
import TaskInfoCards from "@/components/task-manage/TaskDetail/TaskInfoCards";
import TaskReviewInfo from "@/components/task-manage/TaskDetail/TaskReviewInfo";
import TaskProductList from "@/components/task-manage/TaskDetail/TaskProductList";
import TaskTimeline from "@/components/task-manage/TaskDetail/TaskTimeline";
import StatusBadge from "@/components/task-manage/TaskList/StatusBadge";
import { toast } from "sonner-native";

export default function TaskDetailScreen() {
    const { id: taskIdParam } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const userRole = user?.role || "";

    const isFirstRun = useRef(true);

    // Access control hook
    const { canView, canCancelTask, canEdit } = useTaskPermission();

    const { selectedTask: taskDetail } = useAppSelector((state) => state.task);
    const { salesOrdersById: orderDetail } = useAppSelector((state) => state.salesOrders);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Derived taskItems from taskDetail
    const taskItems = (taskDetail as any)?.items || [];
    
    // Maps still local for convenience as they are dictionaries of specific IDs
    const [lotInfoMap, setLotInfoMap] = useState<Record<string, any>>({});
    const [productInfoMap, setProductInfoMap] = useState<Record<string, any>>({});

    const loadData = async () => {
        if (!taskIdParam) return;
        setLoading(true);
        try {
            // Fetch Task details (updates state.tasks.selectedTask in Redux)
            const res = await dispatch(fetchTaskById(taskIdParam as string)).unwrap();
            const data = res?.data || res;
            
            const items = res?.items || data?.items || [];

            // Fetch Sales Order (updates state.salesOrders.salesOrdersById in Redux)
            if (data?.orderId) {
                await dispatch(fetchSalesOrderById(data.orderId)).unwrap();
            }

            // Fetch info for lots and products
            await fetchMissingInfo(items);
        } catch (error) {
            console.error("Failed to load task details", error);
            toast.error("Lỗi", { description: "Không thể tải chi tiết nhiệm vụ." });
        } finally {
            setLoading(false);
        }
    };

    const fetchMissingInfo = async (items: any[]) => {
        const lotIds = items.map((i: any) => i.lotId).filter((id) => id && !lotInfoMap[id]);
        const lMap = { ...lotInfoMap };
        
        if (lotIds.length > 0) {
            const results = await Promise.allSettled(
                lotIds.map((lotId: string) => dispatch(fetchInventoryLotById(lotId)).unwrap())
            );
            results.forEach((r, idx) => {
                if (r.status === "fulfilled") {
                    lMap[lotIds[idx]] = r.value?.data || r.value;
                }
            });
            setLotInfoMap(lMap);
        }

        // Fetch missing products based on lot.productId
        // USE lMap HERE instead of lotInfoMap to avoid race condition/stale state
        const currentLots = items.map(i => lMap[i.lotId]).filter(Boolean);
        const productIds = currentLots
            .map((lot: any) => lot?.productId)
            .filter((v: any, i: number, a: any[]) => v && a.indexOf(v) === i && !productInfoMap[v]);

        if (productIds.length > 0) {
            const productPromises = productIds.map((pId: string) => dispatch(fetchProductById(pId)).unwrap());
            const productResults = await Promise.allSettled(productPromises);
            const pMap = { ...productInfoMap };
            productResults.forEach((r, idx) => {
                if (r.status === "fulfilled") {
                    pMap[productIds[idx]] = r.value?.data || r.value;
                }
            });
            setProductInfoMap(pMap);
        }
    };

    // Auto-refresh missing info when taskItems change (e.g. from realtime update)
    React.useEffect(() => {
        if (taskItems && taskItems.length > 0) {
            fetchMissingInfo(taskItems);
        }
    }, [taskItems]);

    useFocusEffect(
        useCallback(() => {
            if (canView) {
                if (isFirstRun.current || taskSignal.shouldRefresh) {
                    loadData();
                    isFirstRun.current = false;
                    taskSignal.shouldRefresh = false;
                }
            }
        }, [taskIdParam, canView])
    );

    const isCancelled = (taskDetail as any)?.status === "cancelled" || (orderDetail as any)?.status === "cancelled";

    if (!canView) return null;

    if (loading) {
        return <TaskDetailSkeleton />;
    }

    const taskData = taskDetail as any;
    const orderData = orderDetail as any;

    if (!taskData && !loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="px-4 py-3 flex-row items-center border-b border-gray-100 bg-white">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                        <ArrowLeft size={24} color="#1f2937" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold ml-2">Chi tiết nhiệm vụ</Text>
                </View>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">Không tìm thấy nhiệm vụ</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
            {/* Custom Header */}
            <View className="px-4 py-3 flex-row items-center border-b border-gray-200 bg-white z-10">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2" disabled={updating}>
                    <ArrowLeft size={24} color="#1f2937" />
                </TouchableOpacity>

                <View className="ml-2 flex-1 flex-row items-center overflow-hidden">
                    <Text className="text-xl font-bold text-gray-900 flex-shrink-0">
                        Mã nhiệm vụ:
                    </Text>
                    <View className="bg-blue-100 px-1.5 py-1 rounded ml-2 flex-shrink-0">
                        <Text className="text-sm font-bold text-blue-600">#{taskData.id?.slice(0, 8) || "Không rõ"}</Text>
                    </View>
                </View>
                <View className="ml-2 flex-row items-center gap-2">
                    <StatusBadge status={taskData.status} />
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                <TaskTimeline taskDetail={taskData} isCancelled={isCancelled} />
                {taskData?.review && (
                    <TaskReviewInfo review={taskData.review} />
                )}

                <TaskInfoCards 
                    taskDetail={taskData} 
                    orderDetail={orderData} 
                    canEdit={canEdit}
                    onEdit={() => router.push(`/(shared)/task-manage/${taskData.id}/edit` as any)}
                />


                <TaskProductList
                    taskItems={taskItems}
                    userRole={userRole}
                    taskDetail={taskData}
                    lotInfoMap={lotInfoMap}
                    productInfoMap={productInfoMap}
                />

                {/* Padding bottom so content isn't hidden behind sticky action bar */}
                <View className="h-52" />
            </ScrollView>

            {/* Sticky Actions Footer */}
            <TaskActionFooter
                taskDetail={taskData}
                orderDetail={orderData}
                userRole={userRole}
                canCancelTask={canCancelTask}
                canEdit={canEdit}
                onEdit={() => router.push(`/(shared)/task-manage/${taskData.id}/edit` as any)}
                updating={updating}
                setUpdating={setUpdating}
                onSuccess={loadData}
            />
        </SafeAreaView>
    );
}
