import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '../../utils/socketManager';
import { toast } from 'sonner-native';
import { 
  addPreparationTaskRealtime, 
  updatePreparationTaskRealtime,
  deletePreparationTaskRealtime 
} from '../../store/taskSlice';

/**
 * Hook lắng nghe các sự kiện realtime của phiếu soạn hàng (Preparation Tasks)
 */
const usePreparationEvents = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (newTask: any) => {
      dispatch(addPreparationTaskRealtime(newTask));
      toast.info(`Phiếu soạn hàng ${newTask.task_no || '-'} vừa được tạo.`);
    };

    const handleUpdated = (updatedTask: any) => {
      dispatch(updatePreparationTaskRealtime(updatedTask));
    };

    const handleDeleted = (payload: any) => {
      const deletedId = typeof payload === 'object' ? payload.id : payload;
      dispatch(deletePreparationTaskRealtime(deletedId));
    };

    socket.on('preparation_tasks_created', handleCreated);
    socket.on('preparation_tasks_updated', handleUpdated);
    socket.on('preparation_tasks_deleted', handleDeleted);

    return () => {
      socket.off('preparation_tasks_created', handleCreated);
      socket.off('preparation_tasks_updated', handleUpdated);
      socket.off('preparation_tasks_deleted', handleDeleted);
    };
  }, [dispatch]);
};

export default usePreparationEvents;
