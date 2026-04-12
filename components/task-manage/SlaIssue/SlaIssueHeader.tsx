import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface SlaIssueHeaderProps {
  onBack: () => void;
  title: string;
}

const SlaIssueHeader: React.FC<SlaIssueHeaderProps> = ({ onBack, title }) => {
  return (
    <View className="px-4 py-3 bg-white border-b border-gray-50 flex-row items-center justify-between">
      <TouchableOpacity 
        onPress={onBack} 
        className="p-2 -ml-2"
        activeOpacity={0.7}
      >
        <ChevronLeft size={24} color="#1F2937" />
      </TouchableOpacity>
      <Text className="text-[17px] font-bold text-gray-900">{title}</Text>
      <View className="w-8" />
    </View>
  );
};

export default React.memo(SlaIssueHeader);
