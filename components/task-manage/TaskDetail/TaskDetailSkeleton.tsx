import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Skeleton from "@/components/common/Skeleton";

export default function TaskDetailSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center border-b border-gray-200 bg-white">
        <Skeleton className="h-7 w-7 rounded-full" />
        <View className="ml-3 flex-row items-center flex-1">
          <Skeleton className="h-5 w-32 rounded" />
          <View className="ml-2">
            <Skeleton className="h-6 w-20 rounded" />
          </View>
        </View>
        <Skeleton className="h-7 w-20 rounded-full" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Timeline */}
        <View className="px-4 pt-4">
          <Skeleton className="h-4 w-28 rounded mb-3" />
          <View className="bg-white rounded-2xl p-4">
            {[1, 2, 3].map((key) => (
              <View key={key} className="flex-row items-center mb-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <View className="ml-3 flex-1">
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded mt-2" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Info cards */}
        <View className="px-4 pt-4">
          <Skeleton className="h-4 w-32 rounded mb-3" />
          <View className="bg-white rounded-2xl p-4">
            {[1, 2, 3].map((key) => (
              <View key={key} className="flex-row justify-between mb-3">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </View>
            ))}
          </View>
        </View>

        {/* Product list */}
        <View className="px-4 pt-4">
          <Skeleton className="h-4 w-36 rounded mb-3" />
          <View className="bg-white rounded-2xl p-4">
            {[1, 2, 3].map((key) => (
              <View key={key} className="flex-row items-center mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <View className="ml-3 flex-1">
                  <Skeleton className="h-4 w-2/3 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded mt-2" />
                </View>
                <Skeleton className="h-4 w-12 rounded" />
              </View>
            ))}
          </View>
        </View>

        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}
