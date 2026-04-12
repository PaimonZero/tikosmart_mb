import { SalesOrder } from '@/hooks/useOrderList';
import dayjs from 'dayjs';
import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface OverdueSlaConfirmModalProps {
  visible: boolean;
  order: SalesOrder | null;
  onClose: () => void;
  onCreateIssue: () => void;
}

const OverdueSlaConfirmModal = ({
  visible,
  order,
  onClose,
  onCreateIssue,
}: OverdueSlaConfirmModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Accent */}
          <View className="h-1.5 bg-amber-500" />
          
          <View className="p-6">
            {/* Icon & Title Group */}
            <View className="items-center mb-5">
              <View className="w-16 h-16 bg-amber-50 rounded-full items-center justify-center mb-4">
                <AlertTriangle size={32} color="#D97706" />
              </View>
              <Text className="text-xl font-bold text-slate-900 text-center">
                Đơn hàng quá hạn SLA
              </Text>
            </View>

            {/* Content Body */}
            <View className="space-y-3">
              <Text className="text-slate-600 text-center leading-relaxed">
                Đơn hàng <Text className="font-bold text-slate-900">{order?.orderNo || '-'}</Text> đã quá hạn giao hàng dự kiến.
              </Text>
              
              {order?.slaDeliveryAt && (
                <View className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                  <Text className="text-slate-500 text-xs text-center uppercase tracking-wider font-semibold mb-1">
                    Thời hạn SLA gốc
                  </Text>
                  <Text className="text-slate-900 font-bold text-center text-base">
                    {dayjs(order.slaDeliveryAt).format('HH:mm - DD/MM/YYYY')}
                  </Text>
                </View>
              )}

              <Text className="text-slate-500 text-center text-sm mt-4 italic">
                Bạn vui lòng tạo Issue để Admin cập nhật lại thời gian SLA mới.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="mt-8 flex-col gap-3">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCreateIssue}
                className="w-full py-4 bg-blue-600 rounded-xl shadow-sm shadow-blue-200"
              >
                <Text className="text-white font-bold text-center text-base">
                  Tạo issue cho Admin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                className="w-full py-3.5 bg-white border border-slate-200 rounded-xl"
              >
                <Text className="text-slate-600 font-semibold text-center">
                  Hủy và quay lại
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OverdueSlaConfirmModal;
