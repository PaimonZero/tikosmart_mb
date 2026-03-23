import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '../../utils/socketManager';
import { 
  addProduct, 
  updateProductRealtime,
  removeProductRealtime
} from '../../store/productSlice';
import { toast } from 'sonner-native'; 

/**
 * Hook lắng nghe các sự kiện realtime của sản phẩm
 */
const useProductEvents = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (newProduct: any) => {
      dispatch(addProduct(newProduct));
      toast.info(`Sản phẩm ${newProduct.name || ''} vừa được tạo.`);
    };

    const handleUpdated = (updatedProduct: any) => {
      dispatch(updateProductRealtime(updatedProduct));
    };

    const handleDeleted = (payload: any) => {
      const deletedId = typeof payload === 'object' && payload !== null ? payload.id : payload;
      dispatch(removeProductRealtime(deletedId));
    };
    
    socket.on('products_created', handleCreated);
    socket.on('products_updated', handleUpdated);
    socket.on('products_deleted', handleDeleted);

    return () => {
      socket.off('products_created', handleCreated);
      socket.off('products_updated', handleUpdated);
      socket.off('products_deleted', handleDeleted);
    };
  }, [dispatch]);
};

export default useProductEvents;
