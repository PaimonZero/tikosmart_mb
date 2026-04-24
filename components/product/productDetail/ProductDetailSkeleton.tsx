import React from 'react';
import { ScrollView, View } from 'react-native';

export const ProductDetailSkeleton: React.FC = () => {
    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Image Skeleton */}
            <View className="bg-white">
                <View className="w-full h-80 bg-gray-200 animate-pulse" />
            </View>

            {/* Basic Info Skeleton */}
            <View className="bg-white mt-2 px-6 py-5">
                <View className="h-8 bg-gray-200 rounded-lg w-3/4 mb-3 animate-pulse" />
                <View className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                <View className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </View>

            {/* Pricing Skeleton */}
            <View className="bg-white mt-2 px-6 py-5">
                <View className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
                <View className="space-y-3">
                    <View className="flex-row justify-between py-2">
                        <View className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                        <View className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </View>
                    <View className="flex-row justify-between py-2">
                        <View className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                        <View className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </View>
                </View>
            </View>

            {/* Inventory Skeleton */}
            <View className="bg-white mt-2 px-6 py-5">
                <View className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
                <View className="space-y-3">
                    <View className="flex-row justify-between py-2">
                        <View className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                        <View className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
                    </View>
                </View>
            </View>

            {/* Description Skeleton */}
            <View className="bg-white mt-2 px-6 py-5">
                <View className="h-6 bg-gray-200 rounded w-1/4 mb-3 animate-pulse" />
                <View className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                <View className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse" />
                <View className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
            </View>

            <View className="h-6" />
        </ScrollView>
    );
};
