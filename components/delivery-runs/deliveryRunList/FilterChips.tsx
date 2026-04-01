import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

interface FilterChip {
    label: string;
    value: string;
}

interface FilterChipsProps {
    chips: FilterChip[];
    selectedValue: string;
    onValueChange: (value: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
    chips,
    selectedValue,
    onValueChange,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
            className="flex-row"
        >
            {chips.map((chip) => {
                const isActive = selectedValue === chip.value;
                return (
                    <TouchableOpacity
                        key={chip.value}
                        onPress={() => onValueChange(chip.value)}
                        className={`mr-2 px-4 py-2 rounded-2xl border ${
                            isActive
                                ? 'bg-blue-600 border-blue-600'
                                : 'bg-white border-gray-200'
                        } shadow-sm`}
                        activeOpacity={0.7}
                    >
                        <Text
                            className={`text-[13px] font-bold ${
                                isActive ? 'text-white' : 'text-gray-500'
                            }`}
                        >
                            {chip.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
};
