import dayjs from 'dayjs';
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { CalendarDays, Clock, Flag as FlagIcon, HelpCircle } from 'lucide-react-native';
import { Dayjs } from 'dayjs';

interface SlaIssuePlanProps {
  proposedSla: Dayjs;
  onOpenPicker: () => void;
  applyOffset: (hours: 12 | 24 | 48) => void;
  severity: 'low' | 'medium' | 'high';
  setSeverity: (s: 'low' | 'medium' | 'high') => void;
  description: string;
  setDescription: (d: string) => void;
}

const SlaIssuePlan: React.FC<SlaIssuePlanProps> = ({
  proposedSla,
  onOpenPicker,
  applyOffset,
  severity,
  setSeverity,
  description,
  setDescription,
}) => {
  return (
    <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-5">
      <View className="flex-row items-center mb-4">
        <View className="w-1.5 h-6 bg-pink-500 rounded-full mr-2" />
        <Text className="text-[15px] font-bold text-gray-900">Kế hoạch gia hạn</Text>
      </View>

      <View className="mb-5">
        <View className="flex-row items-center mb-2">
          <CalendarDays size={14} color="#6B7280" />
          <Text className="text-[13px] font-semibold text-gray-700 ml-1.5">SLA đề xuất (tùy chọn)</Text>
        </View>
        
        <TouchableOpacity
          onPress={onOpenPicker}
          className="border border-blue-100 rounded-2xl px-4 py-3.5 bg-blue-50/30 flex-row items-center justify-between"
          activeOpacity={0.7}
        >
          <View>
            <Text className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">THỜI GIAN MỚI</Text>
            <Text className="text-gray-900 font-bold ml-0.5">{proposedSla.format('HH:mm DD/MM/YYYY')}</Text>
          </View>
          <View className="bg-white rounded-xl p-2 shadow-sm">
            <Clock size={18} color="#2563EB" />
          </View>
        </TouchableOpacity>

        <View className="mt-3 flex-row gap-2.5">
          {[12, 24, 48].map((hour) => {
            const expected = dayjs().add(hour, 'hour');
            const active = Math.abs(expected.diff(proposedSla, 'minute')) <= 1;
            
            return (
              <TouchableOpacity
                key={hour}
                onPress={() => applyOffset(hour as 12 | 24 | 48)}
                className={`flex-1 px-3 py-3 rounded-2xl border ${
                  active ? 'bg-blue-600 border-blue-600 shadow-md' : 'bg-white border-gray-100 shadow-sm'
                }`}
                activeOpacity={0.8}
              >
                <Text className={`${active ? 'text-white' : 'text-gray-600'} text-center text-sm font-bold`}>+{hour}h</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="mb-5">
        <View className="flex-row items-center mb-3">
          <FlagIcon size={14} color="#6B7280" />
          <Text className="text-[13px] font-semibold text-gray-700 ml-1.5">Mức độ khẩn cấp</Text>
        </View>

        <View className="flex-row gap-2.5">
          {(['low', 'medium', 'high'] as const).map((level) => {
            const active = severity === level;
            
            const styles = {
              low: {
                active: 'bg-emerald-500 border-emerald-500',
                icon: '#FFF',
                text: 'text-white'
              },
              medium: {
                active: 'bg-amber-500 border-amber-500',
                icon: '#FFF',
                text: 'text-white'
              },
              high: {
                active: 'bg-rose-500 border-rose-500',
                icon: '#FFF',
                text: 'text-white'
              },
              inactive: {
                low: { icon: '#059669', label: 'THẤP' },
                medium: { icon: '#D97706', label: 'TRUNG BÌNH' },
                high: { icon: '#E11D48', label: 'KHẨN CẤP' }
              }
            };

            const config = styles.inactive[level];
            const activeClasses = styles[level].active;
            const textClass = active ? styles[level].text : 'text-gray-500';
            const iconColor = active ? styles[level].icon : config.icon;
            
            return (
              <TouchableOpacity
                key={level}
                onPress={() => setSeverity(level)}
                className={`flex-1 px-2 py-3.5 rounded-2xl border flex-row items-center justify-center ${
                  active ? `${activeClasses} shadow-md` : 'bg-white border-gray-100 shadow-sm'
                }`}
                activeOpacity={0.8}
              >
                <FlagIcon 
                  size={11} 
                  color={iconColor} 
                  fill={active ? '#FFF' : 'transparent'} 
                />
                <Text className={`text-center text-xs font-black ml-1.5 ${textClass}`}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View>
        <View className="flex-row items-center mb-2">
          <HelpCircle size={14} color="#6B7280" />
          <Text className="text-[13px] font-semibold text-gray-700 ml-1.5">Chi tiết lý do</Text>
        </View>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          placeholder="Ví dụ: Đơn hàng quá nhiều mục hàng, thiếu nhân lực hỗ trợ..."
          placeholderTextColor="#9CA3AF"
          className="border border-gray-100 rounded-2xl p-4 min-h-[140px] text-gray-900 bg-gray-50"
        />
      </View>
    </View>
  );
};

export default React.memo(SlaIssuePlan);
