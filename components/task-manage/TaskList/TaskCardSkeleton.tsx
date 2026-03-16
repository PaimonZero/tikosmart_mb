import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export default function TaskCardSkeleton() {
    const fadeAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View
            style={{ opacity: fadeAnim }}
            className="bg-white rounded-xl shadow-sm p-4 mb-3 mx-4 border border-gray-100"
        >
            {/* Header Row Skeleton */}
            <View className="flex-row justify-between items-center mb-2">
                <View className="bg-gray-200 h-6 w-20 rounded" />
                <View className="bg-gray-200 h-6 w-24 rounded-full" />
            </View>

            {/* Main Order Info Skeleton */}
            <View className="mb-3">
                <View className="bg-gray-200 h-5 w-48 rounded mb-1" />
                <View className="bg-gray-200 h-4 w-32 rounded" />
            </View>

            {/* Info Details Stack Skeleton */}
            <View className="space-y-2 mb-2">
                <View className="flex-row items-center">
                    <View className="bg-gray-200 h-4 w-4 rounded-full" />
                    <View className="bg-gray-200 h-4 w-36 rounded ml-2" />
                </View>
                <View className="flex-row items-center">
                    <View className="bg-gray-200 h-4 w-4 rounded-full" />
                    <View className="bg-gray-200 h-4 w-40 rounded ml-2" />
                </View>
                <View className="flex-row items-center">
                    <View className="bg-gray-200 h-4 w-4 rounded-full" />
                    <View className="bg-gray-200 h-4 w-32 rounded ml-2" />
                </View>
            </View>

            {/* Note Skeleton */}
            <View className="mt-1">
                <View className="bg-gray-200 h-3 w-full rounded mb-1" />
                <View className="bg-gray-200 h-3 w-4/5 rounded" />
            </View>
        </Animated.View>
    );
}
