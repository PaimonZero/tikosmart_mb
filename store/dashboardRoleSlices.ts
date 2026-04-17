import DashboardService from "@/services/dashboardService";

// ============================================================
// ACCOUNTANT
// ============================================================
export const getAccountantKpiData = async () => {
    try {
        const res = await DashboardService.getAccountantStats();
        if (res.success && res.data) return res.data;
        throw new Error("Invalid response");
    } catch {
        return {
            suplierPaymentIn: [{ totalExpected: 0, totalPaid: 0, totalMissing: 0 }],
            suplierPaymentOut: [{ totalExpectedOut: 0, totalPaidOut: 0, totalMissingOut: 0 }],
        };
    }
};

export const getMonthlyTransactionData = async (month: number, year: number) => {
    try {
        const res = await DashboardService.getMonthlyTransactions({ month, year });
        if (res.success && res.data) {
            const grouped = new Map<string, { date: string; moneyIn: number; moneyOut: number }>();
            for (const item of res.data) {
                const key = item.month as string;
                if (!grouped.has(key)) grouped.set(key, { date: key, moneyIn: 0, moneyOut: 0 });
                const e = grouped.get(key)!;
                if (item.type === "in") e.moneyIn += item.totalPaid;
                else if (item.type === "out") e.moneyOut += item.totalPaid;
            }
            return Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date));
        }
        throw new Error("Invalid");
    } catch {
        return [];
    }
};

export const mockPaymentStatus = [
    { type: "Đã thanh toán", value: 62, color: "#52c41a" },
    { type: "Chờ thanh toán", value: 21, color: "#faad14" },
    { type: "Đã hủy", value: 9, color: "#f5222d" },
    { type: "Hoàn tiền", value: 8, color: "#722ed1" },
];

// ============================================================
// MANAGER
// ============================================================
export const getManagerKpiData = async () => {
    try {
        const res = await DashboardService.getManagerStats();
        if (res.success && res.data) {
            const d = res.data;
            return {
                processingOrders: d.processingOrders ?? 0,
                completedOrders: d.completedOrders ?? 0,
                cancelledOrders: d.cancelledOrders ?? 0,
                SupplierReturns: d.supplierReturn ?? 0,
                totalInventory: d.totalInventory ?? 0,
                supplierInput: d.supplierInput ?? 0,
            };
        }
        throw new Error("Invalid");
    } catch {
        return { processingOrders: 0, completedOrders: 0, cancelledOrders: 0, SupplierReturns: 0, totalInventory: 0, supplierInput: 0 };
    }
};

const orderStageMap: Record<string, string> = {
    draft: "Nháp",
    pending_preparation: "Chờ chuẩn bị",
    assigned_preparation: "Đang soạn",
    confirmed: "Đã xác nhận",
    delivering: "Đang giao",
    delivered: "Đã giao",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
};

export const getManagerOrderPipeline = async () => {
    try {
        const res = await DashboardService.getManagerOrderProcessingProgress();
        if (res.success && Array.isArray(res.data)) {
            return res.data.map((item: any) => ({
                stage: orderStageMap[item.status] || item.status,
                orders: item.count,
            }));
        }
        throw new Error("Invalid");
    } catch {
        return [];
    }
};

// ============================================================
// PICKER
// ============================================================
export const getPickerKpiData = async () => {
    try {
        const res = await DashboardService.getPickerStats();
        if (res.success && Array.isArray(res.data)) {
            const map: Record<string, number> = {};
            res.data.forEach((item: any) => { map[item.status] = item.count; });
            return {
                totalAssigned: map["assigned"] || 0,
                completed: map["completed"] || 0,
                inProgress: map["in_progress"] || 0,
                pendingApproval: map["pending_review"] || 0,
                issues: map["cancelled"] || 0,
            };
        }
        throw new Error("Invalid");
    } catch {
        return { totalAssigned: 0, completed: 0, inProgress: 0, pendingApproval: 0, issues: 0 };
    }
};

export const hourlyPerformance = [
    { time: "08:00", done: 1 },
    { time: "09:00", done: 3 },
    { time: "10:00", done: 5 },
    { time: "11:00", done: 2 },
    { time: "12:00", done: 1 },
];

// ============================================================
// SELLER
// ============================================================
export const getSellerKpiData = async () => {
    try {
        const res = await DashboardService.getSellerStats();
        if (res.success && res.data) {
            const orders = res.data.sellerOrders || {};
            const customers = res.data.customerBySeller || {};
            return {
                processingOrders: orders.processingOrders ?? 0,
                completedOrders: orders.completedOrders ?? 0,
                cancelledOrders: orders.cancelledOrders ?? 0,
                draftOrders: orders.draftOrders ?? 0,
                totalOrders: orders.totalOrders ?? 0,
                totalCustomers: customers.totalCustomers ?? 0,
            };
        }
        throw new Error("Invalid");
    } catch {
        return { processingOrders: 0, completedOrders: 0, cancelledOrders: 0, draftOrders: 0, totalOrders: 0, totalCustomers: 0 };
    }
};

