import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, Clock, User } from 'lucide-react-native';
import dayjs from 'dayjs';

interface SlaIssueHeroProps {
  orderNo?: string;
  slaDeliveryAt?: string;
  customerName?: string;
}

const SlaIssueHero: React.FC<SlaIssueHeroProps> = ({ orderNo, slaDeliveryAt, customerName }) => {
  return (
    <LinearGradient
      colors={['#FEF2F2', '#FDE0E0']}
      className="rounded-3xl border border-red-200 p-4 mb-5 shadow-sm overflow-hidden"
    >
      <View className="flex-row items-center justify-between mb-2.5">
        <View className="flex-row items-center">
          <View className="bg-red-500 rounded-lg p-1.5 mr-2">
            <AlertCircle size={18} color="#FFF" />
          </View>
          <Text className="text-sm font-bold text-red-900 tracking-tight">
            ĐƠN HÀNG {orderNo || '-'}
          </Text>
        </View>
        <View className="rounded-full bg-red-100 px-2.5 py-1">
          <Text className="text-[10px] font-bold text-red-700 uppercase">Quá hạn SLA</Text>
        </View>
      </View>

      <View className="flex-row items-center mt-1">
        <Clock size={14} color="#B91C1C" />
        <Text className="text-sm font-semibold text-red-700 ml-1.5">
          Hạn cũ: {slaDeliveryAt ? dayjs(slaDeliveryAt).format('HH:mm DD/MM/YYYY') : '-'}
        </Text>
      </View>

      <View className="flex-row items-center mt-1.5">
        <User size={14} color="#B91C1C" />
        <Text className="text-sm text-red-700 ml-1.5">
          Khách hàng: <Text className="font-bold">{customerName || '-'}</Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

export default React.memo(SlaIssueHero);
