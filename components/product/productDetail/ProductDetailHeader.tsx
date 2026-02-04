import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Animated, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';

interface ProductDetailHeaderProps {
    scrollY: Animated.Value;
    productName?: string;
    canEdit?: boolean;
    onEdit?: () => void;
}

export const ProductDetailHeader: React.FC<ProductDetailHeaderProps> = ({
    scrollY,
    productName,
    canEdit,
    onEdit,
}) => {
    // Header background opacity based on scroll
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // Icon background opacity - for semi-transparent background
    const iconBgOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    // Product name opacity
    const titleOpacity = scrollY.interpolate({
        inputRange: [0, 100, 200],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp',
    });

    // Animated background color for icons
    const animatedIconBg = useMemo(() => ({
        backgroundColor: iconBgOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.4)'],
        }),
    }), [iconBgOpacity]);

    // Icon color based on scroll - white when at top, dark when scrolled
    const iconColorStyle = useMemo(() => ({
        color: scrollY.interpolate({
            inputRange: [0, 200],
            outputRange: ['rgb(255, 255, 255)', 'rgb(31, 41, 55)'], // white to gray-900
        }),
    }), [scrollY]);

    return (
        <>
            {/* Animated Header Background */}
            <Animated.View
                style={{
                    opacity: headerOpacity,
                }}
                className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-100"
                pointerEvents="none"
            >
                <View
                    style={{
                        height: Platform.OS === 'ios' ? 88 : 56 + (StatusBar.currentHeight || 0),
                    }}
                />
            </Animated.View>

            {/* Header Content */}
            <View
                className="absolute top-0 left-0 right-0 z-20 flex-row items-center justify-between px-4"
                style={{
                    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
                    height: Platform.OS === 'ios' ? 88 : 56 + (StatusBar.currentHeight || 0),
                }}
            >
                {/* Left: Back Button */}
                <View className="flex-1 flex-row items-center">
                    <Animated.View
                        style={animatedIconBg}
                        className="w-11 h-11 rounded-full items-center justify-center"
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-11 h-11 items-center justify-center"
                            activeOpacity={0.7}
                        >
                            <Animated.Text style={iconColorStyle}>
                                <Feather name="arrow-left" size={23} />
                            </Animated.Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Product Name - appears when scrolling */}
                    {productName && (
                        <Animated.View
                            style={{
                                opacity: titleOpacity,
                                marginLeft: 12,
                                flex: 1,
                            }}
                        >
                            <Text
                                className="text-xl font-bold text-gray-900"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {productName}
                            </Text>
                        </Animated.View>
                    )}
                </View>

                {/* Right: Action Buttons */}
                <View className="flex-row items-center gap-2">


                    {/* Edit Button (if permitted) */}
                    {canEdit && onEdit && (
                        <Animated.View
                            style={animatedIconBg}
                            className="w-11 h-11 rounded-full items-center justify-center"
                        >
                            <TouchableOpacity
                                onPress={onEdit}
                                className="w-11 h-11 items-center justify-center"
                                activeOpacity={0.7}
                            >
                                <Animated.Text style={iconColorStyle}>
                                    <Feather name="edit-2" size={20} />
                                </Animated.Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                </View>
            </View>
        </>
    );
};
