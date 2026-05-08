import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';
import { LinearGradient } from 'expo-linear-gradient';

interface QrPaymentModalProps {
    visible: boolean;
    onClose: () => void;
    orderNo: string;
    amount: number;
}

export const QrPaymentModal = ({ visible, onClose, orderNo, amount }: QrPaymentModalProps) => {
    const bankAccount = process.env.EXPO_PUBLIC_BANK_ACCOUNT || '';
    const bankAccountName = process.env.EXPO_PUBLIC_BANK_ACCOUNT_NAME || '';
    const bank = process.env.EXPO_PUBLIC_BANK || '';
    const bankName = process.env.EXPO_PUBLIC_BANK_NAME || '';
    const bankIcon = process.env.EXPO_PUBLIC_BANK_ICON_URL || '';
    const contentBase = process.env.EXPO_PUBLIC_CONTENT_BASE || 'THANH TOAN HOA DON';

    const formattedCode = orderNo ? orderNo.replace(/-/g, '') : '';
    const description = `${formattedCode} ${contentBase}`;
    const qrUrl = `https://qr.sepay.vn/img?acc=${bankAccount}&bank=${bank}&amount=${amount}&des=${encodeURIComponent(description)}&template=compact`;

    const handleCopy = (text: string, label: string) => {
        try {
            const { Clipboard } = require('react-native');
            Clipboard.setString(text);
            toast.success(`Đã sao chép ${label}`);
        } catch (e) {
            toast.error("Không thể sao chép");
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/70 items-center justify-center p-4">
                <TouchableWithoutFeedback onPress={onClose}>
                    <View className="absolute inset-0" />
                </TouchableWithoutFeedback>

                <View className="bg-white w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                        {/* Header Gradient */}
                        <LinearGradient
                            colors={['#1E293B', '#0F172A']}
                            className="p-8 pb-10"
                        >
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1 mr-4">
                                    <View className="flex-row items-center mb-2">
                                        <Text className="text-blue-400 text-[10px] font-black uppercase tracking-[2px]">Secured Payment</Text>
                                        <View className="w-1 h-1 rounded-full bg-blue-400 mx-2" />
                                        <MaterialCommunityIcons name="shield-check" size={14} color="#60A5FA" />
                                    </View>
                                    <Text className="text-white text-2xl font-black leading-tight">Quét mã QR{"\n"}Thanh toán</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    activeOpacity={0.7} className="bg-white/10 w-10 h-10 rounded-2xl items-center justify-center border border-white/20"
                                >
                                    <Ionicons name="close" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Floating Bank Badge */}
                            <View className="mt-8 bg-white/10 border border-white/10 rounded-2xl p-4 flex-row items-center">
                                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-lg">
                                    <Image source={{ uri: bankIcon }} className="w-6 h-6 rounded-md" />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">Ngân hàng thụ hưởng</Text>
                                    <Text className="text-white font-bold text-sm" numberOfLines={1}>{bankName}</Text>
                                </View>
                            </View>
                        </LinearGradient>

                        <View className="p-6 -mt-6 bg-white rounded-t-[40px]">
                            {/* Amount Section */}
                            <View className="items-center mb-8">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mb-2">Tổng tiền cần thanh toán</Text>
                                <View className="flex-row items-baseline">
                                    <Text className="text-slate-900 text-4xl font-black">{amount?.toLocaleString('vi-VN')}</Text>
                                    <Text className="text-slate-400 text-lg font-bold ml-1">đ</Text>
                                </View>
                            </View>

                            {/* QR Canvas */}
                            <View className="bg-slate-50 rounded-[32px] p-6 items-center border border-slate-100 shadow-inner mb-8">
                                <View className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                                    <Image
                                        source={{ uri: qrUrl }}
                                        className="w-56 h-56"
                                        resizeMode="contain"
                                    />
                                </View>
                                <View className="mt-4 flex-row items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                    <MaterialCommunityIcons name="camera-iris" size={16} color="#3B82F6" />
                                    <Text className="text-blue-600 text-[11px] ml-2 font-bold italic">Mở Mobile Banking để quét mã ngay</Text>
                                </View>
                            </View>

                            {/* Account Info Cards */}
                            <View className="space-y-3 gap-y-3">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] px-2 mb-1">Thông tin chuyển khoản</Text>

                                <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-row justify-between items-center">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-slate-400 text-[9px] font-bold uppercase mb-1">Số tài khoản</Text>
                                        <Text className="text-slate-900 font-black text-base">{bankAccount}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleCopy(bankAccount, "số tài khoản")}
                                        activeOpacity={0.7} className="bg-blue-600 w-10 h-10 rounded-xl items-center justify-center shadow-lg"
                                    >
                                        <Feather name="copy" size={18} color="white" />
                                    </TouchableOpacity>
                                </View>

                                <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-row justify-between items-center">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-slate-400 text-[9px] font-bold uppercase mb-1">Chủ tài khoản</Text>
                                        <Text className="text-slate-900 font-bold text-sm uppercase">{bankAccountName}</Text>
                                    </View>
                                    <View className="bg-green-100 px-2 py-1 rounded-md">
                                        <Feather name="check-circle" size={12} color="#10B981" />
                                    </View>
                                </View>

                                <View className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-row justify-between items-center">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-slate-400 text-[9px] font-bold uppercase mb-1">Nội dung</Text>
                                        <Text className="text-slate-900 font-bold text-sm" numberOfLines={1}>{description}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleCopy(description, "nội dung")}
                                        activeOpacity={0.7} className="bg-slate-200 w-10 h-10 rounded-xl items-center justify-center"
                                    >
                                        <Feather name="copy" size={18} color="#1E293B" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={onClose}
                                activeOpacity={0.9} className="mt-10 mb-2 py-4 bg-slate-900 rounded-2xl items-center shadow-xl"
                            >
                                <Text className="text-white font-black uppercase tracking-widest text-sm">Xác nhận đã nhận tiền</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};
