import { SalesOrder } from '@/hooks/useOrderList';
import dayjs from 'dayjs';
import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface OverdueSlaConfirmModalProps {
  visible: boolean;
  order: SalesOrder | null;
  onClose: () => void;
  onContinueCreateTask: () => void;
  onCreateIssue: () => void;
}

const OverdueSlaConfirmModal = ({
  visible,
  order,
  onClose,
  onContinueCreateTask,
  onCreateIssue,
}: OverdueSlaConfirmModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/35 items-center justify-center px-4">
        <View className="w-full max-w-[520px] bg-white rounded-xl p-4">
          <View className="flex-row items-center">
            <AlertTriangle size={20} color="#D97706" />
            <Text className="ml-2 text-lg font-bold text-gray-900">Đơn hàng đã quá hạn SLA</Text>
          </View>
          <Text className="text-gray-700 mt-3 leading-6">
            Đơn hàng <Text className="font-semibold">{order?.orderNo || '-'}</Text> đã quá hạn giao hàng
            {order?.slaDeliveryAt
              ? ` (SLA: ${dayjs(order.slaDeliveryAt).format('DD/MM/YYYY HH:mm')}).`
              : '.'}
          </Text>
          <Text className="text-gray-700 mt-2 leading-6">
            Bạn muốn tạo issue để admin cập nhật SLA mới hay tiếp tục tạo nhiệm vụ?
          </Text>

          <View className="mt-5 flex-row justify-end gap-2">
            <TouchableOpacity
              onPress={onContinueCreateTask}
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white"
            >
              <Text className="text-gray-700 font-medium">Tiếp tục tạo nhiệm vụ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCreateIssue}
              className="px-4 py-2.5 rounded-lg bg-blue-600"
            >
              <Text className="text-white font-semibold">Tạo issue cho Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OverdueSlaConfirmModal;
