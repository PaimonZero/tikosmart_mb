import {
    cancelDeliveryRunOrder,
    completeDeliveryRunOrder,
    reopenDeliveryRunOrder,
    startDeliveryRunOrder
} from '@/store/deliveryRunsSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Linking, Modal as RNModal, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
}

export default function OrderDetailItem({ order, index, isLast, runStatus, onRefresh, avoidToll }: OrderDetailItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    // Modal states for Completion/Cancellation
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'complete' | 'cancel' | null>(null);

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
                // Temporarily update dialog to loading state
                setDialogConfig(prev => ({ ...prev, isLoading: true }));
                try {
                    await dispatch(startDeliveryRunOrder(order.id)).unwrap();
                    setDialogVisible(false);
                    onRefresh();
                } catch (err: any) {
                    setDialogVisible(false); // Close confirm first
                    setTimeout(() => showError(err || "Không thể bắt đầu giao hàng"), 100);
                } finally {
                    setLoadingAction(null);
                }
            }
        );
    };

    const handleOpenModal = (type: 'complete' | 'cancel') => {
        if (runStatus !== 'in_progress') {
            // showError("Bạn chỉ có thể thực hiện thao tác này khi chuyến đi đang ở trạng thái 'Đang giao hàng'.");
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

    return (
        <View className={clsx("flex-row items-stretch", !isLast && "mb-2")}>
            {/* Timeline Connector */}
            <View className="items-center mr-3">
                <View className={clsx("w-8 h-8 rounded-full items-center justify-center border-2",
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
                className="flex-1 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-4"
            >
                {/* Header: Customer & Status */}
                <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-1 mr-2">
                        <Text className="text-slate-900 font-black text-lg leading-tight" numberOfLines={1}>
                            {order.customer?.name || "Khách lẻ"}
                        </Text>
                        <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mt-1">
                            Mã đơn: {order.orderNo || order.id.slice(0, 8).toUpperCase()}
                        </Text>
                    </View>
                    <View className={clsx("px-3 py-1 rounded-full border", statusStyle.bg, statusStyle.border)}>
                        <Text className={clsx("text-[10px] font-black uppercase tracking-tight", statusStyle.text)}>
                            {statusStyle.label}
                        </Text>
                    </View>
                </View>

                {/* Body: Address & Price */}
                <View className="space-y-3 mb-4 mt-2 border-t border-slate-50 pt-3">
                    <View className="flex-col">
                        <View className="flex-row items-start">
                            <Ionicons name="location" size={18} color="#64748B"  />
                            <Text className="text-slate-700 text-sm ml-2 flex-1 font-bold leading-5">
                                {order.customer?.address || "Không rõ địa chỉ"}
                            </Text>
                        </View>
                        <View className="flex-row justify-end pb-1 pr-1 mt-2">
                            <TouchableOpacity
                                onPress={handleGetDirections}
                                className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center shadow-sm active:bg-blue-700"
                            >
                                <Ionicons name="navigate-outline" size={16} color="white" />
                                <Text className="text-white text-sm font-black ml-1.5 uppercase tracking-wide">Chỉ đường</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-row items-center border-t border-slate-50 pt-3 mt-1">
                        <View className="w-10 h-10 rounded-full bg-green-50 items-center justify-center mr-3">
                            <Ionicons name="cash" size={22} color="#10B981" />
                        </View>
                        <View>
                            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Tiền thu hộ (COD)</Text>
                            <Text className="text-green-600 font-black text-2xl">
                                {order.codAmount?.toLocaleString() || '0'} 
                                <Text className="text-sm font-bold ml-1">đ</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row gap-3">
                    {(order.status === 'pending' || order.status === 'assigned') && (isShipper || isSup) && (
                        <TouchableOpacity
                            onPress={handleStart}
                            disabled={!!loadingAction || runStatus !== 'in_progress'}
                            className={clsx("flex-1 py-3.5 rounded-2xl items-center flex-row justify-center space-x-3 shadow-md",
                                runStatus === 'in_progress' ? "bg-blue-600" : "bg-slate-300"
                            )}
                        >
                            {loadingAction === 'start' ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <View className="flex-row items-center justify-center">
                                    <Feather name={runStatus === 'in_progress' ? "play" : "lock"} size={16} color="#fff" />
                                    <Text className="text-white font-black text-sm ml-2">BẮT ĐẦU GIAO</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}

                    {order.status === 'in_progress' && (
                        <>
                            {(isShipper || isSup) && (
                                <TouchableOpacity
                                    onPress={() => handleOpenModal('complete')}
                                    disabled={!!loadingAction}
                                    className="flex-1 bg-green-600 py-4 rounded-2xl items-center flex-row justify-center shadow-lg active:bg-green-700"
                                >
                                    <Feather name="check-circle" size={20} color="#fff" />
                                    <Text className="text-white font-black text-base ml-2">HOÀN TẤT</Text>
                                </TouchableOpacity>
                            )}
                            {isAdmin && (
                                <TouchableOpacity
                                    onPress={() => handleOpenModal('cancel')}
                                    disabled={!!loadingAction}
                                    className="flex-1 bg-red-50 py-4 rounded-2xl items-center flex-row justify-center border-2 border-red-100 active:bg-red-100"
                                >
                                    <Feather name="x-circle" size={20} color="#EF4444" />
                                    <Text className="text-red-500 font-black text-base ml-2">HỦY ĐƠN</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {order.status === 'cancelled' && (isAdmin || isSup) && (
                        <TouchableOpacity
                            onPress={handleReopen}
                            disabled={!!loadingAction}
                            className="flex-1 bg-slate-100 py-4 rounded-2xl items-center flex-row justify-center border-2 border-slate-200 active:bg-slate-200 shadow-sm"
                        >
                            <Feather name="rotate-ccw" size={20} color="#475569" />
                            <Text className="text-slate-600 font-black text-sm ml-2">MỞ LẠI ĐƠN</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>

            {/* Action Modals */}
            <OrderActionModal
                visible={modalVisible && runStatus === 'in_progress'}
                type={modalType}
                userRole={userRole}
                order={order}
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
