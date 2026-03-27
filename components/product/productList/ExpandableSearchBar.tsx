import Feather from '@expo/vector-icons/Feather';
import React, { useRef, useState } from 'react';
import {
    Keyboard,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ExpandableSearchBarProps {
    keyword: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
    onClear: () => void;
    onExpandChange: (expanded: boolean) => void;
    placeholder?: string;
}

export const ExpandableSearchBar: React.FC<ExpandableSearchBarProps> = ({
    keyword,
    onChangeText,
    onSubmit,
    onClear,
    onExpandChange,
    placeholder = "Tìm kiếm...",
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const handleSearchIconPress = () => {
        setIsExpanded(true);
        onExpandChange(true);
        // Auto focus when expanded
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleClose = () => {
        setIsExpanded(false);
        onClear();
        onExpandChange(false);
        Keyboard.dismiss();
    };

    const handleSubmit = () => {
        onSubmit();
        Keyboard.dismiss();
    };

    return (
        <View className={`${isExpanded ? 'flex-1' : 'w-auto'} items-end`}>
            {/* Search Icon Button - Always visible when collapsed */}
            {!isExpanded && (
                <TouchableOpacity
                    onPress={handleSearchIconPress}
                    className="w-12 h-12 items-center justify-center rounded-full bg-blue-50 border border-blue-100"
                    activeOpacity={0.7}
                >
                    <Feather name="search" size={22} color="#2563EB" />
                </TouchableOpacity>
            )}

            {/* Expandable Search Input - Full width when expanded */}
            {isExpanded && (
                <View className="flex-1 flex-row items-center gap-2">
                    <View className="flex-1 flex-row items-center bg-white rounded-xl px-3.5 h-12 border-2 border-blue-600 shadow-sm">
                        <Feather name="search" size={20} color="#2563EB" />
                        <TextInput
                            ref={inputRef}
                            value={keyword}
                            onChangeText={onChangeText}
                            onSubmitEditing={handleSubmit}
                            placeholder={placeholder}
                            placeholderTextColor="#9CA3AF"
                            returnKeyType="search"
                            className="flex-1 ml-2.5 text-[15px] text-gray-900 font-medium h-12"
                        />
                        {keyword.length > 0 && (
                            <TouchableOpacity
                                onPress={() => {
                                    onChangeText('');
                                }}
                                className="p-1.5"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Feather name="x-circle" size={18} color="#6B7280" />
                            </TouchableOpacity>
                        )}
                    </View>
                    {/* Close button outside search box */}
                    <TouchableOpacity
                        onPress={handleClose}
                        className="w-12 h-12 items-center justify-center rounded-full bg-blue-50 border border-blue-100"
                        activeOpacity={0.7}
                    >
                        <Feather name="x" size={20} color="#2563EB" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};
