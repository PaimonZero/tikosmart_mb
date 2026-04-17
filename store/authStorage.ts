import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  user: 'currentUser',
  token: 'accessToken',
  remember: 'rememberMe',
} as const;

export type StoredAuth = {
  user: unknown | null;
  token: string | null;
  remember: boolean;
};

let sessionUser: unknown | null = null;
let sessionToken: string | null = null;

const safeJsonParse = (raw: string | null) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const authStorage = {
  read: async (): Promise<StoredAuth> => {
    try {
      const rememberRaw = await AsyncStorage.getItem(KEYS.remember);
      const remember = rememberRaw === 'true';

      if (remember) {
        // Try reading token from SecureStore first (New way)
        let token = await SecureStore.getItemAsync(KEYS.token);
        
        // Migration logic for existing users
        if (!token) {
          token = await AsyncStorage.getItem(KEYS.token);
          if (token) {
            // Migrate to SecureStore
            await SecureStore.setItemAsync(KEYS.token, token);
            await AsyncStorage.removeItem(KEYS.token); // Clean up
          }
        }

        const userRaw = await AsyncStorage.getItem(KEYS.user);

        return {
          user: safeJsonParse(userRaw),
          token: token || null,
          remember,
        };
      }

      return { user: sessionUser, token: sessionToken, remember: false };
    } catch {
      return { user: null, token: null, remember: false };
    }
  },

  persist: async ({
    user,
    token,
    remember,
  }: {
    user: unknown;
    token: string;
    remember: boolean;
  }) => {
    await authStorage.clear();

    if (remember) {
      await Promise.all([
        AsyncStorage.setItem(KEYS.user, JSON.stringify(user)),
        SecureStore.setItemAsync(KEYS.token, token),
        AsyncStorage.setItem(KEYS.remember, 'true'),
      ]);
    } else {
      sessionUser = user;
      sessionToken = token;
      await AsyncStorage.removeItem(KEYS.remember);
    }
  },

  persistUserOnly: async (user: unknown, remember: boolean) => {
    if (remember) {
      await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
    } else {
      sessionUser = user;
    }
  },

  setTokenOnly: async (token: string, remember: boolean) => {
    if (remember) {
      await SecureStore.setItemAsync(KEYS.token, token);
    } else {
      sessionToken = token;
    }
  },

  clear: async () => {
    sessionUser = null;
    sessionToken = null;
    await Promise.all([
      AsyncStorage.removeItem(KEYS.user),
      SecureStore.deleteItemAsync(KEYS.token),
      AsyncStorage.removeItem(KEYS.remember),
    ]);
  },
};

export default authStorage;
