import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface ProductCardSkeletonProps {
    count?: number;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ count = 5 }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const SkeletonCard = () => (
        <View className="bg-white rounded-2xl mb-3 shadow-sm border border-gray-100 overflow-hidden flex-row items-center p-3">
            {/* Image Skeleton */}
            <Animated.View
                style={{ opacity }}
                className="w-20 h-20 bg-gray-200 rounded-xl"
            />

            {/* Content Skeleton */}
            <View className="flex-1 ml-3">
                {/* Title */}
                <Animated.View
                    style={{ opacity }}
                    className="h-4 bg-gray-200 rounded w-3/4 mb-2"
                />

                {/* Category */}
                <Animated.View
                    style={{ opacity }}
                    className="h-3 bg-gray-200 rounded w-1/2 mb-2"
                />

                {/* Price & Stock */}
                <View className="flex-row items-center justify-between">
                    <Animated.View
                        style={{ opacity }}
                        className="h-4 bg-gray-200 rounded w-1/3"
                    />
                    <Animated.View
                        style={{ opacity }}
                        className="h-3 bg-gray-200 rounded w-1/4"
                    />
                </View>
            </View>

            {/* Edit Icon Skeleton */}
            <View className="ml-2 pl-2 border-l border-gray-100 justify-center h-12">
                <Animated.View
                    style={{ opacity }}
                    className="w-5 h-5 bg-gray-200 rounded-full"
                />
            </View>
        </View>
    );

    return (
        <View className="p-4">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </View>
    );
};
