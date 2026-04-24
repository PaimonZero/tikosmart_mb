import Skeleton from "@/components/common/Skeleton";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditTaskSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header Skeleton */}
      <View className="px-4 py-3 flex-row items-center border-b border-gray-200 bg-white">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-5 w-40 rounded ml-4" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Info Card Skeleton */}
        <View className="m-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <View className="ml-3 flex-1">
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-5 w-2/3 rounded mt-2" />
            </View>
          </View>

          {[1, 2, 3].map((key) => (
            <View key={key} className="mb-5">
              <Skeleton className="h-3 w-24 rounded mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </View>
          ))}
          
          <Skeleton className="h-3 w-20 rounded mb-2" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </View>

        {/* Product Section Header */}
        <View className="px-4 mb-3 flex-row justify-between items-end">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </View>

        {/* Product List Skeleton */}
        {[1, 2].map((key) => (
          <View key={key} className="bg-white mb-2 mx-2 rounded-xl border border-gray-200 shadow-sm p-4">
             <View className="flex-row items-center mb-4 border-b border-gray-50 pb-3">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <View className="ml-3 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/4 rounded mt-2" />
                </View>
                <Skeleton className="h-10 w-12 rounded-lg" />
             </View>
             
             <View className="gap-y-4">
                <View>
                    <Skeleton className="h-3 w-16 rounded mb-2" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </View>
                <View>
                    <Skeleton className="h-3 w-24 rounded mb-2" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </View>
             </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer Skeleton */}
      <View className="bg-white border-t border-gray-200 p-4 pb-8 shadow-lg">
        <Skeleton className="h-14 w-full rounded-xl" />
      </View>
    </SafeAreaView>
  );
}
