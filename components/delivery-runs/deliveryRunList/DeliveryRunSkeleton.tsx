import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const DeliveryRunSkeleton = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [opacity]);

    return (
        <View className="bg-white rounded-3xl mb-4 p-5 shadow-sm border border-slate-100">
            {/* Header Skeleton */}
            <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center flex-1">
                    <Animated.View 
                        style={{ opacity }}
                        className="bg-gray-200 rounded-full w-10 h-10 mr-3" 
                    />
                    <View className="flex-1">
                        <Animated.View 
                            style={{ opacity }}
                            className="bg-gray-200 h-5 rounded-lg w-3/4 mb-2" 
                        />
                        <Animated.View 
                            style={{ opacity }}
                            className="bg-gray-100 h-3 rounded-md w-1/2" 
                        />
                    </View>
                </View>
                <Animated.View 
                    style={{ opacity }}
                    className="bg-gray-100 h-6 rounded-xl w-20" 
                />
            </View>

            {/* Grid Skeleton */}
            <View className="bg-slate-50 rounded-2xl p-4 mb-4 flex-row">
                <View className="flex-1 border-r border-slate-100 pr-4">
                    <Animated.View 
                        style={{ opacity }}
                        className="bg-gray-100 h-3 rounded-md w-1/2 mb-2" 
                    />
                    <Animated.View 
                        style={{ opacity }}
                        className="bg-gray-200 h-5 rounded-lg w-3/4" 
                    />
                </View>
                <View className="flex-1 pl-4">
                    <Animated.View 
                        style={{ opacity }}
                        className="bg-gray-100 h-3 rounded-md w-1/2 mb-2" 
                    />
                    <Animated.View 
                        style={{ opacity }}
                        className="bg-gray-200 h-5 rounded-lg w-3/4" 
                    />
                </View>
            </View>

            {/* Footer Skeleton */}
            <View className="flex-row items-center pt-2">
                <Animated.View 
                    style={{ opacity }}
                    className="bg-gray-200 h-4 rounded-md w-2/3" 
                />
            </View>
        </View>
    );
};
