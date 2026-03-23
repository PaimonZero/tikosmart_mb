import { getListSalesOrders } from "@/services/salesOrdersService";
import { useCallback, useRef, useState } from "react";

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
        status: ["pending_preparation", "assigned_preparation"],
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
