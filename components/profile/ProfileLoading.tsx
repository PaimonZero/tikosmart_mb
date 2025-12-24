import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Skeleton from '../common/Skeleton'

export default function ProfileLoading() {
    return (
        <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
            <View className="flex-1 px-4 pt-4">

                {/* 1. Header Area: Đơn giản 2 khối trái phải */}
                <View className="flex-row justify-between items-center mb-8">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </View>

                {/* 2. Card Profile: Layout phổ biến (Avatar trái - Text phải) */}
                <View className="bg-white p-5 rounded-2xl flex-row items-center shadow-sm mb-6">
                    {/* Avatar tròn to */}
                    <Skeleton className="h-16 w-16 rounded-full mr-4" />

                    {/* Cụm thông tin */}
                    <View className="space-y-3">
                        <Skeleton className="h-5 w-48" /> {/* Tên */}
                        <Skeleton className="h-4 w-28" /> {/* Username */}
                        <Skeleton className="h-6 w-20 rounded-full" /> {/* Badge Role */}
                    </View>
                </View>

                {/* 3. Sections List: Layout dạng danh sách phổ biến */}
                {/* Đây là layout "chung nhất": Một tiêu đề + Các dòng input */}
                <View className="bg-white rounded-2xl p-5 space-y-6">
                    <Skeleton className="h-5 w-40 mb-2" /> {/* Section Title */}

                    {/* Lặp lại 3 dòng mô phỏng các field thông tin */}
                    {[1, 2, 3].map((key) => (
                        <View key={key} className="space-y-2">
                            <Skeleton className="h-4 w-24" /> {/* Label */}
                            <Skeleton className="h-12 w-full rounded-xl" /> {/* Input Box */}
                        </View>
                    ))}
                </View>

                {/* 4. Bottom Action */}
                <View className="mt-6">
                    <Skeleton className="h-12 w-full rounded-xl" />
                </View>

            </View>
        </SafeAreaView>
    )
}