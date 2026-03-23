import { getListUsers } from "@/services/userService";
import { useCallback, useRef, useState } from "react";

const PAGE_LIMIT = 20;

export interface PickerUser {
  id: string;
  username: string;
  role: string;
  [key: string]: any;
}

export const usePickerList = () => {
  const [pickers, setPickers] = useState<PickerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const searchRef = useRef("");

  const fetchPickers = useCallback(
    async (q: string, append: boolean) => {
      if (append && !hasMore) return;

      const offset = append ? offsetRef.current : 0;
      setLoading(true);

      try {
        const res = await getListUsers({
          role: "picker",
          q: q || undefined,
          limit: PAGE_LIMIT,
          offset,
        });

        const data: PickerUser[] = res.data?.data || [];
        const pagination = res.data?.pagination;

        if (append) {
          setPickers((prev) => [...prev, ...data]);
        } else {
          setPickers(data);
          offsetRef.current = 0;
        }

        const nextOffset = offset + data.length;
        offsetRef.current = nextOffset;

        const hasMoreFlag =
          pagination?.hasMore ?? nextOffset < (pagination?.total ?? 0);
        setHasMore(hasMoreFlag);
      } catch (err) {
        console.error("usePickerList fetchPickers error:", err);
      } finally {
        setLoading(false);
      }
    },
    [hasMore],
  );

  const loadInitial = useCallback(() => {
    offsetRef.current = 0;
    setHasMore(true);
    fetchPickers(searchRef.current, false);
  }, [fetchPickers]);

  const loadMore = useCallback(() => {
    if (!loading) {
      fetchPickers(searchRef.current, true);
    }
  }, [loading, fetchPickers]);

  const search = useCallback(
    (q: string) => {
      searchRef.current = q;
      offsetRef.current = 0;
      setHasMore(true);
      fetchPickers(q, false);
    },
    [fetchPickers],
  );

  return {
    pickers,
    loading,
    hasMore,
    loadInitial,
    loadMore,
    search,
  };
};
