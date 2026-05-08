import { AppDispatch, RootState } from '@/store/store';
import { Feather, Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeliveryRunById, startDeliveryRun, completeDeliveryRun, cancelDeliveryRun, clearShipperLocation, resetDeliveryRunById, updateShipperLocation } from '../../../store/deliveryRunsSlice';

import DeliveryRunMap from '../../../components/delivery-runs/deliveryRunDetail/DeliveryRunMap';
import FloatingRunInfoCard from '../../../components/delivery-runs/deliveryRunDetail/FloatingRunInfoCard';
import OrderDetailItem from '../../../components/delivery-runs/deliveryRunDetail/OrderDetailItem';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import * as Location from 'expo-location';
import { getCurrentLocationWithTimeout } from '../../../utils/locationHelper';
import { StartTripModal } from '../../../components/delivery-runs/deliveryRunDetail/StartTripModal';
import { DeliveryRunActionButtons } from '../../../components/delivery-runs/deliveryRunDetail/DeliveryRunActionButtons';
import { Divider } from 'react-native-paper';
import { socket, emitShipperLocation } from '../../../utils/socketManager';


export default function DeliveryRunDetailScreen() {
    const {
        id,
        voiceOrderId,
        voiceAmount,
        voiceNote,
        voiceOpenQR,
        voiceAction,
        voiceNonce,
    } = useLocalSearchParams<{
        id: string;
        voiceOrderId?: string;
        voiceAmount?: string;
        voiceNote?: string;
        voiceOpenQR?: string;
        voiceAction?: string;
        voiceNonce?: string;
    }>();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { deliveryRunById, fetchStatus, fetchError } = useSelector((state: RootState) => state.deliveryRuns);
    const run = deliveryRunById as any;
    
    const loading = fetchStatus === 'loading';
    const error = fetchError;
    const [refreshing, setRefreshing] = useState(false);
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

    // Bottom Sheet setup
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['20%', '35%', '70%'], []);

    // Start Trip states
    const [startModalVisible, setStartModalVisible] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const voiceOrderPayload = useMemo(() => {
        if (!voiceOrderId) return null;
        const parsedAmount =
            voiceAmount !== undefined && voiceAmount !== "" ? Number(voiceAmount) : undefined;

        return {
            orderId: String(voiceOrderId),
            amount: Number.isFinite(parsedAmount as number) ? (parsedAmount as number) : undefined,
            note: voiceNote ? String(voiceNote) : undefined,
            openQR: voiceOpenQR === "1",
            action: voiceAction ? String(voiceAction) : undefined,
            nonce: voiceNonce ? String(voiceNonce) : undefined,
        };
    }, [voiceAction, voiceAmount, voiceNonce, voiceNote, voiceOpenQR, voiceOrderId]);

    useEffect(() => {
        if (!voiceNonce) return;
        const timer = setTimeout(() => {
            router.setParams({
                voiceOrderId: undefined,
                voiceAmount: undefined,
                voiceNote: undefined,
                voiceOpenQR: undefined,
                voiceAction: undefined,
                voiceNonce: undefined,
            } as any);
        }, 1200);
        return () => clearTimeout(timer);
    }, [router, voiceNonce]);

    // Dialog state for general messages
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogConfig, setDialogConfig] = useState<{
        title: string;
        content: string;
        onConfirm?: () => void;
        isDanger?: boolean;
        showCancel?: boolean;
        confirmLabel?: string;
        isLoading?: boolean;
    }>({
        title: '',
        content: '',
    });

    const userRole = useSelector((state: RootState) => state.auth.user?.role);
    const currentUserId = useSelector((state: RootState) => state.auth.user?.id);
    const isShipper = userRole === 'shipper';
    const isAdminOrSup = ['admin', 'sup_shipper'].includes(userRole || '');
    const isOwner = run?.shipperId === currentUserId;

    useEffect(() => {
        if (id) {
            // First clear current data to trigger loading state
            dispatch(resetDeliveryRunById());
            dispatch(clearShipperLocation());
            
            // Then fetch new data
            dispatch(fetchDeliveryRunById(id));
        }

        return () => {
            // Cleanup when leaving or switching
            dispatch(resetDeliveryRunById());
            dispatch(clearShipperLocation());
        };
    }, [id, dispatch]);

    // Socket subscription for tracking (Crucial for Admin viewing on Mobile)
    useEffect(() => {
        if (!id || run?.status !== 'in_progress') return;

        const handleSubscribe = () => {
            if (socket.connected) {
                socket.emit('subscribe_tracking', { runId: id });
            }
        };

        handleSubscribe();
        socket.on('connect', handleSubscribe);

        return () => {
            if (socket.connected) {
                socket.emit('unsubscribe_tracking', { runId: id });
            }
            socket.off('connect', handleSubscribe);
        };
    }, [id, run?.status]);

    // Proactive GPS sync for Shippers (Handles "Point B from yesterday" issue)
    useEffect(() => {
        if (!isShipper || !id || !run?.id || !isOwner) return;

        const syncPhysicalLocation = async () => {
            try {
                const { status } = await Location.getForegroundPermissionsAsync();
                if (status !== 'granted') return;

                const position = await getCurrentLocationWithTimeout(3000, Location.Accuracy.Balanced);

                if (position) {
                    const locationData = {
                        runId: id,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        vehicle_type: run?.vehicle_type,
                        timestamp: new Date().toISOString(),
                    };

                    dispatch(updateShipperLocation(locationData));
                    emitShipperLocation(locationData);
                } else {
                    console.warn("[GPS Sync] Proactive position returned null");
                }
            } catch (err) {
                console.warn("[GPS Sync] Proactive update failed:", err);
            }
        };

        syncPhysicalLocation();
    }, [id, run?.id, isShipper, isOwner, run?.vehicle_type, dispatch]);

    const showAlert = (title: string, content: string, isDanger = false) => {
        setDialogConfig({ title, content, isDanger, showCancel: false, onConfirm: () => setDialogVisible(false) });
        setDialogVisible(true);
    };

    const showError = (content: string) => {
        showAlert("Lỗi", content, true);
    };

    const showConfirm = (title: string, content: string, onConfirm: () => void, isDanger = false) => {
        setDialogConfig({
            title,
            content,
            onConfirm,
            showCancel: true,
            isDanger,
            confirmLabel: 'Xác nhận'
        });
        setDialogVisible(true);
    };

    const toggleHeader = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsHeaderExpanded(!isHeaderExpanded);
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (id) {
            await dispatch(fetchDeliveryRunById(id));
        }
        setRefreshing(false);
    }, [id, dispatch]);

    const handleStartTrip = async (data: { vehicle_type: 'motorcycle' | 'car'; avoid_toll: boolean }) => {
        setIsStarting(true);
        try {
            // 1. Get GPS Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            let gpsData = {};

            if (status === 'granted') {
                try {
                    const location = await getCurrentLocationWithTimeout(3000, Location.Accuracy.Balanced);
                    if (location) {
                        gpsData = {
                            shipper_lat: location.coords.latitude,
                            shipper_lng: location.coords.longitude,
                        };
                    } else {
                        console.warn("Failed to get location (returned null), proceeding without GPS");
                    }
                } catch (e) {
                    console.warn("Failed to get location, proceeding without GPS", e);
                }
            }

            // 2. Call API
            await dispatch(startDeliveryRun({
                id: id!,
                data: {
                    ...data,
                    ...gpsData
                }
            })).unwrap();

            setStartModalVisible(false);
            
            // Tracking is now auto-managed by useGlobalTracking (root layout)
            // The socket event 'delivery_runs_updated' will trigger checkAndSync
            
            onRefresh();
            showAlert("Thành công", "Chuyến giao hàng đã chính thức bắt đầu!");
        } catch (err: any) {
            showError(err || "Không thể bắt đầu chuyến giao hàng");
        } finally {
            setIsStarting(false);
        }
    };

    const handleCompleteTrip = async () => {
        showConfirm(
            "Hoàn thành chuyến đi",
            "Xác nhận bạn đã hoàn thành tất cả các điểm dừng và kết thúc chuyến đi này?",
            async () => {
                setDialogConfig(prev => ({ ...prev, isLoading: true }));
                try {
                    await dispatch(completeDeliveryRun(id!)).unwrap();
                    // Tracking auto-stops via useGlobalTracking when status changes
                    setDialogVisible(false);
                    onRefresh();
                    showAlert("Chúc mừng", "Bạn đã hoàn thành chuyến giao hàng!");
                } catch (err: any) {
                    setDialogVisible(false);
                    setTimeout(() => showError(err || "Không thể hoàn thành chuyến đi"), 100);
                }
            }
        );
    };

    const handleCancelTrip = async () => {
        showConfirm(
            "Hủy chuyến đi",
            "Bạn có chắc chắn muốn hủy toàn bộ chuyến giao hàng này không? Hành động này không thể hoàn tác.",
            async () => {
                setDialogConfig(prev => ({ ...prev, isLoading: true }));
                try {
                    await dispatch(cancelDeliveryRun(id!)).unwrap();
                    setDialogVisible(false);
                    onRefresh();
                    showAlert("Đã hủy", "Chuyến giao hàng đã thực hiện hủy thành công.");
                } catch (err: any) {
                    setDialogVisible(false);
                    setTimeout(() => showError(err || "Không thể hủy chuyến đi"), 100);
                }
            },
            true // isDanger
        );
    };

    if (loading && !refreshing && (!deliveryRunById || !Object.keys(deliveryRunById).length)) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-slate-500 mt-4 font-medium">Đang tải chi tiết chuyến giao...</Text>
            </View>
        );
    }

    if (error && (!deliveryRunById || !Object.keys(deliveryRunById).length)) {
        return (
            <View className="flex-1 bg-white items-center justify-center px-10">
                <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
                    <Ionicons name="alert-circle" size={40} color="#EF4444" />
                </View>
                <Text className="text-slate-900 text-lg font-bold text-center">
                    Không thể tải dữ liệu
                </Text>
                <Text className="text-slate-500 text-sm mt-2 text-center">
                    {error || "Đã có lỗi xảy ra khi tải thông tin chi tiết."}
                </Text>
                <TouchableOpacity
                    onPress={onRefresh}
                    className="mt-6 bg-blue-500 px-6 py-3 rounded-xl shadow-sm"
                >
                    <Text className="text-white font-bold">Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!deliveryRunById || !Object.keys(deliveryRunById).length) return null;

    return (
        <View style={styles.container}>

            {/* 1. Background Map */}
            <View style={StyleSheet.absoluteFillObject}>
                <DeliveryRunMap run={run} />
            </View>

            {/* Top Navigation Layer */}
            <View
                style={{ top: insets.top + 10 }}
                className="flex-row items-start px-4 w-full absolute z-30 gap-3"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-slate-100 mt-1.5"
                >
                    <Ionicons name="chevron-back" size={28} color="#1E293B" />
                </TouchableOpacity>

                <FloatingRunInfoCard
                    run={run}
                    isExpanded={isHeaderExpanded}
                    onToggle={toggleHeader}
                    className="flex-1 shadow-lg"
                />
            </View>

            {/* 4. Bottom Sheet for Order List */}
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                enableOverDrag={false}
                enableDynamicSizing={false}
                handleIndicatorStyle={{ backgroundColor: '#CBD5E1', width: 40 }}
                backgroundStyle={{ backgroundColor: '#F8FAFC', borderRadius: 32 }}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 999,
                    zIndex: 999,
                }}
            >
                <BottomSheetFlatList
                    data={run.orders || []}
                    keyExtractor={(item: any) => item.id}
                    contentContainerStyle={{
                        paddingHorizontal: 14,
                        paddingBottom: insets.bottom + 20,
                    }}
                    renderItem={({ item, index }: { item: any, index: number }) => (
                        <OrderDetailItem
                            order={item}
                            index={index}
                            isLast={index === (run.orders?.length || 0) - 1}
                            runStatus={run.status}
                            avoidToll={run.avoid_toll}
                            onRefresh={onRefresh}
                            voiceCommandPayload={voiceOrderPayload}
                        />
                    )}
                    ListHeaderComponent={
                        <View className="mb-1">
                            <View className="flex-row items-center justify-between py-3">
                                <View className="flex-row items-center">
                                    <View className="bg-blue-50 w-8 h-8 rounded-xl items-center justify-center mr-3 border border-blue-100">
                                        <Feather name="map" size={14} color="#3B82F6" />
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Lộ trình hôm nay</Text>
                                        <Text className="text-slate-900 font-black text-sm">Giao {run.orders?.length || 0} điểm dừng</Text>
                                    </View>
                                </View>
                                <View className="bg-slate-100 px-2 py-1 rounded-lg">
                                    <Text className="text-slate-600 font-bold text-[10px] uppercase">Cần giao</Text>
                                </View>
                            </View>

                            <Divider/>

                            <DeliveryRunActionButtons
                                status={run.status}
                                isAdminOrSup={isAdminOrSup}
                                isShipper={isShipper}
                                isAllOrdersProcessed={run.orders?.every((o: any) => o.status === 'completed' || o.status === 'cancelled')}
                                onStart={() => setStartModalVisible(true)}
                                onComplete={handleCompleteTrip}
                                onCancel={handleCancelTrip}
                            />
                        </View>
                    }
                    ListEmptyComponent={
                        <View className="py-20 items-center">
                            <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
                            <Text className="text-slate-400 mt-2 font-medium">Không có đơn hàng nào</Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3B82F6"]} />
                    }
                />
            </BottomSheet>

            <StartTripModal
                visible={startModalVisible}
                onClose={() => setStartModalVisible(false)}
                onConfirm={handleStartTrip}
                isLoading={isStarting}
            />

            <ConfirmDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                onConfirm={dialogConfig.onConfirm || (() => setDialogVisible(false))}
                title={dialogConfig.title}
                content={dialogConfig.content}
                isDanger={dialogConfig.isDanger}
                showCancel={dialogConfig.showCancel}
                confirmLabel="Đồng ý"
                isLoading={(dialogConfig as any).isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    metaCard: {
        position: 'absolute',
        left: 0,
        right: 0,
    }
});
