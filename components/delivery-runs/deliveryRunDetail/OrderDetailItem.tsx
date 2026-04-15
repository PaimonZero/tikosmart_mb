import {
    cancelDeliveryRunOrder,
    completeDeliveryRunOrder,
    reopenDeliveryRunOrder,
    startDeliveryRunOrder
} from '@/store/deliveryRunsSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import dayjs from 'dayjs';

import { ActivityIndicator, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { getStatusStyles } from '../utils/helpers';
import { OrderActionModal } from './OrderActionModal';

// Utility to handle clsx-like behavior in NativeWind
function clsx(...args: any[]) {
    return args.filter(Boolean).join(' ');
}

interface OrderDetailItemProps {
    order: any;
    index: number;
    isLast: boolean;
    runStatus: string;
    onRefresh: () => void;
    avoidToll?: boolean;
    voiceCommandPayload?: {
        orderId: string;
        amount?: number;
        note?: string;
        openQR?: boolean;
        action?: string;
        nonce?: string;
    } | null;
}

export default function OrderDetailItem({ order, index, isLast, runStatus, onRefresh, avoidToll, voiceCommandPayload }: OrderDetailItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    // Logic SLA
    const slaDate = order.orderSlaDeliveryAt ? dayjs(order.orderSlaDeliveryAt) : null;
    const isOverdue = slaDate ? dayjs().isAfter(slaDate) : false;
    const isUrgent = slaDate ? slaDate.diff(dayjs(), 'minute') < 60 && !isOverdue : false;

    // Modal states for Completion/Cancellation
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'complete' | 'cancel' | null>(null);
    const lastVoiceNonceRef = React.useRef<string | null>(null);

    // ConfirmDialog State
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        title: '',
        content: '',
        onConfirm: () => { },
        showCancel: true,
        isDanger: false,
        confirmLabel: 'Xác nhận',
        isLoading: false
    });

    const showAlert = (title: string, content: string, onConfirm?: () => void) => {
        setDialogConfig({
            title,
            content,
            onConfirm: onConfirm || (() => setDialogVisible(false)),
            showCancel: false,
            isDanger: false,
            confirmLabel: 'Đóng',
            isLoading: false
        });
        setDialogVisible(true);
    };

    const showError = (content: string) => {
        setDialogConfig({
            title: 'Lỗi',
            content,
            onConfirm: () => setDialogVisible(false),
            showCancel: false,
            isDanger: true,
            confirmLabel: 'Đóng',
            isLoading: false
        });
        setDialogVisible(true);
    };

    const showConfirm = (title: string, content: string, onConfirm: () => void, isDanger = false) => {
        setDialogConfig({
            title,
            content,
            onConfirm,
            showCancel: true,
            isDanger,
            confirmLabel: 'Xác nhận',
            isLoading: false
        });
        setDialogVisible(true);
    };

    const statusStyle = getStatusStyles(order.status);
    const isAdmin = userRole === 'admin';
    const isSup = userRole === 'sup_shipper';
    const isShipper = userRole === 'shipper';

    const handleStart = () => {
        if (runStatus !== 'in_progress') {
            showError("Bạn cần bấm 'Bắt đầu chuyến đi' trước khi bắt đầu giao đơn hàng này.");
            return;
        }
        showConfirm(
            "Bắt đầu giao hàng",
            "Bạn có chắc muốn bắt đầu giao đơn hàng này không?",
            async () => {
                setLoadingAction('start');
                setDialogConfig(prev => ({ ...prev, isLoading: true }));
                try {
                    await dispatch(startDeliveryRunOrder(order.id)).unwrap();
                    setDialogVisible(false);
                    onRefresh();
                } catch (err: any) {
                    setDialogVisible(false);
                    setTimeout(() => showError(err || "Không thể bắt đầu giao hàng"), 100);
                } finally {
                    setLoadingAction(null);
                }
            }
        );
    };

    const handleOpenModal = (type: 'complete' | 'cancel') => {
        if (order.status === 'completed' || order.status === 'cancelled') {
            setModalType(order.status === 'completed' ? 'complete' : 'cancel');
            setModalVisible(true);
            return;
        }

        if (runStatus !== 'in_progress') {
            return;
        }
        
        setModalType(type);
        setModalVisible(true);
    };

    const handleActionSubmit = async (data: any) => {
        setLoadingAction(modalType);

        try {
            if (modalType === 'complete') {
                await dispatch(completeDeliveryRunOrder({
                    orderId: order.id,
                    data
                })).unwrap();
            } else if (modalType === 'cancel') {
                await dispatch(cancelDeliveryRunOrder({
                    orderId: order.id,
                    data
                })).unwrap();
            }

            setModalVisible(false);
            onRefresh();
            showAlert("Thành công", `Đã ${modalType === 'complete' ? 'hoàn thành' : 'hủy'} đơn hàng này.`);
        } catch (err: any) {
            setModalVisible(false);
            setTimeout(() => showError(err.message || err || "Thao tác thất bại"), 100);
        } finally {
            setLoadingAction(null);
        }
    };

    const handleReopen = () => {
        showConfirm(
            "Mở lại đơn hàng",
            "Đơn hàng sẽ quay về trạng thái 'Đã phân công'. Tiếp tục?",
            async () => {
                setLoadingAction('reopen');
                setDialogConfig(prev => ({ ...prev, isLoading: true }));
                try {
                    await dispatch(reopenDeliveryRunOrder({ orderId: order.id, data: {} })).unwrap();
                    setDialogVisible(false);
                    onRefresh();
                } catch (err: any) {
                    setDialogVisible(false);
                    setTimeout(() => showError(err || "Không thể mở lại đơn hàng"), 100);
                } finally {
                    setLoadingAction(null);
                }
            }
        );
    };

    const handleGetDirections = () => {
        const lat = order.customer?.lat;
        const lng = order.customer?.lng;
        if (!lat || !lng) {
            showError("Không tìm thấy tọa độ giao hàng cho đơn này");
            return;
        }
        
        let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        if (avoidToll) {
            url += '&avoid=tolls';
        }
        
        Linking.openURL(url).catch(() => {
            showError("Không thể mở ứng dụng bản đồ");
        });
    };

    React.useEffect(() => {
        if (!voiceCommandPayload) return;
        if (voiceCommandPayload.orderId !== order.id) return;
        if (!voiceCommandPayload.nonce) return;
        if (lastVoiceNonceRef.current === voiceCommandPayload.nonce) return;

        lastVoiceNonceRef.current = voiceCommandPayload.nonce;

        const action = String(voiceCommandPayload.action || "").toLowerCase();
        const targetType: 'complete' | 'cancel' = action.includes("cancel") ? "cancel" : "complete";

        setModalType(targetType);
        setModalVisible(true);
    }, [order.id, voiceCommandPayload]);

    const matchedVoicePayload =
        voiceCommandPayload?.orderId === order.id ? voiceCommandPayload : null;

    return (
        <View className={clsx("flex-row items-stretch", !isLast && "mb-4")}>
            {/* Timeline Connector */}
            <View className="items-center mr-3 mt-1.5">
                <View className={clsx("w-7 h-7 rounded-full items-center justify-center border-2",
                    order.status === 'in_progress' ? "bg-blue-50 border-blue-500" :
                        order.status === 'completed' ? "bg-green-50 border-green-500" : "bg-slate-50 border-slate-300"
                )}>
                    {order.status === 'completed' ? (
                        <Ionicons name="checkmark" size={16} color="#10B981" />
                    ) : (
                        <Text className={clsx("font-bold text-xs",
                            order.status === 'in_progress' ? "text-blue-600" : "text-slate-500"
                        )}>{index + 1}</Text>
                    )}
                </View>
                {!isLast && <View className="flex-1 w-0.5 bg-slate-200 my-1" />}
            </View>

            {/* Order Card Content */}
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => handleOpenModal('complete')}
                className={clsx("flex-1 bg-white rounded-2xl border shadow-sm",
                    order.status === 'in_progress' ? 'border-blue-200 shadow-blue-100/50' : 'border-slate-100'
                )}
            >
                <View className="p-3.5 pb-3">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-2 flex-col">
                            <Text className="text-slate-900 font-extrabold text-base" numberOfLines={1}>
                                {order.customer?.name || "Khách lẻ"}
                            </Text>
                            <Text className="text-slate-500 text-[10px] tracking-widest mt-1 font-black">
                                MÃ ĐƠN: {order.orderNo || order.id.slice(0, 8)}
                            </Text>
                        </View>
                        <View className={clsx("px-2.5 py-1 rounded-md border mt-0.5", statusStyle.bg, statusStyle.border)}>
                            <Text className={clsx("text-[10px] font-black uppercase tracking-widest", statusStyle.text)}>
                                {statusStyle.label}
                            </Text>
                        </View>
                    </View>

                    {/* Address & Phone */}
                    <View className="flex-col mb-1">
                        <View className="flex-row items-start mb-2.5">
                            <Ionicons name="location" size={18} color="#475569" style={{ marginTop: 2 }} />
                            <Text className="text-slate-800 text-sm ml-1.5 flex-1 font-semibold leading-5">
                                {order.customer?.address || "Không rõ địa chỉ"}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="call" size={16} color="#475569" />
                            <Text className="text-slate-800 text-sm ml-1.5 font-bold tracking-wide">
                                {order.customer?.phone || "Không có số điện thoại"}
                            </Text>
                        </View>
                    </View>

                    {/* SLA Time & Note */}
                    <View className="flex-col mt-2 space-y-2">
                        {slaDate && (
                            <View className={clsx("flex-row items-center ml-0.5", 
                                isOverdue ? "text-red-600" : isUrgent ? "text-orange-600" : "text-slate-600"
                            )}>
                                <Ionicons name="time" size={16} color={isOverdue ? "#EF4444" : isUrgent ? "#F97316" : "#475569"} />
                                <Text className={clsx("text-sm ml-1.5 font-bold",
                                    isOverdue ? "text-red-600" : isUrgent ? "text-orange-600" : "text-slate-600"
                                )}>
                                    SLA: {slaDate.format('HH:mm - DD/MM/YYYY')}
                                </Text>
                            </View>
                        )}
                        {!!order.customer?.note && (
                            <View className="flex-row items-start bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 mt-1.5">
                                <Ionicons name="warning" size={16} color="#D97706" style={{ marginTop: 1 }}/>
                                <Text className="text-amber-900 text-sm leading-5 font-medium ml-1.5 flex-1">
                                    {order.customer.note}
                                </Text>
                            </View>
                        )}
                    </View>
                    
                    {/* COD & Action Buttons Inline */}
                    <View className="flex-row items-end justify-between mt-3 pt-3 border-t border-slate-100">
                        <View className="flex-col flex-1 pl-1">
                            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Tiền thu hộ (COD)</Text>
                            <Text className="text-green-600 font-black text-[22px] leading-6">
                                {order.codAmount?.toLocaleString() || '0'}<Text className="text-base font-bold text-green-600 ml-0.5 relative -top-0.5">đ</Text>
                            </Text>
                        </View>
                        <View className="flex-row gap-2.5">
                            {order.customer?.phone && (
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(`tel:${order.customer.phone}`)}
                                    className="w-11 h-11 rounded-xl bg-emerald-50 items-center justify-center border border-emerald-100 shadow-sm shadow-emerald-100"
                                >
                                    <Ionicons name="call" size={20} color="#10B981" />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleGetDirections}
                                className="w-11 h-11 rounded-xl bg-blue-50 items-center justify-center border border-blue-100 shadow-sm shadow-blue-100"
                            >
                                <Ionicons name="navigate" size={20} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Bottom Action Bar */}
                <View className="p-2.5 pt-1.5 pb-2.5 flex-row gap-2 bg-slate-50/50 rounded-b-2xl items-center mt-0.5 mb-0.5 mx-0.5">
                    {(order.status === 'pending' || order.status === 'assigned') && (isShipper || isSup) && (
                        <TouchableOpacity
                            onPress={handleStart}
                            disabled={!!loadingAction || runStatus !== 'in_progress'}
                            className={clsx("flex-1 py-3 rounded-xl items-center flex-row justify-center",
                                runStatus === 'in_progress' ? "bg-blue-600 shadow-sm shadow-blue-200" : "bg-slate-300"
                            )}
                        >
                            {loadingAction === 'start' ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Feather name={runStatus === 'in_progress' ? "play" : "lock"} size={16} color={runStatus === 'in_progress' ? "#fff" : "#64748B"} />
                                    <Text className={clsx("font-black text-sm ml-2", runStatus === 'in_progress' ? "text-white" : "text-slate-500")}>BẮT ĐẦU</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    {order.status === 'in_progress' && (
                        <>
                            {(isShipper || isSup) && (
                                <TouchableOpacity
                                    onPress={() => handleOpenModal('complete')}
                                    disabled={!!loadingAction}
                                    className="flex-1 bg-emerald-500 py-3 rounded-xl items-center flex-row justify-center shadow-sm shadow-emerald-200"
                                >
                                    <Feather name="check-circle" size={16} color="#fff" />
                                    <Text className="text-white font-black text-sm ml-2">HOÀN TẤT</Text>
                                </TouchableOpacity>
                            )}
                            {isAdmin && (
                                <TouchableOpacity
                                    onPress={() => handleOpenModal('cancel')}
                                    disabled={!!loadingAction}
                                    className="flex-1 bg-white border border-red-200 py-2.5 rounded-xl items-center flex-row justify-center shadow-sm shadow-red-50"
                                >
                                    <Feather name="x-circle" size={16} color="#EF4444" />
                                    <Text className="text-red-500 font-bold text-sm ml-2">HỦY ĐƠN</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {order.status === 'cancelled' && (isAdmin || isSup) && (
                        <TouchableOpacity
                            onPress={handleReopen}
                            disabled={!!loadingAction}
                            className="flex-1 bg-white border border-slate-200 py-2.5 rounded-xl items-center flex-row justify-center shadow-sm shadow-slate-50"
                        >
                            <Feather name="rotate-ccw" size={16} color="#475569" />
                            <Text className="text-slate-700 font-bold text-sm ml-2">MỞ LẠI</Text>
                        </TouchableOpacity>
                    )}
                    
                    {/* Placeholder when no actions are visible to keep the bar height consistent lightly */}
                    {(order.status === 'completed') && (
                        <View className="flex-1 py-1.5 items-center justify-center">
                             <Text className="text-slate-400 font-bold text-xs">ĐÃ GIAO XONG</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            {/* Action Modals */}
            <OrderActionModal
                visible={modalVisible}
                type={modalType}
                userRole={userRole}
                order={order}
                voicePrefill={
                    matchedVoicePayload
                        ? {
                            amount: matchedVoicePayload.amount,
                            note: matchedVoicePayload.note,
                            openQR: matchedVoicePayload.openQR,
                            nonce: matchedVoicePayload.nonce,
                        }
                        : null
                }
                onClose={() => setModalVisible(false)}
                onSubmit={handleActionSubmit}
            />

            <ConfirmDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                onConfirm={dialogConfig.onConfirm}
                title={dialogConfig.title}
                content={dialogConfig.content}
                showCancel={dialogConfig.showCancel}
                isDanger={dialogConfig.isDanger}
                confirmLabel={dialogConfig.confirmLabel}
                isLoading={dialogConfig.isLoading}
            />
        </View>
    );
}
