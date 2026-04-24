import apiClient from "@/services/apiClient";
import { socket } from "@/utils/socketManager";

const STREAM_EVENTS = {
  START: "voice:start",
  STARTED: "voice:started",
  CHUNK: "voice:chunk",
  STOP: "voice:stop",
  TRANSCRIPT: "voice:transcript",
  ERROR: "voice:error",
  CLOSED: "voice:closed",
} as const;

export const voiceStreamEvents = STREAM_EVENTS;

export type VoiceRole = "picker" | "shipper";

export interface VoiceProcessResponse {
  success: boolean;
  intent?: Record<string, any>;
  matchedRecord?: Record<string, any> | null;
  matchedOrder?: Record<string, any> | null;
  message?: string;
}

export const processVoiceCommand = async (text: string, role: VoiceRole) => {
  const response = await apiClient.post<VoiceProcessResponse>("/voice-assistant/process", {
    text,
    role,
  });
  return response.data;
};

const inferMimeFromUri = (uri: string) => {
  const lower = String(uri || "").toLowerCase();
  if (lower.endsWith(".m4a")) return "audio/mp4";
  if (lower.endsWith(".wav")) return "audio/wav";
  if (lower.endsWith(".ogg")) return "audio/ogg";
  if (lower.endsWith(".mp3")) return "audio/mpeg";
  return "audio/mp4";
};

export const transcribeAudioUri = async (uri: string) => {
  const mimeType = inferMimeFromUri(uri);
  const ext = mimeType.includes("wav")
    ? "wav"
    : mimeType.includes("ogg")
      ? "ogg"
      : mimeType.includes("mpeg")
        ? "mp3"
        : "m4a";

  const formData = new FormData();
  formData.append("audio", {
    uri,
    name: `mobile-mic.${ext}`,
    type: mimeType,
  } as any);

  const response = await apiClient.post("/voice-assistant/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });

  return response.data as { success?: boolean; transcript?: string };
};

export const startVoiceStream = ({ timeoutMs = 7000 } = {}) => {
  return new Promise<boolean>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      socket.off(STREAM_EVENTS.STARTED, onStarted);
      socket.off(STREAM_EVENTS.ERROR, onError);
      clearTimeout(timer);
    };

    const onStarted = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(true);
    };

    const onError = (payload: { message?: string } = {}) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(payload.message || "Khong the khoi tao realtime STT."));
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Timeout khi khoi tao realtime STT."));
    }, timeoutMs);

    socket.once(STREAM_EVENTS.STARTED, onStarted);
    socket.once(STREAM_EVENTS.ERROR, onError);
    socket.emit(STREAM_EVENTS.START, { mimeType: "audio/mp4" });
  });
};

export const stopVoiceStream = () => {
  socket.emit(STREAM_EVENTS.STOP);
};

export const sendVoiceChunk = (chunkBase64: string) => {
  socket.emit(STREAM_EVENTS.CHUNK, { chunkBase64 });
};

