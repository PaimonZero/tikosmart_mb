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

// ── Full skeleton screen ──────────────────────────────────────────────────────
export const SalesOrderDetailSkeleton = () => {
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

    const s = shimmer; // alias

    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={["top"]}>
            {/* ── Header ────────────────────────────────────────────── */}
            <View className="bg-gray-200 px-4 py-3 flex-row items-center" style={{ paddingBottom: 14 }}>
                {/* Back icon placeholder */}
                <SkeletonBox width={28} height={28} radius={14} opacity={s} />
                <View style={{ width: 12 }} />
                {/* Order number */}
                <SkeletonBox width="45%" height={20} radius={6} opacity={s} />
                <View style={{ flex: 1 }} />
                {/* Status badge */}
                <SkeletonBox width={100} height={30} radius={20} opacity={s} />
            </View>

            {/* ── Tab Bar ───────────────────────────────────────────── */}
            <View className="bg-white flex-row" style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 12 }}>
                {["40%", "35%", "30%"].map((w, i) => (
                    <SkeletonBox key={i} width={w as `${number}%`} height={32} radius={8} opacity={s} />
                ))}
            </View>

            {/* ── Customer Card ─────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-4 rounded-2xl overflow-hidden"
                style={{ elevation: 2 }}
            >
                {/* Row 1 – avatar + name */}
                <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                    <SkeletonBox width={40} height={40} radius={20} opacity={s} />
                    <View style={{ marginLeft: 12, gap: 6 }}>
                        <SkeletonBox width={140} height={14} opacity={s} />
                        <SkeletonBox width={70} height={10} opacity={s} />
                    </View>
                </View>
                {/* Row 2 – phone */}
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                    <View className="flex-row items-center">
                        <SkeletonBox width={40} height={40} radius={20} opacity={s} />
                        <View style={{ marginLeft: 12, gap: 6 }}>
                            <SkeletonBox width={110} height={14} opacity={s} />
                            <SkeletonBox width={70} height={10} opacity={s} />
                        </View>
                    </View>
                    <SkeletonBox width={72} height={32} radius={12} opacity={s} />
                </View>
                {/* Row 3 – address */}
                <View className="flex-row items-center px-4 py-3">
                    <SkeletonBox width={40} height={40} radius={20} opacity={s} />
                    <View style={{ marginLeft: 12, gap: 6 }}>
                        <SkeletonBox width={180} height={14} opacity={s} />
                        <SkeletonBox width={100} height={10} opacity={s} />
                    </View>
                </View>
            </View>

            {/* ── Order Info ────────────────────────────────────────── */}
            <View className="mx-4 mt-4">
                <SkeletonBox width={120} height={12} radius={4} opacity={s} />
                <View
                    className="bg-white rounded-2xl px-4 mt-2"
                    style={{ elevation: 2 }}
                >
                    {[1, 2, 3].map((_, i) => (
                        <View
                            key={i}
                            className="flex-row items-center justify-between py-3"
                            style={i < 2 ? { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" } : {}}
                        >
                            <SkeletonBox width={100} height={13} opacity={s} />
                            <SkeletonBox width={90} height={13} opacity={s} />
                        </View>
                    ))}
                </View>
            </View>

            {/* ── Products Preview ──────────────────────────────────── */}
            <View className="mx-4 mt-4">
                <SkeletonBox width={100} height={12} radius={4} opacity={s} />
                <View
                    className="bg-white rounded-2xl px-4 mt-2"
                    style={{ elevation: 2 }}
                >
                    {[1, 2].map((_, i) => (
                        <View
                            key={i}
                            className="flex-row items-center py-3"
                            style={i === 0 ? { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" } : {}}
                        >
                            <SkeletonBox width={44} height={44} radius={10} opacity={s} />
                            <View style={{ marginLeft: 12, gap: 6, flex: 1 }}>
                                <SkeletonBox width="70%" height={13} opacity={s} />
                                <SkeletonBox width="40%" height={10} opacity={s} />
                            </View>
                            <SkeletonBox width={48} height={13} opacity={s} />
                        </View>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};
