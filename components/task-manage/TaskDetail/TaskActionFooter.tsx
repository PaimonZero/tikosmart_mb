import { CheckCircle, PlayCircle, Send, XCircle } from "lucide-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { toast } from "sonner-native";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateTaskReview, updateTaskStatus } from "@/store/taskSlice";

interface TaskActionFooterProps {
    taskDetail: any;
    orderDetail: any;
    userRole: string;
    canCancelTask: boolean;
    updating: boolean;
    setUpdating: (val: boolean) => void;
    onSuccess: () => void;
}

export default function TaskActionFooter({
    taskDetail,
    orderDetail,
    userRole,
    canCancelTask,
    updating,
    setUpdating,
    onSuccess,
}: TaskActionFooterProps) {
    const dispatch = useAppDispatch();
    const updateStatus = useAppSelector((state) => state.task.updateStatus);

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [targetStatus, setTargetStatus] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewResult, setReviewResult] = useState<"confirmed" | "rejected" | "">("");
    const [reviewReason, setReviewReason] = useState("");

    const isCancelled = taskDetail?.status === "cancelled" || orderDetail?.status === "cancelled";

    const handleUpdateStatus = async (newStatus: string, confirmationMessage: string) => {
        setTargetStatus(newStatus);
        setConfirmMessage(confirmationMessage);
        setShowConfirmDialog(true);
    };

    const openReviewModal = (result: "confirmed" | "rejected") => {
        setReviewResult(result);
        setReviewReason("");
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setReviewReason("");
        setReviewResult("");
    };

    const handleSubmitReview = async () => {
        if (!taskDetail?.id || !reviewResult) return;
        if (reviewResult === "rejected" && !reviewReason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối.");
            return;
        }

        setUpdating(true);
        try {
            await dispatch(
                updateTaskReview({
                    id: taskDetail.id,
                    data: {
                        result: reviewResult,
                        reason: reviewReason.trim(),
                    },
                })
            ).unwrap();

            if (reviewResult === "confirmed") {
                await dispatch(updateTaskStatus({ id: taskDetail.id, status: "completed" })).unwrap();
            }

            toast.success(reviewResult === "confirmed" ? "Đã duyệt nhiệm vụ" : "Đã từ chối nhiệm vụ");
            closeReviewModal();
            onSuccess();
        } catch (err: any) {
            toast.error("Cập nhật review thất bại", {
                description: err?.message || "Không thể cập nhật review nhiệm vụ.",
            });
        } finally {
            setUpdating(false);
        }
    };

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

        if (userRole !== "picker" && taskDetail?.status === "pending_review") {
            return (
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-lg">
                    <View className="flex-row space-x-3">
                        <TouchableOpacity
                            className="flex-1 bg-green-600 rounded-xl flex-row items-center justify-center py-3.5"
                            onPress={() => openReviewModal("confirmed")}
                        >
                            <CheckCircle color="white" size={20} />
                            <Text className="text-white font-bold text-base ml-2">Duyệt</Text>
                        </TouchableOpacity>
                        <View className="w-4" />
                        <TouchableOpacity
                            className="flex-1 bg-red-500 rounded-xl flex-row items-center justify-center py-3.5"
                            onPress={() => openReviewModal("rejected")}
                        >
                            <XCircle color="white" size={20} />
                            <Text className="text-white font-bold text-base ml-2">Từ chối</Text>
                        </TouchableOpacity>
                    </View>

                    {canCancelTask && (
                        <TouchableOpacity
                            onPress={() => handleUpdateStatus("cancelled", "Bạn có chắc muốn huỷ nhiệm vụ này?")}
                            className="mt-3 bg-gray-100 rounded-xl flex-row items-center justify-center py-3.5 border border-gray-200"
                        >
                            <XCircle color="#EF4444" size={20} />
                            <Text className="text-red-500 font-bold text-base ml-2">Huỷ nhiệm vụ</Text>
                        </TouchableOpacity>
                    )}
                </View>
            );
        }

        if (canCancelTask) {
            return (
                <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-lg">
                    <TouchableOpacity
                        onPress={() => handleUpdateStatus("cancelled", "Bạn có chắc muốn huỷ nhiệm vụ này?")}
                        className="bg-gray-100 rounded-xl flex-row items-center justify-center py-3.5 border border-gray-200"
                    >
                        <XCircle color="#EF4444" size={20} />
                        <Text className="text-red-500 font-bold text-base ml-2">Huỷ nhiệm vụ</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    return (
        <>
            {renderStickyActions()}

            <Modal
                visible={showReviewModal}
                transparent
                animationType="fade"
                onRequestClose={closeReviewModal}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        className="w-full px-4"
                    >
                        <View className="bg-white rounded-2xl p-6">
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="text-xl font-bold text-gray-900">
                                    {reviewResult === "confirmed" ? "Duyệt nhiệm vụ" : "Từ chối nhiệm vụ"}
                                </Text>
                                <Pressable onPress={closeReviewModal} disabled={updating}>
                                    <XCircle size={22} color="#6b7280" />
                                </Pressable>
                            </View>

                            <Text className="text-gray-600 mb-2">
                                {reviewResult === "confirmed"
                                    ? "Bạn có muốn để lại nhận xét cho nhiệm vụ này không?"
                                    : "Vui lòng nhập lý do từ chối."}
                            </Text>
                            <TextInput
                                value={reviewReason}
                                onChangeText={setReviewReason}
                                placeholder={reviewResult === "rejected" ? "Nhập lý do từ chối" : "Nhập nhận xét (tuỳ chọn)"}
                                placeholderTextColor="#9ca3af"
                                multiline
                                numberOfLines={4}
                                editable={!updating}
                                textAlignVertical="top"
                                className="border border-gray-300 rounded-lg p-3 text-base mb-4 min-h-[96px]"
                            />

                            <View className="flex-row gap-3">
                                <Pressable
                                    onPress={closeReviewModal}
                                    disabled={updating}
                                    className="flex-1 bg-gray-200 py-3 rounded-lg active:opacity-70"
                                >
                                    <Text className="text-gray-700 text-center font-semibold">Hủy</Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleSubmitReview}
                                    disabled={updating}
                                    className="flex-1 bg-blue-600 py-3 rounded-lg active:opacity-70"
                                >
                                    <Text className="text-white text-center font-semibold">
                                        {updating ? "Đang gửi..." : "Xác nhận"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            <ConfirmDialog
                visible={showConfirmDialog}
                onDismiss={() => setShowConfirmDialog(false)}
                onConfirm={async () => {
                    if (!taskDetail?.id) return;
                    setUpdating(true);
                    try {
                        await dispatch(updateTaskStatus({ id: taskDetail.id, status: targetStatus })).unwrap();
                        toast.success("Cập nhật trạng thái thành công");
                        setShowConfirmDialog(false);
                        onSuccess(); // Reload
                    } catch (err: any) {
                        toast.error("Cập nhật trạng thái thất bại", {
                            description: err?.message || "Không thể thay đổi trạng thái.",
                        });
                        setShowConfirmDialog(false);
                    } finally {
                        setUpdating(false);
                    }
                }}
                title="Xác nhận"
                content={confirmMessage || "Bạn có chắc chắn muốn thực hiện thao tác này?"}
                cancelLabel="Hủy"
                confirmLabel="Đồng ý"
                isDanger={targetStatus === "cancelled" || targetStatus === "rejected"}
                isLoading={updateStatus === "loading" || updating}
            />
        </>
    );
}
