import React from 'react';
import { View } from 'react-native';
import TaskCardSkeleton from './TaskCardSkeleton';

interface TaskListSkeletonProps {
    count?: number;
}

export default function TaskListSkeleton({ count = 5 }: TaskListSkeletonProps) {
    const skeletonArray = Array.from({ length: count }, (_, index) => index);

    return (
        <View className="flex-1 pt-3">
            {skeletonArray.map((key) => (
                <TaskCardSkeleton key={key} />
            ))}
        </View>
    );
}
