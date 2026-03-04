import { ChevronRight, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Modal, PanResponder, Text, TouchableOpacity, View } from 'react-native';

interface SwipeToConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle?: string;
}

export default function SwipeToConfirmModal({ visible, onClose, onConfirm, taskTitle }: SwipeToConfirmModalProps) {
    const [confirmed, setConfirmed] = useState(false);
    const pan = useRef(new Animated.ValueXY()).current;

    // Total width of slider track roughly 250, thumb is 50. Max drift is 200.
    const SWIPE_MAX = 200;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: pan.x }], {
                useNativeDriver: false, // dx cannot use native driver directly without node tricks in some versions, but fine for simple RN
            }),
            onPanResponderRelease: (e, gesture) => {
                if (gesture.dx > SWIPE_MAX * 0.8) {
                    // Trigger confirm
                    Animated.spring(pan, {
                        toValue: { x: SWIPE_MAX, y: 0 },
                        useNativeDriver: true,
                    }).start(() => {
                        setConfirmed(true);
                        setTimeout(() => {
                            onConfirm();
                            resetSlider();
                        }, 300);
                    });
                } else {
                    // Reset
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const resetSlider = () => {
        setConfirmed(false);
        pan.setValue({ x: 0, y: 0 });
    };

    const handleClose = () => {
        resetSlider();
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose}>
            <View className="flex-1 bg-black/50 justify-center items-center px-4">
                <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-gray-900">Xác nhận huỷ</Text>
                        <TouchableOpacity onPress={handleClose} className="p-1">
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <Text className="text-base text-gray-600 mb-6 leading-6">
                        Bạn có chắc chắn muốn huỷ nhiệm vụ {taskTitle ? <Text className="font-bold text-gray-900">#{taskTitle}</Text> : 'này'} không?
                        Hành động này không thể hoàn tác.
                    </Text>

                    {/* Swipe Button Wrapper */}
                    <View className="h-14 bg-red-50 rounded-full border border-red-200 justify-center overflow-hidden">
                        <Text className="text-red-500 font-semibold absolute w-full text-center z-0">
                            {confirmed ? 'Đã xác nhận huỷ' : 'Vuốt sang phải để huỷ'}
                        </Text>

                        {!confirmed && (
                            <Animated.View
                                {...panResponder.panHandlers}
                                style={{
                                    transform: [
                                        {
                                            translateX: pan.x.interpolate({
                                                inputRange: [0, SWIPE_MAX],
                                                outputRange: [0, SWIPE_MAX],
                                                extrapolate: 'clamp',
                                            }),
                                        },
                                    ],
                                }}
                                className="w-14 h-14 bg-red-500 rounded-full justify-center items-center z-10 shadow-sm"
                            >
                                <ChevronRight size={24} color="white" />
                            </Animated.View>
                        )}
                    </View>

                    {/* Cancel button */}
                    <TouchableOpacity onPress={handleClose} className="mt-4 py-3">
                        <Text className="text-base text-gray-500 text-center font-medium">Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
