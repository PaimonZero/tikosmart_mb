import { uploadImage } from '@/services/uploadImageService';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ImageView from "react-native-image-viewing";
import { toast } from 'sonner-native';
import { QrPaymentModal } from './QrPaymentModal';

interface OrderActionModalProps {
    visible: boolean;
    type: 'complete' | 'cancel' | null;
    userRole: string | null;
    order: any;
    voicePrefill?: {
        amount?: number;
        note?: string;
        openQR?: boolean;
        nonce?: string;
    } | null;
    onClose: () => void;
    onSubmit: (data: { actualPay?: number; note?: string; evdUrl?: string }) => Promise<void>;
}

// Utility to handle clsx-like behavior in NativeWind
function clsx(...args: any[]) {
    return args.filter(Boolean).join(' ');
}

export const OrderActionModal = ({ visible, type, userRole, order, voicePrefill, onClose, onSubmit }: OrderActionModalProps) => {
    const [note, setNote] = useState('');
    const [actualPay, setActualPay] = useState('');
    const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [qrVisible, setQrVisible] = useState(false);
    const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
    const lastVoiceNonceRef = React.useRef<string | null>(null);

    const isLocked = order?.status === 'completed' || order?.status === 'cancelled';
    const isAuthorized = (type === 'complete' && (userRole === 'shipper' || userRole === 'sup_shipper')) ||
        (type === 'cancel' && userRole === 'admin');
    const isReadOnly = !isAuthorized || isLocked;

    // Reset state when modal opens or type changes
    useEffect(() => {
        if (visible && type) {
            setNote(order.note || '');
            
            // Auto fill actualPay: if complete modal and not already purposefully set, default to codAmount
            let initialPay = order.actualPay?.toString();
            if (type === 'complete' && (!initialPay || initialPay === '0')) {
                initialPay = order.codAmount?.toString() || '0';
            }
            setActualPay(initialPay || '0');

            setEvidenceImage(order.evdUrl || null);
            setIsSubmitting(false);
        }
    }, [visible, type, order]);

    useEffect(() => {
        if (!visible || !voicePrefill?.nonce) return;
        if (lastVoiceNonceRef.current === voicePrefill.nonce) return;

        lastVoiceNonceRef.current = voicePrefill.nonce;

        if (typeof voicePrefill.note === "string") {
            setNote(voicePrefill.note);
        }

        if (typeof voicePrefill.amount === "number" && Number.isFinite(voicePrefill.amount)) {
            setActualPay(String(voicePrefill.amount));
        }

        if (voicePrefill.openQR && type === "complete") {
            setQrVisible(true);
        }
    }, [type, visible, voicePrefill]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            toast.error("Cần quyền truy cập máy ảnh để chụp ảnh bằng chứng");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            quality: 0.7,
        });

        if (!result.canceled) {
            setEvidenceImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            let evdUrl = evidenceImage?.startsWith('http') ? evidenceImage : '';

            // 1. Upload evidence if complete and a new local image exists
            if (type === 'complete' && evidenceImage && !evidenceImage.startsWith('http')) {
                try {
                    const uploadResult = await uploadImage(evidenceImage);
                    evdUrl = uploadResult.url;
                } catch (uploadErr) {
                    console.error("Upload POD failed:", uploadErr);
                    toast.error("Không thể tải ảnh bằng chứng lên server");
                    setIsSubmitting(false);
                    return;
                }
            }

            // 2. Prepare data and submit
            const submitData: any = { note: note.trim() };
            if (type === 'complete') {
                const numericActualPay = parseFloat(actualPay) || 0;
                const codAmount = order?.codAmount || 0;
                
                if (numericActualPay > codAmount) {
                    toast.error(`Số tiền thực thu (${numericActualPay.toLocaleString()}đ) không được vượt quá số tiền COD (${codAmount.toLocaleString()}đ)`);
                    setIsSubmitting(false);
                    return;
                }

                submitData.actualPay = numericActualPay;
                if (evdUrl) submitData.evdUrl = evdUrl;
            }

            await onSubmit(submitData);
        } catch (err) {
            // Error handling is usually done in the parent via onSubmit or here
            console.error("Submit failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!type) return null;

    const handleOpenQr = () => {
        setActualPay('0'); // Sync with web: when opening QR, suggest cash collected is 0
        setQrVisible(true);
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/40 items-center justify-center px-4">
                <View className="bg-white w-full rounded-3xl p-6 shadow-xl">
                    <View className="flex-row items-center mb-6">
                        <View className={clsx("w-10 h-10 rounded-full items-center justify-center mr-3",
                            type === 'complete' ? "bg-green-100" : "bg-red-100"
                        )}>
                            <Feather
                                name={type === 'complete' ? 'check-circle' : 'alert-triangle'}
                                size={20}
                                color={type === 'complete' ? '#10B981' : '#EF4444'}
                            />
                        </View>
                        <View>
                            <Text className="text-xl font-bold text-slate-900">
                                {type === 'complete' ? 'Hoàn thành' : 'Giao thất bại'}
                            </Text>
                            {isReadOnly && (
                                <Text className="text-[10px] text-slate-400 font-medium italic">
                                    {isLocked ? "Đơn hàng đã khóa" : "Chỉ xem (không có quyền sửa)"}
                                </Text>
                            )}
                        </View>
                    </View>

                    {type === 'complete' && (
                        <View className="mb-4">
                            <Text className="text-slate-500 text-xs font-bold uppercase mb-2">Tiền thực thu (đ)</Text>
                            <View className="flex-row gap-2">
                                <TextInput
                                    value={actualPay}
                                    onChangeText={setActualPay}
                                    keyboardType="numeric"
                                    editable={!isSubmitting && !isReadOnly}
                                    className={clsx("flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-slate-900 font-bold",
                                        isReadOnly && "opacity-60"
                                    )}
                                />
                                {!isReadOnly && (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => setActualPay(order?.codAmount?.toString() || '0')}
                                            disabled={isSubmitting}
                                            className="bg-green-50 px-3 rounded-2xl items-center justify-center border border-green-100 active:opacity-70"
                                        >
                                            <Text className="text-green-600 font-bold text-[10px] uppercase">Thu đủ</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={handleOpenQr}
                                            className="bg-blue-600 w-14 rounded-2xl items-center justify-center shadow-sm active:opacity-80"
                                        >
                                            <Ionicons name="qr-code" size={24} color="white" />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    )}

                    <View className="mb-4">
                        <Text className="text-slate-500 text-xs font-bold uppercase mb-2">Ghi chú</Text>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            editable={!isSubmitting && !isReadOnly}
                            placeholder={isReadOnly ? "Không có ghi chú" : "Nhập lý do hoặc chi tiết..."}
                            multiline
                            numberOfLines={5}
                            className={clsx("bg-slate-50 rounded-2xl p-4 border border-slate-100 text-slate-900 h-40 text-top",
                                isReadOnly && "opacity-60"
                            )}
                            textAlignVertical="top"
                        />
                    </View>

                    {type === 'complete' && (
                        <View className="mb-6">
                            <Text className="text-slate-500 text-xs font-bold uppercase mb-3">Bằng chứng giao hàng (POD)</Text>
                            {evidenceImage ? (
                                <View className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200">
                                    <TouchableOpacity 
                                        activeOpacity={0.9} 
                                        onPress={() => setIsImageViewerVisible(true)}
                                        className="w-full h-full"
                                    >
                                        <Image source={{ uri: evidenceImage }} className="w-full h-full" />
                                    </TouchableOpacity>
                                    {!isSubmitting && !isReadOnly && (
                                        <TouchableOpacity
                                            onPress={() => setEvidenceImage(null)}
                                            className="absolute top-2 right-2 bg-black/50 w-8 h-8 rounded-full items-center justify-center"
                                        >
                                            <Ionicons name="close" size={20} color="white" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                !isReadOnly ? (
                                    <TouchableOpacity
                                        onPress={pickImage}
                                        disabled={isSubmitting}
                                        className="w-full aspect-video bg-blue-50 rounded-2xl items-center justify-center border border-dashed border-blue-200 active:bg-blue-100"
                                    >
                                        <View className="bg-blue-100 p-4 rounded-full mb-2">
                                            <Ionicons name="camera" size={32} color="#3B82F6" />
                                        </View>
                                        <Text className="text-blue-600 font-bold text-sm">Chụp ảnh bằng chứng</Text>
                                        <Text className="text-blue-400 text-[10px] mt-1">Sử dụng camera để xác nhận giao hàng</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View className="w-full aspect-video rounded-2xl bg-slate-50 items-center justify-center border border-slate-200 border-dashed">
                                        <Ionicons name="image-outline" size={32} color="#94A3B8" />
                                        <Text className="text-slate-400 text-xs mt-2 italic">Không có ảnh bằng chứng</Text>
                                    </View>
                                )
                            )}
                        </View>
                    )}

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            disabled={isSubmitting}
                            className={clsx("py-4 rounded-2xl items-center border",
                                isReadOnly ? "w-full bg-slate-800 border-slate-900" : "flex-1 bg-slate-100 border-slate-200"
                            )}
                        >
                            <Text className={clsx("font-black", isReadOnly ? "text-white" : "text-slate-600")}>
                                {isReadOnly ? "Đóng" : "Hủy"}
                            </Text>
                        </TouchableOpacity>
                        {!isReadOnly && (
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                                className={clsx("flex-1 py-4 rounded-2xl items-center shadow-sm",
                                    type === 'complete' ? "bg-green-500" : "bg-red-500"
                                )}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-black">Xác nhận</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <QrPaymentModal
                visible={qrVisible}
                onClose={() => setQrVisible(false)}
                orderNo={order?.orderNo}
                amount={Number(actualPay) || order?.codAmount || 0}
            />

            <ImageView
                images={evidenceImage ? [{ uri: evidenceImage }] : []}
                imageIndex={0}
                visible={isImageViewerVisible}
                onRequestClose={() => setIsImageViewerVisible(false)}
            />
        </Modal>
    );
};
