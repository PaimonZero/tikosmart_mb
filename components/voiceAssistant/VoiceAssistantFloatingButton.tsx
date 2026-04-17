import {
  processVoiceCommand,
  transcribeAudioUri,
  type VoiceRole,
} from "@/services/voiceAssistantService";
import { useAppSelector } from "@/store/hooks";
import { loadVoiceButtonPosition, saveVoiceButtonPosition } from "@/utils/voiceAssistantPosition";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { usePathname, useRouter } from "expo-router";
import {
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Square,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  AppState,
  Dimensions,
  Keyboard,
  PanResponder,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { toast } from "sonner-native";

type VoiceState =
    | "idle"
    | "preparing"
    | "listening"
    | "transcribing"
    | "stopped"
    | "processing";

const BUTTON_SIZE = 58;
const EDGE_PADDING = 16;
const POPUP_HEIGHT = 270;
const POPUP_GAP = 12;
const TAP_MOVE_THRESHOLD = 4;
const ALLOWED_ROLES = ["admin", "picker", "shipper"];

const normalizePathname = (pathname: string) => {
  const normalized = pathname
    .split("?")[0]
    .replace(/\/\([^/]+\)/g, "")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "")
    .toLowerCase();

  return normalized || "/";
};

const ROOT_ROUTE_ROLE_MAP: Record<string, VoiceRole> = {
  "/deliveryruns": "shipper",
  "/delivery-runs": "shipper",
  "/delivery-runs/deliveryrunlist": "shipper",
  "/taskmanage": "picker",
  "/task-manage": "picker",
  "/task-manage/index": "picker",
};

const routeToVoiceRole = (pathname: string): VoiceRole | null => {
  const normalized = normalizePathname(pathname);
  return ROOT_ROUTE_ROLE_MAP[normalized] ?? null;
};

const isAllowedRoute = (pathname: string) => routeToVoiceRole(pathname) !== null;

const getDefaultPosition = () => {
  const { width, height } = Dimensions.get("window");
  return {
    x: Math.max(EDGE_PADDING, width - BUTTON_SIZE - EDGE_PADDING),
    y: Math.max(EDGE_PADDING + 48, height - BUTTON_SIZE - 140),
  };
};

const clampPosition = (x: number, y: number) => {
  const { width, height } = Dimensions.get("window");
  const minX = EDGE_PADDING;
  const minY = EDGE_PADDING + 48;
  const maxX = Math.max(minX, width - BUTTON_SIZE - EDGE_PADDING);
  const maxY = Math.max(minY, height - BUTTON_SIZE - EDGE_PADDING - 70);

  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
};

