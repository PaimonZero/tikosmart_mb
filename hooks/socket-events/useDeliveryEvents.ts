import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../utils/socketManager';
import { 
  addDeliveryRunRealtime, 
  updateDeliveryRunRealtime,
  deleteDeliveryRunRealtime,
  fetchDeliveryRunById
} from '../../store/deliveryRunsSlice';
import { AppDispatch, RootState } from '../../store/store';

const useDeliveryEvents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentDetailsRunId = useSelector((state: RootState) => (state.deliveryRuns.deliveryRunById as any)?.id);

  useEffect(() => {
    const handleCreated = (newRun: any) => {
      // console.log('[Socket] Nhận sự kiện tạo chuyến giao hàng:', newRun);
      dispatch(addDeliveryRunRealtime(newRun));
    };

    const handleUpdated = (updatedRun: any) => {
      // console.log('[Socket] Nhận sự kiện cập nhật chuyến giao hàng:', updatedRun);
      dispatch(updateDeliveryRunRealtime(updatedRun));
    };

    const handleDeleted = (payload: any) => {
      // console.log('[Socket] Nhận sự kiện xoá chuyến giao hàng:', payload);
      dispatch(deleteDeliveryRunRealtime(payload));
    };

    const handleOrdersUpdated = (payload: any) => {
      // payload có thể chứa id của đơn, nhưng ta cần biết runId để fetch lại chi tiết chuyến giao hàng
      // console.log('[Socket] Nhận sự kiện có thay đổi trong đơn giao hàng (thuộc chuyến):', payload);
      
      const targetRunId = payload.runId || payload.run_id;
      
      // Nếu người dùng đang mở xem chi tiết chuyến giao hàng này, fetch lại
      if (currentDetailsRunId && targetRunId && currentDetailsRunId === targetRunId) {
         void dispatch(fetchDeliveryRunById(currentDetailsRunId));
      }
    };

    socket.on('delivery_runs_created', handleCreated);
    socket.on('delivery_runs_updated', handleUpdated);
    socket.on('delivery_runs_deleted', handleDeleted);
    
    // Listeners cho detail orders
    socket.on('delivery_run_orders_insert', handleOrdersUpdated);
    socket.on('delivery_run_orders_update', handleOrdersUpdated);
    socket.on('delivery_run_orders_deleted', handleOrdersUpdated);

    return () => {
      socket.off('delivery_runs_created', handleCreated);
      socket.off('delivery_runs_updated', handleUpdated);
      socket.off('delivery_runs_deleted', handleDeleted);
      socket.off('delivery_run_orders_insert', handleOrdersUpdated);
      socket.off('delivery_run_orders_update', handleOrdersUpdated);
      socket.off('delivery_run_orders_deleted', handleOrdersUpdated);
    };
  }, [dispatch, currentDetailsRunId]);
};

export default useDeliveryEvents;
