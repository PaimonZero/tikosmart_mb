import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/authSlice";
import categoryReducer from "@/store/categorySlice";
import codRemittanceTicketsReducer from "@/store/codRemittanceTicketsSlice";
import customerReducer from "@/store/customerSlice";
import deliveryRunsReducer from "@/store/deliveryRunsSlice";
import departmentReducer from "@/store/departmentSlice";
import productReducer from "@/store/productSlice";
import userReducer from "@/store/userSlice";
import inventoryLotReducer from "@/store/inventoryLotSlice";
import issueReducer from "@/store/issueSlice";
import notificationReducer from "@/store/notificationSlice";
import orderReturnsReducer from "@/store/orderReturnsSlice";
import paymentsCombinedReducer from "@/store/paymentsCombinedSlice";
import salesInvoicesReducer from "@/store/salesInvoicesSlice";
import salesOrdersReducer from "@/store/salesOrdersSlice";
import supplierReducer from "@/store/supplierSlice";
import supplierTransactionCombineReducer from "@/store/supplierTransactionCombineSlice";
import supTransactionPaymentReducer from "@/store/supTransactionPaymentSlice";
import taskReducer from "@/store/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    codRemittanceTickets: codRemittanceTicketsReducer,
    customer: customerReducer,
    deliveryRuns: deliveryRunsReducer,
    department: departmentReducer,
    inventoryLot: inventoryLotReducer,
    issue: issueReducer,
    notification: notificationReducer,
    orderReturns: orderReturnsReducer,
    paymentsCombined: paymentsCombinedReducer,
    salesInvoices: salesInvoicesReducer,
    salesOrders: salesOrdersReducer,
    supplier: supplierReducer,
    supplierTransactionCombine: supplierTransactionCombineReducer,
    supTransactionPayment: supTransactionPaymentReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