export default function VoiceAssistantFloatingButton() {
  const router = useRouter();
  const pathname = usePathname();
  const currentRole = useAppSelector((state) => state.auth.user?.role || "");
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [buttonPos, setButtonPos] = useState(getDefaultPosition());
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const position = useRef(new Animated.ValueXY(getDefaultPosition())).current;
  const panStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const prepareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const sessionRef = useRef(0);
  const fallbackUriRef = useRef<string | null>(null);

  const isPreparing = voiceState === "preparing";
  const isListening = voiceState === "listening";
  const isTranscribing = voiceState === "transcribing";
  const isStopped = voiceState === "stopped";
  const isProcessing = voiceState === "processing";

  const statusMessage = isProcessing
    ? "Đang xử lý..."
    : isPreparing
      ? "Chuẩn bị ghi âm..."
      : isTranscribing
        ? "Đang nhận dạng giọng nói..."
        : isListening
          ? "Đang lắng nghe. Văn bản sẽ hiển thị sau khi bạn bấm nút 'Dừng'."
          : isStopped
            ? "Hoàn tất. Bạn có thể chỉnh sửa trước khi gửi"
            : "Chạm để nói";

  const allowed = useMemo(() => {
    const routeAllowed = isAllowedRoute(pathname || "");
    const roleAllowed = ALLOWED_ROLES.includes(String(currentRole || ""));
    return routeAllowed && roleAllowed;
  }, [pathname, currentRole]);

  const clearPrepareTimeout = useCallback(() => {
    if (!prepareTimeoutRef.current) return;
    clearTimeout(prepareTimeoutRef.current);
    prepareTimeoutRef.current = null;
  }, []);

  const releaseRecording = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.stopAndUnloadAsync();
    } catch {
      // ignore stop race
    }
    recordingRef.current = null;
  }, []);

  const cleanupSession = useCallback(async () => {
    clearPrepareTimeout();
    sessionRef.current += 1;
    fallbackUriRef.current = null;
    await releaseRecording();
    setVoiceState("idle");
  }, [clearPrepareTimeout, releaseRecording]);

  useEffect(() => {
    loadVoiceButtonPosition()
        .then((saved) => {
          const next = saved ? clampPosition(saved.x, saved.y) : getDefaultPosition();
          position.setValue(next);
          setButtonPos(next);
        })
        .catch(() => {
          const next = getDefaultPosition();
          position.setValue(next);
          setButtonPos(next);
        });
  }, [position]);

  // Keyboard height sync
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => setKeyboardHeight(e.endCoordinates.height);
    const onHide = () => setKeyboardHeight(0);

    const sub1 = Keyboard.addListener(showEvent, onShow);
    const sub2 = Keyboard.addListener(hideEvent, onHide);
    return () => {
      sub1.remove();
      sub2.remove();
    };
  }, []);

  useEffect(() => {
    if (!allowed && isOpen) {
      setIsOpen(false);
      void cleanupSession();
    }
  }, [allowed, isOpen, cleanupSession]);

  useEffect(() => {
    return () => {
      void cleanupSession();
    };
  }, [cleanupSession]);

  const startFallbackRecording = useCallback(async () => {
    const rec = new Audio.Recording();
    recordingRef.current = rec;
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
  }, []);

  const waitForAppToBeActive = useCallback((timeoutMs = 2500) => {
    if (AppState.currentState === "active") {
      return Promise.resolve(true);
    }

    return new Promise<boolean>((resolve) => {
      let done = false;

      const finish = (ok: boolean) => {
        if (done) return;
        done = true;
        sub.remove();
        clearTimeout(timer);
        resolve(ok);
      };

      const sub = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          finish(true);
        }
      });

      const timer = setTimeout(() => finish(false), timeoutMs);
    });
  }, []);

  const startListening = useCallback(async () => {
    if (["listening", "transcribing", "processing"].includes(voiceState)) return;

    try {
      const currentPermission = await Audio.getPermissionsAsync();
      let granted = currentPermission.granted;
      let grantedNow = false;

      if (!granted && currentPermission.canAskAgain) {
        const requested = await Audio.requestPermissionsAsync();
        granted = requested.granted;
        grantedNow = requested.granted;
      }

      if (!granted) {
        toast.error("Không thể truy cập microphone");
        setVoiceState("idle");
        return;
      }

      // iOS can briefly move app to background while permission alert is handled.
      const appIsActive = await waitForAppToBeActive(grantedNow ? 3500 : 1500);
      if (!appIsActive) {
        toast.warning("Ứng dụng vừa cấp quyền microphone. Vui lòng bấm lại để ghi âm.");
        setVoiceState("idle");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: false,
      });

      const sessionId = ++sessionRef.current;
      setTranscript("");
      fallbackUriRef.current = null;
      setVoiceState("listening");

      if (Platform.OS === "ios") {
        const stillActive = await waitForAppToBeActive(1200);
        if (!stillActive) {
          setVoiceState("idle");
          return;
        }
      }

      if (sessionId === sessionRef.current) {
        await startFallbackRecording();
      }
    } catch (err: any) {
      const message = String(err?.message || "");
      if (message.toLowerCase().includes("currently in the background")) {
        toast.warning("Ứng dụng vừa cấp quyền microphone. Vui lòng thử lại.");
      } else {
        toast.error("Lỗi microphone", {
          description: message || "Không thể khởi tạo ghi âm.",
        });
      }
      setVoiceState("idle");
    }
  }, [startFallbackRecording, voiceState, waitForAppToBeActive]);

  const startListeningWithDelay = useCallback(() => {
    if (["preparing", "listening", "transcribing", "processing"].includes(voiceState)) return;

    clearPrepareTimeout();
    setVoiceState("preparing");
    setTranscript("");

    prepareTimeoutRef.current = setTimeout(() => {
      prepareTimeoutRef.current = null;
      void startListening();
    }, 1200);
  }, [clearPrepareTimeout, startListening, voiceState]);

  const stopListening = useCallback(async () => {
    if (voiceState !== "listening") return;

    setVoiceState("transcribing");

    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        fallbackUriRef.current = recordingRef.current.getURI();
        recordingRef.current = null;
      }

      if (!fallbackUriRef.current) {
        setVoiceState("stopped");
        return;
      }

      const stt = await transcribeAudioUri(fallbackUriRef.current);
      setTranscript(stt?.transcript || "");
      setVoiceState("stopped");
    } catch (err: any) {
      toast.error("Lỗi nhận dạng giọng nói", {
        description: err?.message || "Không thể chuyển giọng nói thành văn bản.",
      });
      setVoiceState("stopped");
    }
  }, [voiceState]);

  const handleRetry = useCallback(() => {
    if (isPreparing || isTranscribing || isProcessing) return;
    sessionRef.current += 1;
    setTranscript("");
    setVoiceState("idle");
    startListeningWithDelay();
  }, [isPreparing, isProcessing, isTranscribing, startListeningWithDelay]);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    void cleanupSession();
    setTranscript("");
  }, [cleanupSession]);

  const handleSend = useCallback(async () => {
    const text = transcript.trim();
    if (!text) return;

    const role = routeToVoiceRole(pathname || "");
    if (!role) {
      toast.warning("Trợ lý giọng nói chỉ hỗ trợ màn hình task-manage và delivery-runs.");
      return;
    }

    setVoiceState("processing");

    try {
      const result = await processVoiceCommand(text, role);
      if (!result.success) {
        toast.warning("Không thể xử lý", {
          description: result.message || "Vui lòng thử lại.",
        });
        setVoiceState("stopped");
        return;
      }

      if (!result.matchedRecord) {
        toast("Không tìm thấy dữ liệu", {
          description: result.message || "Không tìm thấy bản ghi phù hợp.",
        });
        setVoiceState("stopped");
        return;
      }

      const nonce = String(Date.now());

      if (role === "picker") {
        router.push({
          pathname: "/(shared)/task-manage/[id]",
          params: {
            id: String(result.matchedRecord.id),
            voiceTab: "items",
            voiceNonce: nonce,
          },
        } as any);
      } else if (result.matchedOrder) {
        router.push({
          pathname: "/(shared)/delivery-runs/[id]",
          params: {
            id: String(result.matchedRecord.id),
            voiceOrderId: String(result.matchedOrder.id),
            voiceAmount:
                result.intent?.amount !== null && result.intent?.amount !== undefined
                    ? String(result.intent.amount)
                    : "",
            voiceNote: result.intent?.note ? String(result.intent.note) : "",
            voiceOpenQR: result.intent?.action === "open_qr" ? "1" : "0",
            voiceAction: result.intent?.action ? String(result.intent.action) : "",
            voiceNonce: nonce,
          },
        } as any);
      } else {
        router.push({
          pathname: "/(shared)/delivery-runs/[id]",
          params: { id: String(result.matchedRecord.id), voiceNonce: nonce },
        } as any);
      }

      closePopup();
      toast.success("Đã xử lý lệnh giọng nói");
    } catch (err: any) {
      toast.error("Lỗi xử lý lệnh giọng nói", {
        description: err?.response?.data?.message || err?.message || "Đã xảy ra lỗi.",
      });
      setVoiceState("stopped");
    }
  }, [closePopup, pathname, router, transcript]);

  const panResponder = useMemo(
      () =>
          PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
              hasMovedRef.current = false;
              const current = (position as any).__getValue?.() || { x: 0, y: 0 };
              panStartRef.current = { x: current.x, y: current.y };
            },
            onPanResponderMove: (_evt, gestureState) => {
              const moved =
                  Math.abs(gestureState.dx) > TAP_MOVE_THRESHOLD ||
                  Math.abs(gestureState.dy) > TAP_MOVE_THRESHOLD;
              if (moved) hasMovedRef.current = true;

              const next = clampPosition(
                  panStartRef.current.x + gestureState.dx,
                  panStartRef.current.y + gestureState.dy,
              );
              position.setValue(next);
              setButtonPos(next);
            },
            onPanResponderRelease: async (_evt, gestureState) => {
              const next = clampPosition(
                  panStartRef.current.x + gestureState.dx,
                  panStartRef.current.y + gestureState.dy,
              );
              position.setValue(next);
              setButtonPos(next);
              try {
                await saveVoiceButtonPosition(next);
              } catch {
                // Ignore persistence errors
              }

              if (!hasMovedRef.current) {
                setIsOpen((prev) => !prev); // Loại bỏ đo toạ độ thừa ở đây
              }
            },
          }),
      [position],
  );

  if (!allowed) return null;

  const screenHeight = Dimensions.get("window").height;
  const measuredY = buttonPos.y; // Neo trực tiếp theo state của button, cập nhật realtime khi kéo

  const preferBelow = measuredY <= screenHeight / 2;

  // Tính toán vị trí đáy thấp nhất của Modal để dịch chuyển Keyboard cho đúng
  const popupBottomY = preferBelow
      ? measuredY + BUTTON_SIZE + POPUP_GAP + POPUP_HEIGHT
      : measuredY - POPUP_GAP;

  const keyboardTop = screenHeight - keyboardHeight;
  const isObscured = keyboardHeight > 0 && popupBottomY > keyboardTop - POPUP_GAP;

  // Dịch toàn bộ cụm modal lên trên nếu bị phím che khuất
  const kbOffset = isObscured ? popupBottomY - (keyboardTop - POPUP_GAP) : 0;
  const effectiveY = measuredY - kbOffset;

  return (
      <>
        {isOpen && (
            <View
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
                pointerEvents="box-none"
            >
              <Pressable
                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.25)" }}
                  onPress={() => Keyboard.dismiss()}
              />

              {/* Anchor Wrapper: Neo đúng vị trí effectiveY */}
              <View
                  style={{ position: "absolute", top: effectiveY, left: EDGE_PADDING, right: EDGE_PADDING }}
                  pointerEvents="box-none"
              >
                <View
                    className="bg-white rounded-2xl shadow-xl border border-slate-200"
                    style={{
                      ...(preferBelow
                          ? { marginTop: BUTTON_SIZE + POPUP_GAP } // Icon nửa trên -> Nằm dưới icon
                          : { position: "absolute", bottom: "100%", left: 0, right: 0, marginBottom: POPUP_GAP }), // Icon nửa dưới -> Nằm trên icon
                      minHeight: POPUP_HEIGHT,
                    }}
                >
                  {/* Thay thế KeyboardAvoidingView thành View thường vì đã xử lý qua biến kbOffset */}
                  <View style={{ flex: 1 }}>
                    <View className="flex-1 p-4">
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-base font-bold text-slate-900">Trợ lý giọng nói</Text>
                        <Pressable onPress={closePopup}>
                          <X size={18} color="#0f172a" />
                        </Pressable>
                      </View>

                      <TextInput
                          multiline
                          numberOfLines={3}
                          value={transcript}
                          onChangeText={setTranscript}
                          editable={isStopped || isProcessing || isTranscribing}
                          placeholder="Văn bản trích xuất từ giọng nói sẽ hiển thị tại đây."
                          className="min-h-[88px] border border-slate-200 rounded-xl p-3 text-slate-900 bg-slate-50"
                          textAlignVertical="top"
                      />

                      {(isPreparing || isListening || isTranscribing) && (
                        <Text className="text-xs text-amber-600 mt-2">
                          Lưu ý: Ứng dụng tạm thời chưa thể hiển thị real-time. Bạn cần bấm nút 'Dừng' để hiển thị văn bản.
                        </Text>
                      )}

                      <Text className="text-xs text-slate-500 mt-2">
                        {statusMessage}
                      </Text>

                      <View className="items-center mt-4">
                        {isProcessing || isPreparing || isTranscribing ? (
                            <View className="w-16 h-16 rounded-full bg-blue-600 items-center justify-center">
                              <ActivityIndicator color="#fff" />
                            </View>
                        ) : isListening ? (
                            <Pressable
                                onPress={() => void stopListening()}
                                className="w-16 h-16 rounded-full bg-red-500 items-center justify-center"
                            >
                              <Square size={22} color="#fff" />
                            </Pressable>
                        ) : (
                            <Pressable
                                onPress={startListeningWithDelay}
                                disabled={isStopped || isPreparing || isTranscribing || isProcessing}
                                className={`w-16 h-16 rounded-full items-center justify-center ${
                                    isStopped ? "bg-slate-300" : "bg-blue-600"
                                }`}
                            >
                              {isStopped ? <MicOff size={22} color="#fff" /> : <Mic size={22} color="#fff" />}
                            </Pressable>
                        )}
                      </View>

                      {(isStopped || isProcessing) && (
                          <View className="flex-row gap-2 mt-4">
                            <Pressable
                                onPress={handleRetry}
                                disabled={isPreparing || isProcessing}
                                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border border-slate-300"
                            >
                              <RotateCcw size={16} color="#334155" />
                              <Text className="font-semibold text-slate-700">Thử lại</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => void handleSend()}
                                disabled={!transcript.trim() || isProcessing}
                                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-blue-600"
                            >
                              <Send size={16} color="#fff" />
                              <Text className="font-semibold text-white">
                                {isProcessing ? "Đang xử lý..." : "Gửi"}
                              </Text>
                            </Pressable>
                          </View>
                      )}

                      <View className="flex-1 justify-center pt-3">
                        <Text className="text-[11px] text-slate-400 text-center">
                          AI có thể mắc lỗi. Hãy kiểm tra lại thông tin trước khi gửi.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
        )}

        <Animated.View
            style={{
              position: "absolute",
              zIndex: 1000,
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            }}
            {...panResponder.panHandlers}
        >
          <View className="w-[58px] h-[58px] rounded-full bg-blue-600 items-center justify-center shadow-lg border border-blue-500">
            <Mic size={22} color="#fff" />
          </View>
        </Animated.View>
      </>
  );
}