import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { socket } from '@/utils/socketManager';
import { 
  addSalesOrderRealtime, 
  updateSalesOrderRealtime,
  deleteSalesOrderRealtime 
} from '@/store/salesOrdersSlice';

const useSalesOrderEvents = (options: { statusFilter?: string[] | null } = {}) => {
  const { statusFilter = null } = options;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleCreated = (newOrder: any) => {
      
      if (statusFilter && Array.isArray(statusFilter) && !statusFilter.includes(newOrder.status)) {
        return;
      }
      
      dispatch(addSalesOrderRealtime(newOrder));
    };

    const handleUpdated = (updatedOrder: any) => {

      if (statusFilter && Array.isArray(statusFilter)) {
        if (!statusFilter.includes(updatedOrder.status)) {
           // Đơn hàng đã chuyển status khỏi danh sách được xem
           dispatch(deleteSalesOrderRealtime({ id: updatedOrder.id }));
           return;
        }
      }

      dispatch(updateSalesOrderRealtime(updatedOrder));
    };

    const handleDeleted = (payload: { id: string }) => {
      dispatch(deleteSalesOrderRealtime(payload));
    };

    socket.on('sales_orders_created', handleCreated);
    socket.on('sales_orders_updated', handleUpdated);
    socket.on('sales_orders_deleted', handleDeleted);

    return () => {
      socket.off('sales_orders_created', handleCreated);
      socket.off('sales_orders_updated', handleUpdated);
      socket.off('sales_orders_deleted', handleDeleted);
    };
  }, [dispatch, statusFilter]);
};

export default useSalesOrderEvents;
