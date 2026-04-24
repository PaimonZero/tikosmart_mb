import React from 'react';
import { View, Text, TextInput, Switch as RNSwitch } from 'react-native';
import { FileText, Layers, Lock } from 'lucide-react-native';

interface SlaIssueSystemInfoProps {
  title: string;
}

const SlaIssueSystemInfo: React.FC<SlaIssueSystemInfoProps> = ({ title }) => {
  return (
    <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-5">
      <View className="flex-row items-center mb-4">
        <View className="w-1.5 h-6 bg-blue-500 rounded-full mr-2" />
        <Text className="text-[15px] font-bold text-gray-900">Thông tin chung</Text>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-1.5">
          <FileText size={14} color="#6B7280" />
          <Text className="text-[13px] font-semibold text-gray-700 ml-1.5">Tiêu đề</Text>
        </View>
        <View className="border border-gray-200 rounded-2xl px-3.5 py-3.5 bg-gray-50 min-h-[64px] justify-center">
          <Text className="text-gray-700 text-[13px] leading-5 font-medium" numberOfLines={2}>
            {title}
          </Text>
        </View>
      </View>

      <View className="mb-4">
        <View className="flex-row items-center mb-1.5">
          <Layers size={14} color="#6B7280" />
          <Text className="text-[13px] font-semibold text-gray-700 ml-1.5">Loại vấn đề</Text>
        </View>
        <TextInput
          value="HT - SLA quá hạn đơn hàng"
          editable={false}
          className="border border-gray-200 rounded-2xl px-3.5 py-3.5 bg-gray-50 text-gray-700 text-[13px] font-bold"
        />
      </View>

      <View className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Lock size={16} color="#3B82F6" />
            <Text className="ml-2 text-sm font-bold text-blue-900">Riêng tư (Bắt buộc)</Text>
          </View>
          <RNSwitch
            value={false}
            disabled={true}
            trackColor={{ false: '#BFDBFE', true: '#3B82F6' }}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
        <Text className="mt-1.5 text-[11px] text-blue-600 font-medium leading-4">
          Vì lý do bảo mật, các yêu cầu thay đổi SLA chỉ hiển thị với người liên quan.
        </Text>
      </View>
    </View>
  );
};

export default React.memo(SlaIssueSystemInfo);
