import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, PlayCircle, Send, XCircle } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInventoryLotById } from "@/store/inventoryLotSlice";
import { fetchProductById } from "@/store/productSlice";
import { fetchSalesOrderById } from "@/store/salesOrdersSlice";
import { fetchTaskById, updateTaskStatus } from "@/store/taskSlice";
// Make sure this hook exists per phase 1 plan
import { useTaskPermission } from "@/hooks/useTaskPermission";

import TaskInfoCards from "@/components/task-manage/TaskDetail/TaskInfoCards";
import TaskProductList from "@/components/task-manage/TaskDetail/TaskProductList";
import TaskTimeline from "@/components/task-manage/TaskDetail/TaskTimeline";
import StatusBadge from "@/components/task-manage/TaskList/StatusBadge";

export default function TaskDetailScreen() {
    const { id: taskIdParam } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const userRole = user?.role || "";

    // Access control hook
    const { canView } = useTaskPermission();

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [taskDetail, setTaskDetail] = useState<any>(null);
    const [taskItems, setTaskItems] = useState<any[]>([]);
    const [orderDetail, setOrderDetail] = useState<any>(null);
    const [lotInfoMap, setLotInfoMap] = useState<Record<string, any>>({});
    const [productInfoMap, setProductInfoMap] = useState<Record<string, any>>({});

    const loadData = async () => {
        if (!taskIdParam) return;
        setLoading(true);
        try {
            // Fetch Task details
            const res = await dispatch(fetchTaskById(taskIdParam as string)).unwrap();
            const data = res?.data || res;
            setTaskDetail(data);

            const items = res?.items || data?.items || [];
            setTaskItems(items);

            // Fetch lots
            const lotIds = items.map((i: any) => i.lotId).filter(Boolean);
            const lMap: Record<string, any> = {};
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

            // Fetch products based on lot.productId
            const productIds = Object.values(lMap)
                .map((lot: any) => lot?.productId)
                .filter((v: any, i: number, a: any[]) => v && a.indexOf(v) === i);

            if (productIds.length > 0) {
                const productPromises = productIds.map((pId: string) => dispatch(fetchProductById(pId)).unwrap());
                const productResults = await Promise.allSettled(productPromises);
                const pMap: Record<string, any> = {};
                productResults.forEach((r, idx) => {
                    if (r.status === "fulfilled") {
                        pMap[productIds[idx]] = r.value?.data || r.value;
                    }
                });
                setProductInfoMap(pMap);
            }

            // Fetch Sales Order
            if (data?.orderId) {
                const orderRes = await dispatch(fetchSalesOrderById(data.orderId)).unwrap();
                setOrderDetail(orderRes?.data || orderRes);
            }
        } catch (error) {
            console.error("Failed to load task details", error);
            Alert.alert("Lỗi", "Không thể tải chi tiết nhiệm vụ.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (canView) {
            loadData();
        }
    }, [taskIdParam, canView]);


    // Action Handlers
    const handleUpdateStatus = async (newStatus: string, confirmationMessage: string) => {
        Alert.alert("Xác nhận", confirmationMessage, [
            { text: "Hủy", style: "cancel" },
            {
                text: "Đồng ý",
                onPress: async () => {
                    if (!taskDetail?.id) return;
                    setUpdating(true);
                    try {
                        await dispatch(updateTaskStatus({ id: taskDetail.id, status: newStatus })).unwrap();
                        Alert.alert("Thành công", "Đã cập nhật trạng thái nhiệm vụ.");
                        loadData(); // Reload
                    } catch (err: any) {
                        Alert.alert("Lỗi", err?.message || "Không thể thay đổi trạng thái.");
                    } finally {
                        setUpdating(false);
                    }
                }
            }
        ]);
    };

    const isCancelled = taskDetail?.status === "cancelled" || orderDetail?.status === "cancelled";

    if (!canView) return null;

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-500">Đang tải chi tiết...</Text>
            </SafeAreaView>
        );
    }

    if (!taskDetail && !loading) {
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

    // Render Sticky Bottom Bar (Sticky Actions)
    const renderStickyActions = () => {
        if (isCancelled || updating) return null;

        if (userRole === "picker" && taskDetail?.status === "assigned") {
            return (
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-lg">
                    <TouchableOpacity
                        onPress={() => handleUpdateStatus("in_progress", "Bắt đầu thực hiện nhiệm vụ soạn hàng này?")}
                        className="bg-blue-600 rounded-xl flex-row items-center justify-center py-3.5"
                    >
                        <PlayCircle color="white" size={20} />
                        <Text className="text-white font-bold text-base ml-2">Bắt đầu làm</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (userRole === "picker" && taskDetail?.status === "in_progress") {
            return (
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-lg">
                    <TouchableOpacity
                        onPress={() => handleUpdateStatus("pending_review", "Xác nhận gửi yêu cầu duyệt nhiệm vụ này?")}
                        className="bg-amber-500 rounded-xl flex-row items-center justify-center py-3.5"
                    >
                        <Send color="white" size={20} />
                        <Text className="text-white font-bold text-base ml-2">Gửi Yêu Cầu Duyệt</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Supervisor review logic will go here (Duyệt/Từ chối buttons)
        if (userRole !== "picker" && taskDetail?.status === "pending_review") {
            return (
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-lg flex-row space-x-3">
                    <TouchableOpacity
                        className="flex-1 bg-green-600 rounded-xl flex-row items-center justify-center py-3.5"
                    // onPress={() => router.push(`/(shared)/task-manage/review-modal`)} 
                    /* Or open a Review Actions bottom sheet modal directly here */
                    >
                        <CheckCircle color="white" size={20} />
                        <Text className="text-white font-bold text-base ml-2">Duyệt</Text>
                    </TouchableOpacity>
                    <View className="w-4" />
                    <TouchableOpacity
                        className="flex-1 bg-red-500 rounded-xl flex-row items-center justify-center py-3.5"
                    >
                        <XCircle color="white" size={20} />
                        <Text className="text-white font-bold text-base ml-2">Từ chối</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };
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
                        <Text className="text-sm font-bold text-blue-600">#{taskDetail.id.slice(0, 8) || "Không rõ"}</Text>
                    </View>
                </View>
                <View className="ml-2 flex-shrink-0">
                    <StatusBadge status={taskDetail.status} />
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                <TaskTimeline taskDetail={taskDetail} isCancelled={isCancelled} />

                <TaskInfoCards taskDetail={taskDetail} orderDetail={orderDetail} />

                {/* Review Info box can be added here replacing TaskReviewInfo if it exists */}

                <TaskProductList
                    taskItems={taskItems}
                    userRole={userRole}
                    taskDetail={taskDetail}
                    lotInfoMap={lotInfoMap}
                    productInfoMap={productInfoMap}
                />

                {/* Padding bottom so content isn't hidden behind sticky action bar */}
                <View className="h-28" />
            </ScrollView>

            {/* Sticky Actions Footer */}
            {renderStickyActions()}

        </SafeAreaView>
    );
}
