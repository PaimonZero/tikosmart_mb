import { InvoiceProductRow } from "@/components/sales-orders/SalesOrdersDetail/InvoiceProductRow";
import { SalesOrderInvoiceSkeleton } from "@/components/sales-orders/SalesOrdersDetail/SalesOrderInvoiceSkeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSalesInvoiceByOrderId } from "@/store/salesInvoicesSlice";
import { formatCurrency, formatDate, formatTax, getInvoiceStatus } from "@/utils/invoiceHelpers";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
    ScrollView,
    Text,
    View
} from "react-native";


// Map color name → bg/text hex cho badge
const COLOR_HEX: Record<string, { bg: string; textColor: string }> = {
    green: { bg: "#D1FAE5", textColor: "#065F46" },
    blue: { bg: "#DBEAFE", textColor: "#1D4ED8" },
    red: { bg: "#FEE2E2", textColor: "#B91C1C" },
    orange: { bg: "#FEF3C7", textColor: "#B45309" },
    gray: { bg: "#F3F4F6", textColor: "#374151" },
};

// ─── Sub components ──────────────────────────────────────────────────────────

/** Divider row in totals section */
const TotalRow = ({
    label,
    value,
    bold,
    labelColor,
    valueColor,
    large,
}: {
    label: string;
    value: string;
    bold?: boolean;
    labelColor?: string;
    valueColor?: string;
    large?: boolean;
}) => (
    <View className="flex-row justify-between items-center py-2">
        <Text
            style={{ color: labelColor ?? "#6B7280", fontSize: large ? 16 : 14, fontWeight: bold ? "700" : "400" }}
        >
            {label}
        </Text>
        <Text
            style={{ color: valueColor ?? "#111827", fontSize: large ? 16 : 14, fontWeight: bold ? "700" : "500" }}
        >
            {value}
        </Text>
    </View>
);

/** Empty state when no invoice found */
const EmptyInvoice = () => (
    <View className="flex-1 items-center justify-center pt-24 px-8">
        <View
            className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4"
        >
            <Ionicons name="receipt-outline" size={38} color="#9CA3AF" />
        </View>
        <Text className="text-gray-500 text-base font-semibold text-center">
            Chưa có hóa đơn
        </Text>
        <Text className="text-gray-400 text-sm text-center mt-1">
            Hóa đơn chưa được tạo cho đơn hàng này
        </Text>
    </View>
);

// ─── Main component ───────────────────────────────────────────────────────────
interface SalesOrderInvoiceTabProps {
    orderId: string;
}