// ============================================================
// SHIPPER
// ============================================================
export const getShipperKpiData = async () => {
    try {
        const res = await DashboardService.getShipperStats();
        if (res.success && res.data) {
            const d = res.data;
            return {
                totalAssignedToday: d.totalAssignedToday ?? 0,
                deliveredSuccess: d.deliveredSuccess ?? 0,
                delivering: d.delivering ?? 0,
                lateOrders: d.lateOrders ?? 0,
                failedOrReturn: d.failedOrReturn ?? 0,
            };
        }
        throw new Error("Invalid");
    } catch {
        return { totalAssignedToday: 4, deliveredSuccess: 3, delivering: 0, lateOrders: 0, failedOrReturn: 0 };
    }
};

// ============================================================
// SUP-PICKER
// ============================================================
export const getSupPickerKpiData = async () => {
    try {
        const res = await DashboardService.getSupPickerStats();
        if (res.success && res.data) {
            const d = res.data;
            return {
                totalOrderAssigned: d.totalOrderAssigned ?? 0,
                totalOrderProcessing: d.totalOrderProcessing ?? 0,
                totalOrderConfirmed: d.totalOrderConfirmed ?? 0,
                totalPickers: d.totalPickers ?? 0,
                totalOrderCancelled: d.totalOrderCancelled ?? 0,
            };
        }
        throw new Error("Invalid");
    } catch {
        return { totalOrderAssigned: 0, totalOrderProcessing: 0, totalOrderConfirmed: 0, totalPickers: 0, totalOrderCancelled: 0 };
    }
};

export const getSupPickerOrderProcessing = async () => {
    try {
        const res = await DashboardService.getSupPickerOrderProcessing();
        if (res.success && Array.isArray(res.data)) {
            const statusMap: Record<string, string> = {
                assigned: "Chờ soạn",
                in_progress: "Đang soạn",
                pending_review: "Chờ duyệt",
                completed: "Đã soạn xong",
                cancelled: "Hủy",
            };
            const order = ["assigned", "in_progress", "pending_review", "completed", "cancelled"];
            const dataMap: Record<string, number> = {};
            res.data.forEach((item: any) => { dataMap[item.status] = item.count; });
            return order.map((s) => ({ status: statusMap[s] || s, value: dataMap[s] || 0 }));
        }
        throw new Error("Invalid");
    } catch {
        return [
            { status: "Chờ soạn", value: 0 },
            { status: "Đang soạn", value: 0 },
            { status: "Chờ duyệt", value: 0 },
            { status: "Đã soạn xong", value: 0 },
            { status: "Hủy", value: 0 },
        ];
    }
};

// ============================================================
// SUP-SHIPPER
// ============================================================
export const getSupShipperKpiData = async () => {
    try {
        const res = await DashboardService.getSupShipperStats();
        if (res.success && res.data) {
            const d = res.data;
            return {
                orderAssignedShipper: d.orderAssignedShipper ?? 0,
                orderDelivering: d.orderDelivering ?? 0,
                orderDelivered: d.orderDelivered ?? 0,
                totalOrderCancelled: d.totalOrderCancelled ?? 0,
                countTotalShipper: d.countTotalShipper ?? 0,
            };
        }
        throw new Error("Invalid");
    } catch {
        return { orderAssignedShipper: 0, orderDelivering: 0, orderDelivered: 0, totalOrderCancelled: 0, countTotalShipper: 0 };
    }
};

export const getDeliveryProgress = async () => {
    try {
        const res = await DashboardService.getOrderDelivery();
        if (res.success && Array.isArray(res.data)) {
            const statusMap: Record<string, string> = {
                assigned: "Đã phân công",
                in_progress: "Đang giao",
                completed: "Hoàn thành",
            };
            const dataMap: Record<string, number> = {};
            res.data.forEach((item: any) => {
                const vn = statusMap[item.status] || item.status;
                dataMap[vn] = item.count;
            });
            return [
                { status: "Đã phân công", value: dataMap["Đã phân công"] || 0 },
                { status: "Đang giao", value: dataMap["Đang giao"] || 0 },
                { status: "Hoàn thành", value: dataMap["Hoàn thành"] || 0 },
            ];
        }
        throw new Error("Invalid");
    } catch {
        return [
            { status: "Đã phân công", value: 0 },
            { status: "Đang giao", value: 0 },
            { status: "Hoàn thành", value: 0 },
        ];
    }
};
