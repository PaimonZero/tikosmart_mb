import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Skeleton from "@/components/common/Skeleton";

export default function TaskDetailSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center border-b border-gray-200 bg-white z-10">
        <Skeleton className="h-8 w-8 rounded-full" />
        <View className="ml-2 flex-1 flex-row items-center">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-6 w-20 rounded ml-2" />
        </View>
        <Skeleton className="h-7 w-24 rounded-full" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Timeline Section (Horizontal) */}
        <View className="bg-white py-2 mt-2 border-y border-gray-100 shadow-sm">
            <View className="flex-row items-center px-5 mb-6">
                <Skeleton className="h-8 w-8 rounded-lg mr-2.5" />
                <Skeleton className="h-5 w-24 rounded" />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[1, 2, 3, 4].map((key) => (
                    <View key={key} className="items-center" style={{ width: 130 }}>
                        <View className="flex-row items-center w-full mb-3">
                            <View className="flex-1 h-[3px] bg-gray-100 rounded-full" />
                            <Skeleton className="w-9 h-9 rounded-full" />
                            <View className="flex-1 h-[3px] bg-gray-100 rounded-full" />
                        </View>
                        <View className="items-center">
                            <Skeleton className="h-3 w-20 rounded mb-1.5" />
                            <Skeleton className="h-2.5 w-12 rounded" />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>

        {/* Info Cards Section */}
        <View className="pt-4">
           {/* Card 1 */}
          <View className="mx-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
             <View className="flex-row items-center justify-between p-5">
                <View className="flex-row items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-32 rounded ml-3" />
                </View>
                <Skeleton className="h-5 w-5 rounded" />
             </View>
          </View>
          {/* Card 2 */}
          <View className="mx-4 mb-3 bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
             <View className="flex-row items-center justify-between p-5">
                <View className="flex-row items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-5 w-32 rounded ml-3" />
                </View>
                <Skeleton className="h-5 w-5 rounded" />
             </View>
          </View>
        </View>

        {/* Product List Section */}
        <View className="px-4 pt-2">
          <Skeleton className="h-4 w-36 rounded mb-4" />
          {[1, 2].map((key) => (
            <View key={key} className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-4">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                    <View className="ml-4 flex-1">
                        <Skeleton className="h-5 w-3/4 rounded" />
                        <Skeleton className="h-3 w-1/4 rounded mt-2" />
                    </View>
                </View>
                <View className="flex-row bg-gray-50 rounded-xl p-4">
                    <View className="flex-1 items-center border-r border-gray-200">
                        <Skeleton className="h-3 w-12 rounded mb-2" />
                        <Skeleton className="h-6 w-8 rounded" />
                    </View>
                    <View className="flex-1 items-center">
                        <Skeleton className="h-3 w-12 rounded mb-2" />
                        <Skeleton className="h-6 w-8 rounded" />
                    </View>
                </View>
            </View>
          ))}
        </View>

        <View className="h-44" />
      </ScrollView>

      {/* Floating Action Bar Skeleton */}
      <View className="absolute bottom-4 left-0 right-0 px-4 pb-4">
          <View className="bg-white rounded-3xl p-4 shadow-2xl border border-gray-100">
              <Skeleton className="h-14 w-full rounded-2xl" />
          </View>
      </View>
    </SafeAreaView>
  );
}