export const SalesOrderInvoiceTab = ({ orderId }: SalesOrderInvoiceTabProps) => {
    const dispatch = useAppDispatch();
    const { salesInvoiceByOrderId, fetchByOrderIdStatus, fetchByOrderIdError } =
        useAppSelector((state) => state.salesInvoices);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchSalesInvoiceByOrderId(orderId));
        }
    }, [orderId]);

    // ── Loading ──────────────────────────────────────────────────────────────
    if (fetchByOrderIdStatus === "loading") {
        return <SalesOrderInvoiceSkeleton />;
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (fetchByOrderIdStatus === "failed") {
        return (
            <View className="flex-1 items-center justify-center pt-24 px-8">
                <Ionicons name="alert-circle-outline" size={40} color="#EF4444" />
                <Text className="text-red-500 text-sm font-medium mt-3 text-center">
                    {fetchByOrderIdError || "Không thể tải hóa đơn"}
                </Text>
            </View>
        );
    }

    // Normalize: API trả về mảng hoặc object
    const invoiceList = Array.isArray(salesInvoiceByOrderId)
        ? salesInvoiceByOrderId
        : salesInvoiceByOrderId && Object.keys(salesInvoiceByOrderId).length
            ? [salesInvoiceByOrderId]
            : [];

    // ── No invoice ───────────────────────────────────────────────────────────
    if (invoiceList.length === 0) {
        return <EmptyInvoice />;
    }

    // Render first invoice (primary invoice for the order)
    const invoice = invoiceList[0] as any;
    const status = getInvoiceStatus(invoice.status);
    const badgeColors = COLOR_HEX[status.color] ?? COLOR_HEX.gray;
    const taxAmount = (invoice.subtotal ?? 0) * (invoice.taxAmount ?? 0);

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32, paddingTop: 4 }}
        >
            {/* ── Card 1: Invoice Header ───────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-4 rounded-2xl px-4 py-4"
                style={{ elevation: 2, gap: 8 }}
            >
                {/* Status badge + title */}
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-gray-400 text-sm font-medium uppercase tracking-widest">
                            Hóa đơn bán hàng
                        </Text>
                        <Text className="text-gray-900 font-bold text-xl mt-0.5">
                            #{invoice.invoiceNo ?? "—"}
                        </Text>
                    </View>
                    <View
                        style={{ backgroundColor: badgeColors.bg }}
                        className="px-3 py-1.5 rounded-full"
                    >
                        <Text style={{ color: badgeColors.textColor }} className="text-sm font-semibold">
                            {status.text}
                        </Text>
                    </View>
                </View>

                {/* Date row */}
                <View className="flex-row" style={{ gap: 20 }}>
                    <View>
                        <Text className="text-gray-400 text-sm">Ngày tạo</Text>
                        <Text className="text-gray-700 text-base font-medium mt-0.5">
                            {formatDate(invoice.createdAt)}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-sm">Cập nhật</Text>
                        <Text className="text-gray-700 text-base font-medium mt-0.5">
                            {formatDate(invoice.updatedAt)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ── Card 2: Parties ──────────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-3 rounded-2xl overflow-hidden"
                style={{ elevation: 2 }}
            >
                {/* Seller */}
                <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                        <Ionicons name="storefront-outline" size={20} color="#2563EB" />
                    </View>
                    <View>
                        <Text className="text-gray-400 text-sm uppercase tracking-wide">Bên bán</Text>
                        <Text className="text-gray-800 font-semibold text-base mt-0.5">
                            Cửa hàng Tikosmart
                        </Text>
                    </View>
                </View>

                {/* Customer */}
                <View className="flex-row items-center px-4 py-3">
                    <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-3">
                        <Ionicons name="person-outline" size={20} color="#4F46E5" />
                    </View>
                    <View>
                        <Text className="text-gray-400 text-sm uppercase tracking-wide">Khách hàng</Text>
                        <Text className="text-gray-800 font-semibold text-base mt-0.5">
                            {invoice.customerName ?? "—"}
                        </Text>
                        <Text className="text-gray-400 text-sm mt-0.5">
                            Mã đơn hàng: {invoice.orderNo ?? "—"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ── Card 3: Products ─────────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-3 rounded-2xl px-4"
                style={{ elevation: 2 }}
            >
                <Text className="text-gray-500 text-sm font-semibold uppercase tracking-widest pt-4 pb-2">
                    Danh sách sản phẩm ({invoice.items?.length ?? 0})
                </Text>

                {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item: any, idx: number) => (
                        <InvoiceProductRow
                            key={item.id ?? idx}
                            imgUrl={item.imgUrl}
                            productName={item.productName}
                            skuCode={item.skuCode}
                            qty={item.qty}
                            postQty={item.postQty}
                            unitPrice={item.unitPrice}
                        />
                    ))
                ) : (
                    <Text className="text-gray-400 text-sm py-4 text-center">
                        Không có sản phẩm
                    </Text>
                )}

                {/* Padding bottom */}
                <View style={{ height: 4 }} />
            </View>

            {/* ── Card 4: Totals ───────────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-3 rounded-2xl px-4 pt-4 pb-2"
                style={{ elevation: 2 }}
            >
                <Text className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-2">
                    Tổng kết
                </Text>

                <TotalRow label="Tổng tiền hàng" value={formatCurrency(invoice.subtotal)} />
                <TotalRow
                    label={`Thuế (${formatTax(invoice.taxAmount)})`}
                    value={formatCurrency(taxAmount)}
                />
                <TotalRow label="Chiết khấu" value={`-${formatCurrency(invoice.discountAmount)}`} valueColor="#EF4444" />
                <TotalRow label="Phụ phí" value={formatCurrency(invoice.surcharge)} />

                {/* Divider */}
                <View className="border-t border-gray-200 my-2" />

                <TotalRow
                    label="TỔNG CỘNG"
                    value={formatCurrency(invoice.total)}
                    bold
                    large
                    valueColor="#2563EB"
                />

                {/* Paid banner */}
                <View
                    className="flex-row justify-between items-center px-3 py-2.5 rounded-xl mt-2"
                    style={{ backgroundColor: "#F0FDF4" }}
                >
                    <View className="flex-row items-center" style={{ gap: 6 }}>
                        <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
                        <Text style={{ color: "#15803D", fontSize: 13 }}>Đã thanh toán</Text>
                    </View>
                    <Text style={{ color: "#15803D", fontWeight: "700", fontSize: 13 }}>
                        {formatCurrency(invoice.receivedIn)}
                    </Text>
                </View>

                {/* Remaining banner */}
                <View
                    className="flex-row justify-between items-center px-3 py-2.5 rounded-xl mt-2 mb-2"
                    style={{ backgroundColor: "#FFF1F2" }}
                >
                    <View className="flex-row items-center" style={{ gap: 6 }}>
                        <Ionicons name="alert-circle" size={16} color="#DC2626" />
                        <Text style={{ color: "#DC2626", fontSize: 13 }}>Còn nợ</Text>
                    </View>
                    <Text style={{ color: "#DC2626", fontWeight: "700", fontSize: 13 }}>
                        {formatCurrency(invoice.remainingReceivables)}
                    </Text>
                </View>
            </View>

            {/* ── Card 5: Notes ────────────────────────────────────────────── */}
            <View
                className="bg-white mx-4 mt-3 rounded-2xl px-4 py-4"
                style={{ elevation: 2 }}
            >
                <View className="flex-row items-center" style={{ gap: 6, marginBottom: 8 }}>
                    <Ionicons name="document-text-outline" size={18} color="#6B7280" />
                    <Text className="text-gray-500 text-sm font-semibold uppercase tracking-widest">
                        Ghi chú
                    </Text>
                </View>
                <Text className="text-gray-400 text-base leading-6">
                    Hóa đơn được tạo tự động từ đơn hàng #{invoice.orderNo ?? "—"}.
                </Text>

                {/* Payment meta */}
                <View className="flex-row mt-4" style={{ gap: 24 }}>
                    <View>
                        <Text className="text-gray-400 text-sm">Thanh toán gần nhất</Text>
                        <Text className="text-gray-700 text-base font-medium mt-0.5">
                            {formatDate(invoice.lastPaymentAt)}
                        </Text>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-sm">Đã hoàn tiền</Text>
                        <Text className="text-gray-700 text-base font-medium mt-0.5">
                            {formatCurrency(invoice.refundedOut)}
                        </Text>
                    </View>
                </View>

                {invoice.approvedReturns != null && (
                    <View className="mt-4">
                        <Text className="text-gray-400 text-sm">
                            Tổng hàng trả đã duyệt
                        </Text>
                        <Text className="text-gray-700 text-base font-medium mt-0.5">
                            {formatCurrency(invoice.approvedReturns)}
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
