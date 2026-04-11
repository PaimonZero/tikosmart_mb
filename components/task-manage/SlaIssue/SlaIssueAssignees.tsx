import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Plus, Users, X } from 'lucide-react-native';

export type AssigneeOption = {
  id: string;
  fullName: string;
  username: string;
  avatar?: string;
};

interface SlaIssueAssigneesProps {
  assignees: AssigneeOption[];
  onRemove: (id: string) => void;
  onAdd: () => void;
}

const SlaIssueAssignees: React.FC<SlaIssueAssigneesProps> = ({ assignees, onRemove, onAdd }) => {
  return (
    <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-5">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-1.5 h-6 bg-emerald-500 rounded-full mr-2" />
          <Text className="text-[15px] font-bold text-gray-900">Người phối hợp</Text>
        </View>
        <TouchableOpacity
          onPress={onAdd}
          className="px-3 py-2 rounded-xl bg-blue-50 flex-row items-center"
          activeOpacity={0.7}
        >
          <Plus size={14} color="#2563EB" strokeWidth={3} />
          <Text className="text-blue-600 text-[11px] font-bold ml-1">THÊM</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-[12px] text-gray-500 mb-3 ml-0.5">
        Tag quản lý hoặc đồng nghiệp để cùng theo dõi tiến độ SLA.
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {assignees.length > 0 ? (
          assignees.map((user) => (
            <TouchableOpacity
              key={user.id}
              activeOpacity={0.8}
              onPress={() => onRemove(user.id)}
              className="rounded-full bg-gray-50 border border-gray-100 pr-2.5 py-1.5 pl-1.5 flex-row items-center"
            >
              {user.avatar ? (
                <View className="w-6 h-6 rounded-full overflow-hidden mr-1.5">
                  <Image source={{ uri: user.avatar }} className="w-6 h-6" resizeMode="cover" />
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full bg-blue-500 mr-1.5 items-center justify-center">
                  <Text className="text-[10px] font-bold text-white">
                    {(user.fullName || "?").trim().charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View>
                <Text className="text-[11px] font-bold text-gray-800 leading-tight">
                  {user.fullName}
                </Text>
                <Text className="text-[9px] text-gray-500 mt-0.5">@{user.username}</Text>
              </View>
              <View className="ml-1.5 bg-gray-200 rounded-full w-3.5 h-3.5 items-center justify-center">
                <X size={8} color="#666" strokeWidth={4} />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="w-full py-6 items-center border border-dashed border-gray-200 rounded-2xl">
            <Users size={24} color="#D1D5DB" />
            <Text className="text-gray-400 text-xs mt-2 italic">Chưa có người được tag</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(SlaIssueAssignees);
