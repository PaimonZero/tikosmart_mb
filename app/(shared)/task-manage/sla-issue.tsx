import {
  createSlaExceededIssue,
} from '@/services/issueService';
import { getListUsers } from '@/services/userService';
import { useAppSelector } from '@/store/hooks';
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SendHorizontal } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

// Imported Components
import SlaIssueHeader from '@/components/task-manage/SlaIssue/SlaIssueHeader';
import SlaIssueHero from '@/components/task-manage/SlaIssue/SlaIssueHero';
import SlaIssueSystemInfo from '@/components/task-manage/SlaIssue/SlaIssueSystemInfo';
import SlaIssueAssignees, { AssigneeOption } from '@/components/task-manage/SlaIssue/SlaIssueAssignees';
import SlaIssuePlan from '@/components/task-manage/SlaIssue/SlaIssuePlan';
import AssigneeBottomSheet from '@/components/task-manage/SlaIssue/AssigneeBottomSheet';

export default function SlaIssueScreen() {
  const router = useRouter();
  const assigneeSheetRef = useRef<BottomSheetModal>(null);
  const currentUser = useAppSelector((state) => state.auth.user);

  const {
    orderId,
    orderNo,
    customerName,
    departmentName,
    slaDeliveryAt,
  } = useLocalSearchParams<{
    orderId: string;
    orderNo: string;
    customerName: string;
    departmentName: string;
    slaDeliveryAt: string;
  }>();

  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('high');
  const [proposedSlaAt, setProposedSlaAt] = useState<Date>(dayjs().add(24, 'hour').toDate());
  const [showSlaPicker, setShowSlaPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assignees, setAssignees] = useState<AssigneeOption[]>([]);
  const [assigneeKeyword, setAssigneeKeyword] = useState("");
  const [assigneeOptions, setAssigneeOptions] = useState<AssigneeOption[]>([]);
  const [assigneeLoading, setAssigneeLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const LIMIT = 10;

  const assigneeSnapPoints = useMemo(() => ['62%', '82%'], []);
  const taggedUserIds = useMemo(() => assignees.map((user) => user.id), [assignees]);
  const proposedSla = useMemo(() => dayjs(proposedSlaAt), [proposedSlaAt]);
  const title = useMemo(
    () => `[SLA Quá hạn] Đơn hàng #${orderNo || "-"} — Yêu cầu gia hạn SLA`,
    [orderNo],
  );

  useEffect(() => {
    const loadDefaultAssignees = async () => {
      try {
        const res = await getListUsers({ role: 'admin', limit: 50 });
        const admins = res?.data?.data || [];

        const nextAssignees = admins
          .filter((u: any) => u.id !== currentUser?.id)
          .map((u: any) => ({
            id: u.id,
            fullName: u.fullName || u.username,
            username: u.username,
            avatar: u.avatar,
          }));

        setAssignees(nextAssignees);
      } catch (err) {
        console.error('Failed to preload issue assignees:', err);
        setAssignees([]);
      }
    };

    loadDefaultAssignees();
  }, [currentUser?.id]);

  const fetchAssignees = useCallback(
    async (searchQuery: string, currentOffset: number, isAppend: boolean) => {
      if (isAppend) setIsMoreLoading(true);
      else setAssigneeLoading(true);

      try {
        const res = await getListUsers({
          q: searchQuery.trim() || undefined,
          limit: LIMIT,
          offset: currentOffset,
        });
        const users = (res?.data?.data || []).filter(
          (u: any) => u.id !== currentUser?.id,
        );

        const normalized = users.map((u: any) => ({
          id: u.id,
          fullName: u.fullName || u.username,
          username: u.username,
          avatar: u.avatar,
        }));

        if (isAppend) {
          setAssigneeOptions((prev) => [...prev, ...normalized]);
        } else {
          setAssigneeOptions(normalized);
        }

        setHasMore(res?.data?.pagination?.hasMore ?? false);
      } catch (err) {
        console.error("Failed to search assignees:", err);
        if (!isAppend) setAssigneeOptions([]);
      } finally {
        setIsMoreLoading(false);
        setAssigneeLoading(false);
      }
    },
    [currentUser?.id],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      fetchAssignees(assigneeKeyword, 0, false);
    }, 300);

    return () => clearTimeout(timer);
  }, [assigneeKeyword, fetchAssignees]);

  const handleLoadMore = useCallback(() => {
    if (isMoreLoading || assigneeLoading || !hasMore) return;
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchAssignees(assigneeKeyword, nextOffset, true);
  }, [isMoreLoading, assigneeLoading, hasMore, offset, assigneeKeyword, fetchAssignees]);

  const handleRemoveAssignee = useCallback((userId: string) => {
    setAssignees((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const handleOpenAssigneeSheet = useCallback(() => {
    assigneeSheetRef.current?.present();
  }, []);

  const handleToggleAssignee = useCallback((user: AssigneeOption) => {
    setAssignees((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) return prev.filter((u) => u.id !== user.id);
      return [...prev, user];
    });
  }, []);

  const renderSheetBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.55}
      />
    ),
    []
  );

  const applySlaOffset = useCallback((hours: 12 | 24 | 48) => {
    setProposedSlaAt(dayjs().add(hours, 'hour').toDate());
  }, []);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Vui lòng nhập lý do.");
      return;
    }

    if (!orderId) {
      toast.error("Không tìm thấy mã đơn hàng.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        description: description.trim(),
        severity: severity || "high",
        suggestedSla: proposedSla.toISOString(),
        extraTags: taggedUserIds,
      };

      await createSlaExceededIssue(orderId as string, payload);

      toast.success("Đã gửi yêu cầu thay đổi SLA và khóa đơn hàng.");
      router.back();
    } catch (error: any) {
      console.error("Create SLA issue error:", error);
      toast.error(
        error.response?.data?.message || "Không thể gửi yêu cầu thay đổi SLA.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView className="flex-1 bg-gray-100" edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <SlaIssueHeader onBack={() => router.back()} title="Chi tiết vấn đề SLA" />

        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 6, paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={100}
          keyboardShouldPersistTaps="handled"
        >
          <SlaIssueHero 
            orderNo={orderNo} 
            slaDeliveryAt={slaDeliveryAt} 
            customerName={customerName} 
          />

          <SlaIssueSystemInfo title={title} />

          <SlaIssueAssignees 
            assignees={assignees} 
            onRemove={handleRemoveAssignee} 
            onAdd={handleOpenAssigneeSheet} 
          />

          <SlaIssuePlan 
            proposedSla={proposedSla}
            onOpenPicker={() => setShowSlaPicker(true)}
            applyOffset={applySlaOffset}
            severity={severity}
            setSeverity={setSeverity}
            description={description}
            setDescription={setDescription}
          />
        </KeyboardAwareScrollView>

        <View className="px-5 py-4 border-t border-gray-100 bg-white">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            className={`py-4 rounded-2xl flex-row items-center justify-center shadow-lg ${submitting ? 'bg-gray-400' : 'bg-blue-600'}`}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text className="text-white font-black text-base mr-2 uppercase tracking-tight">Gửi yêu cầu</Text>
                <SendHorizontal size={18} color="#FFF" strokeWidth={2.5} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <AssigneeBottomSheet 
        sheetRef={assigneeSheetRef}
        snapPoints={assigneeSnapPoints}
        backdrop={renderSheetBackdrop}
        keyword={assigneeKeyword}
        onKeywordChange={setAssigneeKeyword}
        options={assigneeOptions}
        selectedAssignees={assignees}
        onToggle={handleToggleAssignee}
        onLoadMore={handleLoadMore}
        loading={assigneeLoading}
        moreLoading={isMoreLoading}
      />

      <DateTimePickerModal
        isVisible={showSlaPicker}
        mode="datetime"
        date={proposedSlaAt}
        onConfirm={(date) => {
          setShowSlaPicker(false);
          setProposedSlaAt(date);
        }}
        onCancel={() => setShowSlaPicker(false)}
        minimumDate={new Date()}
      />
    </BottomSheetModalProvider>
  );
}
