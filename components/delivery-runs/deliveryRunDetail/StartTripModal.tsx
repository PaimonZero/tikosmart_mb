import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StartTripModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (data: { vehicle_type: 'motorcycle' | 'car'; avoid_toll: boolean }) => void;
    isLoading: boolean;
}

// Utility to handle clsx-like behavior in NativeWind
function clsx(...args: any[]) {
    return args.filter(Boolean).join(' ');
}

export const StartTripModal = ({ visible, onClose, onConfirm, isLoading }: StartTripModalProps) => {
    const [vehicleType, setVehicleType] = useState<'motorcycle' | 'car'>('motorcycle');
    const [avoidToll, setAvoidToll] = useState(false);

    const handleConfirm = () => {
        onConfirm({ vehicle_type: vehicleType, avoid_toll: avoidToll });
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 bg-black/60 justify-end">
                <View className="bg-white rounded-t-[40px] p-8 pb-10">
                    <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center mb-8" />
                    
                    <View className="flex-row items-center mb-6">
                        <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mr-4">
                            <Ionicons name="car-sport" size={24} color="#3B82F6" />
                        </View>
                        <View>
                            <Text className="text-2xl font-black text-slate-900">Bắt đầu chuyến</Text>
                            <Text className="text-slate-500 text-sm">Chọn phương tiện di chuyển của bạn</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-4 mb-8">
                        <TouchableOpacity 
                            onPress={() => setVehicleType('motorcycle')}
                            disabled={isLoading}
                            className={clsx(
                                "flex-1 p-5 rounded-3xl border-2 items-center",
                                vehicleType === 'motorcycle' ? "bg-blue-50 border-blue-500" : "bg-white border-slate-100"
                            )}
                        >
                            <Text className="text-3xl mb-2">🏍️</Text>
                            <Text className={clsx("font-bold text-sm", vehicleType === 'motorcycle' ? "text-blue-600" : "text-slate-500")}>Xe máy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => setVehicleType('car')}
                            disabled={isLoading}
                            className={clsx(
                                "flex-1 p-5 rounded-3xl border-2 items-center",
                                vehicleType === 'car' ? "bg-blue-50 border-blue-500" : "bg-white border-slate-100"
                            )}
                        >
                            <Text className="text-3xl mb-2">🚗</Text>
                            <Text className={clsx("font-bold text-sm", vehicleType === 'car' ? "text-blue-600" : "text-slate-500")}>Ô tô</Text>
                        </TouchableOpacity>
                    </View>

                    {vehicleType === 'car' && (
                        <TouchableOpacity 
                            onPress={() => setAvoidToll(!avoidToll)}
                            disabled={isLoading}
                            className="flex-row items-center mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100"
                        >
                            <View className={clsx(
                                "w-6 h-6 rounded-md border-2 items-center justify-center mr-3",
                                avoidToll ? "bg-blue-500 border-blue-500" : "bg-white border-slate-300"
                            )}>
                                {avoidToll && <Ionicons name="checkmark" size={16} color="white" />}
                            </View>
                            <Text className="text-slate-700 font-bold">Tránh đường thu phí</Text>
                        </TouchableOpacity>
                    )}

                    <View className="flex-row gap-4">
                        <TouchableOpacity 
                            onPress={onClose}
                            disabled={isLoading}
                            className="flex-1 bg-slate-100 py-4 rounded-2xl items-center"
                        >
                            <Text className="text-slate-600 font-black">Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleConfirm}
                            disabled={isLoading}
                            className="flex-[2] bg-blue-600 py-4 rounded-2xl items-center shadow-lg shadow-blue-200"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-black">Xác nhận đơn</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
