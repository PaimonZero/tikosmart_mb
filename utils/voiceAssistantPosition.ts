import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "tikosmart_voice_assistant_position_v2";

export interface VoiceButtonPosition {
  x: number;
  y: number;
}

export const saveVoiceButtonPosition = async (position: VoiceButtonPosition) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(position));
};

export const loadVoiceButtonPosition = async (): Promise<VoiceButtonPosition | null> => {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.x === "number" &&
      Number.isFinite(parsed.x) &&
      typeof parsed?.y === "number" &&
      Number.isFinite(parsed.y)
    ) {
      return { x: parsed.x, y: parsed.y };
    }
  } catch {
    return null;
  }

  return null;
};

