import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Primitive skeleton block with shimmer animation ──────────────────────────
const SkeletonBox = ({
    width,
    height,
    radius = 8,
    opacity,
}: {
    width: number | `${number}%`;
    height: number;
    radius?: number;
    opacity: Animated.Value;
}) => (
    <Animated.View
        style={{
            width,
            height,
            borderRadius: radius,
            backgroundColor: "#E5E7EB",
            opacity,
        }}
    />
);

export const SalesOrderInvoiceSkeleton = () => {
    const shimmer = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmer, {
                    toValue: 0.4,
                    duration: 750,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [shimmer]);

    const s = shimmer;

    return (
        <SafeAreaView className="flex-1" edges={["bottom"]}>
            {/* ── Card 1: Invoice Header ─────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-4 rounded-2xl px-4 py-4"
                style={{ elevation: 2, gap: 16 }}
            >
                <View className="flex-row items-center justify-between">
                    <View style={{ gap: 8 }}>
                        <SkeletonBox width={120} height={12} opacity={s} />
                        <SkeletonBox width={80} height={20} opacity={s} />
                    </View>
                    <SkeletonBox width={90} height={28} radius={14} opacity={s} />
                </View>
                <View className="flex-row" style={{ gap: 20 }}>
                    <View style={{ gap: 6 }}>
                        <SkeletonBox width={60} height={12} opacity={s} />
                        <SkeletonBox width={90} height={16} opacity={s} />
                    </View>
                    <View style={{ gap: 6 }}>
                        <SkeletonBox width={60} height={12} opacity={s} />
                        <SkeletonBox width={90} height={16} opacity={s} />
                    </View>
                </View>
            </View>

            {/* ── Card 2: Parties ────────────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-3 rounded-2xl overflow-hidden"
                style={{ elevation: 2 }}
            >
                <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                    <SkeletonBox width={36} height={36} radius={18} opacity={s} />
                    <View className="ml-3" style={{ gap: 6 }}>
                        <SkeletonBox width={60} height={12} opacity={s} />
                        <SkeletonBox width={140} height={16} opacity={s} />
                    </View>
                </View>
                <View className="flex-row items-center px-4 py-3">
                    <SkeletonBox width={36} height={36} radius={18} opacity={s} />
                    <View className="ml-3" style={{ gap: 6 }}>
                        <SkeletonBox width={80} height={12} opacity={s} />
                        <SkeletonBox width={130} height={16} opacity={s} />
                        <SkeletonBox width={100} height={12} opacity={s} />
                    </View>
                </View>
            </View>

            {/* ── Card 3: Products ───────────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-3 rounded-2xl px-4 py-4"
                style={{ elevation: 2 }}
            >
                <SkeletonBox width={160} height={14} opacity={s} />
                <View className="mt-4 flex-row py-3" style={{ gap: 12 }}>
                    <SkeletonBox width={64} height={64} radius={10} opacity={s} />
                    <View className="flex-1" style={{ gap: 8 }}>
                        <SkeletonBox width="80%" height={16} opacity={s} />
                        <SkeletonBox width="60%" height={14} opacity={s} />
                        <SkeletonBox width="40%" height={16} opacity={s} />
                    </View>
                </View>
            </View>

            {/* ── Card 4: Totals ─────────────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-3 rounded-2xl px-4 py-4"
                style={{ elevation: 2, gap: 12 }}
            >
                <SkeletonBox width={80} height={14} opacity={s} />
                {[1, 2, 3, 4].map((_, i) => (
                    <View key={i} className="flex-row justify-between items-center">
                        <SkeletonBox width={100} height={14} opacity={s} />
                        <SkeletonBox width={80} height={14} opacity={s} />
                    </View>
                ))}
                <View className="border-t border-gray-100 my-1" />
                <View className="flex-row justify-between items-center">
                    <SkeletonBox width={90} height={18} opacity={s} />
                    <SkeletonBox width={110} height={18} opacity={s} />
                </View>
            </View>
        </SafeAreaView>
    );
};
