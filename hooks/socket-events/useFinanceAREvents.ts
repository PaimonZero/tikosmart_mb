import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '../../utils/socketManager';
import {
  addSalesInvoiceRealtime,
  updateSalesInvoiceRealtime,
  removeSalesInvoiceRealtime,
} from '../../store/salesInvoicesSlice';
import {
  addPaymentRealtime,
  updatePaymentRealtime,
  removePaymentRealtime,
} from '../../store/paymentsCombinedSlice';
import { toast } from 'sonner-native';

const useFinanceAREvents = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    // Sales Invoices
    const handleInvoiceCreated = (payload: any) => {
      dispatch(addSalesInvoiceRealtime(payload));
      toast.info(`Phiếu thu ${payload.invoice_no || ''} vừa được tạo.`);
    };

    const handleInvoiceUpdated = (payload: any) => {
      dispatch(updateSalesInvoiceRealtime(payload));
    };

    const handleInvoiceDeleted = (payload: any) => {
      const deletedId = typeof payload === 'object' ? payload.id : payload;
      dispatch(removeSalesInvoiceRealtime(deletedId));
    };

    // Payments
    const handlePaymentCreated = (payload: any) => {
      dispatch(addPaymentRealtime(payload));
    };

    const handlePaymentUpdated = (payload: any) => {
      dispatch(updatePaymentRealtime(payload));
    };

    const handlePaymentDeleted = (payload: any) => {
      const deletedId = typeof payload === 'object' ? payload.id : payload;
      dispatch(removePaymentRealtime(deletedId));
    };

    socket.on('sales_invoices_created', handleInvoiceCreated);
    socket.on('sales_invoices_updated', handleInvoiceUpdated);
    socket.on('sales_invoices_deleted', handleInvoiceDeleted);
    
    socket.on('payments_created', handlePaymentCreated);
    socket.on('payments_updated', handlePaymentUpdated);
    socket.on('payments_deleted', handlePaymentDeleted);

    return () => {
      socket.off('sales_invoices_created', handleInvoiceCreated);
      socket.off('sales_invoices_updated', handleInvoiceUpdated);
      socket.off('sales_invoices_deleted', handleInvoiceDeleted);
      
      socket.off('payments_created', handlePaymentCreated);
      socket.off('payments_updated', handlePaymentUpdated);
      socket.off('payments_deleted', handlePaymentDeleted);
    };
  }, [dispatch]);
};

export default useFinanceAREvents;
