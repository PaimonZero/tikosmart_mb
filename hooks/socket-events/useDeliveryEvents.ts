import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../utils/socketManager';
import { 
  addDeliveryRunRealtime, 
  updateDeliveryRunRealtime,
  deleteDeliveryRunRealtime,
  fetchDeliveryRunById,
  updateShipperLocation
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

    const handleLocationChanged = (payload: any) => {
      // payload: { lat, lng, shipperId, runId, timestamp, vehicle_type }
      // console.log('[Socket] Nhận cập nhật vị trí shipper:', payload);
      
      // Update Redux state if it's for the current run we are viewing
      const targetRunId = payload.runId || payload.run_id;
      
      const idStr = currentDetailsRunId ? currentDetailsRunId.toString() : null;
      const payloadIdStr = targetRunId ? targetRunId.toString() : null;

      if (idStr && payloadIdStr && idStr === payloadIdStr) {
        dispatch(updateShipperLocation(payload));
      }
    };

    socket.on('delivery_runs_created', handleCreated);
    socket.on('delivery_runs_updated', handleUpdated);
    socket.on('delivery_runs_deleted', handleDeleted);
    
    // Listeners cho detail orders
    socket.on('delivery_run_orders_insert', handleOrdersUpdated);
    socket.on('delivery_run_orders_update', handleOrdersUpdated);
    socket.on('delivery_run_orders_deleted', handleOrdersUpdated);
    
    // Tracking location
    socket.on('driver_location_changed', handleLocationChanged);

    // Subscribe to current run tracking if viewing details
    if (currentDetailsRunId) {
      socket.emit('subscribe_tracking', { runId: currentDetailsRunId });
    }

    return () => {
      socket.off('delivery_runs_created', handleCreated);
      socket.off('delivery_runs_updated', handleUpdated);
      socket.off('delivery_runs_deleted', handleDeleted);
      socket.off('delivery_run_orders_insert', handleOrdersUpdated);
      socket.off('delivery_run_orders_update', handleOrdersUpdated);
      socket.off('delivery_run_orders_deleted', handleOrdersUpdated);
      socket.off('driver_location_changed', handleLocationChanged);
      
      if (currentDetailsRunId) {
        socket.emit('unsubscribe_tracking', { runId: currentDetailsRunId });
      }
    };
  }, [dispatch, currentDetailsRunId]);
};

export default useDeliveryEvents;
