import DashboardService from "@/services/dashboardService";

// Admin dashboard data fetching functions

export type RevenueFilter = "week" | "month" | "year";

export interface RevenueParams {
    filter: RevenueFilter;
    week?: number;
    month?: number;
    year: number;
}

export interface RevenueApiItem {
    label: string;
    revenue: number;
}

export interface RevenueChartItem {
    label: string;
    revenue: number;
}

export interface RevenueApiResponse {
    success: boolean;
    filter: RevenueFilter;
    year: number;
    data: RevenueApiItem[];
}

export const getKpiData = async () => {
    try {
        const res = await DashboardService.getAdminStats();

        if (res.success && res.data) {
            const data = res.data;

            return {
                totalUsers: data.total_users ?? 0,
                totalOrders: data.total_orders ?? 0,
                totalRevenue: 125600,
                totalProducts: data.total_products ?? 0,
                totalCustomer: data.total_customers ?? 0,
                totalSuppliers: data.total_suppliers ?? 0,

                // lấy từ supplier_transactions
                totalIn: data.supplier_transactions?.totalIn ?? 0,
                totalOut: data.supplier_transactions?.totalOut ?? 0,
            };
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error loading KPI data:', error);

        // fallback mock nếu API lỗi
        return {
            totalUsers: 0,
            totalOrders: 0,
            totalRevenue: 125600,
            totalProducts: 0,
            totalCustomer: 0,
            totalSuppliers: 0,
            totalIn: 0,
            totalOut: 0,
        };
    }
};

export const getRevenueTimeline = async (
    params: RevenueParams
): Promise<RevenueChartItem[]> => {
    try {
        const res: RevenueApiResponse =
            await DashboardService.getTotalRevenue(params);

        if (res?.success && Array.isArray(res.data)) {
            const formatted: RevenueChartItem[] = res.data.map((item) => {
                let label = item.label;

                if (params.filter === "week") {
                    const dayMap: Record<string, string> = {
                        D1: "Thứ 2",
                        D2: "Thứ 3",
                        D3: "Thứ 4",
                        D4: "Thứ 5",
                        D5: "Thứ 6",
                        D6: "Thứ 7",
                        D7: "Chủ nhật",
                    };

                    label = dayMap[item.label] ?? item.label;
                }

                if (params.filter === "month") {
                    const weekNum = item.label.replace("W", "");
                    label = `Tuần ${weekNum}`;
                }

                if (params.filter === "year") {
                    const monthNum = item.label.replace("T", "");
                    label = `Tháng ${monthNum}`;
                }

                return {
                    label,
                    revenue: Number(item.revenue) || 0,
                };
            });

            return formatted;
        }

        throw new Error("Invalid API response structure");
    } catch (error) {
        console.error("Error loading revenue timeline:", error);
        throw error;
    }
};

