import { getListSalesOrders } from "@/services/salesOrdersService";
import { socket } from "@/utils/socketManager";
import { useCallback, useEffect, useRef, useState } from "react";

const ORDER_STATUS_LIST = ["pending_preparation", "assigned_preparation"];

const PAGE_LIMIT = 15;

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  remain: number;
  [key: string]: any;
}

export interface SalesOrder {
  id: string;
  orderNo: string;
  customerName: string;
  departmentName: string;
  departmentId: string;
  slaDeliveryAt?: string;
  note?: string;
  items: OrderItem[];
  [key: string]: any;
}

export const useOrderList = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Dùng refs để tránh stale closures và infinite dependency loops
  const offsetRef = useRef(0);
  const searchRef = useRef("");
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);

  // fetchOrders không có deps — dùng refs thay vì state trong logic điều kiện
  const fetchOrders = useCallback(async (q: string, append: boolean) => {
    if (append && !hasMoreRef.current) return;
    if (loadingRef.current) return;

    const offset = append ? offsetRef.current : 0;

    loadingRef.current = true;
    if (!append) setLoading(true);

    try {
      const res = await getListSalesOrders({
        status: ORDER_STATUS_LIST,
        q: q || undefined,
        limit: PAGE_LIMIT,
        offset,
      });

      const data: SalesOrder[] = res.data?.data || [];
      const pagination = res.data?.pagination;

      // lọc chỉ lấy đơn có ít nhất 1 item còn remain > 0
      const filtered = data.filter((o: SalesOrder) =>
        o.items?.some((i: OrderItem) => i.remain > 0),
      );

      if (append) {
        setOrders((prev) => [...prev, ...filtered]);
      } else {
        setOrders(filtered);
        offsetRef.current = 0;
      }

      const nextOffset = offset + data.length;
      offsetRef.current = nextOffset;

      const total = pagination?.total ?? 0;
      const newHasMore =
        total > 0 ? nextOffset < total : data.length === PAGE_LIMIT;
      hasMoreRef.current = newHasMore;
      setHasMore(newHasMore);
    } catch (err) {
      console.error("useOrderList fetchOrders error:", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []); // Không có deps — dùng refs

  const loadInitial = useCallback(() => {
    offsetRef.current = 0;
    hasMoreRef.current = true;
    setHasMore(true);
    fetchOrders(searchRef.current, false);
  }, [fetchOrders]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;
    fetchOrders(searchRef.current, true);
  }, [fetchOrders]);

  const search = useCallback(
    (q: string) => {
      searchRef.current = q;
      offsetRef.current = 0;
      hasMoreRef.current = true;
      setHasMore(true);
      fetchOrders(q, false);
    },
    [fetchOrders],
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    offsetRef.current = 0;
    hasMoreRef.current = true;
    setHasMore(true);
    await fetchOrders(searchRef.current, false);
    setRefreshing(false);
  }, [fetchOrders]);

  // Realtime logic
  useEffect(() => {
    const isValidOrder = (order: SalesOrder) => {
      const hasStatus = ORDER_STATUS_LIST.includes(order.status);
      const hasRemaining = order.items?.some((i: OrderItem) => i.remain > 0);
      
      // Nếu có search keyword, kiểm tra xem orderNo hoặc customerName có khớp ko (case-insensitive)
      if (searchRef.current) {
        const q = searchRef.current.toLowerCase();
        const matchesOrderNo = order.orderNo?.toLowerCase().includes(q);
        const matchesCustomer = order.customerName?.toLowerCase().includes(q);
        if (!matchesOrderNo && !matchesCustomer) return false;
      }

      return hasStatus && !!hasRemaining;
    };

    const handleCreated = (newOrder: SalesOrder) => {
      if (isValidOrder(newOrder)) {
        setOrders((prev) => {
          // Tránh lặp
          if (prev.some((o) => o.id === newOrder.id)) return prev;
          return [newOrder, ...prev];
        });
      }
    };

    const handleUpdated = (updatedOrder: SalesOrder) => {
      setOrders((prev) => {
        const index = prev.findIndex((o) => o.id === updatedOrder.id);
        
        if (index !== -1) {
          // Gộp dữ liệu cũ và mới để tránh mất thông tin khi nhận partial update
          const merged = { ...prev[index], ...updatedOrder };
          const valid = isValidOrder(merged);

          if (valid) {
            const next = [...prev];
            next[index] = merged;
            return next;
          } else {
            return prev.filter((o) => o.id !== updatedOrder.id);
          }
        } else {
          // Nếu chưa có trong danh sách hiện tại nhưng sau khi update lại hợp lệ
          if (isValidOrder(updatedOrder)) {
            return [updatedOrder, ...prev];
          }
        }
        return prev;
      });
    };

    const handleDeleted = ({ id }: { id: string }) => {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    };

    socket.on("sales_orders_created", handleCreated);
    socket.on("sales_orders_updated", handleUpdated);
    socket.on("sales_orders_deleted", handleDeleted);

    return () => {
      socket.off("sales_orders_created", handleCreated);
      socket.off("sales_orders_updated", handleUpdated);
      socket.off("sales_orders_deleted", handleDeleted);
    };
  }, []); // [] vì searchRef là ref, setOrders ổn định

  return {
    orders,
    loading,
    refreshing,
    hasMore,
    loadInitial,
    loadMore,
    search,
    refresh,
  };
};
