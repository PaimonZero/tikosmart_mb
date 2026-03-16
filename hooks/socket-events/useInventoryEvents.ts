import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { socket } from '@/utils/socketManager';
import { 
  addInventoryLot, 
  updateInventoryLotRealtime,
  deleteInventoryLotRealtime,
  fetchInventoryLotDetail
} from '@/store/inventoryLotSlice';

const useInventoryEvents = () => {
  const dispatch = useAppDispatch();
  const inventoryLotDetail: any = useAppSelector((state) => state.inventoryLot.inventoryLotDetail);
  const currentLotDetailId = inventoryLotDetail?.id;

  useEffect(() => {
    const handleCreated = (newLot: any) => {
      dispatch(addInventoryLot(newLot));
    };

    const handleUpdated = (updatedLot: any) => {
      dispatch(updateInventoryLotRealtime(updatedLot));
      
      // Nếu lô hàng bị update chính là lô hàng đang mở chi tiết 
      if (currentLotDetailId === updatedLot.id) {
        dispatch(fetchInventoryLotDetail(updatedLot.id));
      }
    };

    const handleDeleted = (payload: { id: string }) => {
      dispatch(deleteInventoryLotRealtime(payload));
    };
    
    socket.on('inventory_lots_created', handleCreated);
    socket.on('inventory_lots_updated', handleUpdated);
    socket.on('inventory_lots_deleted', handleDeleted);

    return () => {
      socket.off('inventory_lots_created', handleCreated);
      socket.off('inventory_lots_updated', handleUpdated);
      socket.off('inventory_lots_deleted', handleDeleted);
    };
  }, [dispatch, currentLotDetailId]);
};

export default useInventoryEvents;
