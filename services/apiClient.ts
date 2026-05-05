import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

import { notifyAuthExpired } from "@/services/authSession";
import authStorage from "@/store/authStorage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.EXPO_PUBLIC_VITE_API_BASE_URL ||
  "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Device-Type": "mobile", // Phân biệt mobile vs web cho backend
  },
});

// In-memory token cache để tránh race condition với AsyncStorage.
// Đặc biệt quan trọng cho flow Google deep link (set token rồi gọi API ngay).
let cachedToken: string | null = null;
let tokenReadPromise: Promise<string | null> | null = null;

export const setAuthToken = (token: string | null) => {
  cachedToken = token;
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

const AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/refresh-token",
];

const shouldSkipAuthHeader = (url?: string) =>
  AUTH_ROUTES.some((r) => (url || "").includes(r));

const getTokenFast = async () => {
  // 1) Ưu tiên token đã cache
  if (cachedToken) return cachedToken;

  // 2) Ưu tiên defaults header nếu đã set từ nơi khác (authSlice)
  const def = apiClient.defaults.headers.common.Authorization;
  if (typeof def === "string" && def.startsWith("Bearer ")) {
    const t = def.slice("Bearer ".length).trim();
    if (t) {
      cachedToken = t;
      return t;
    }
  }

  // 3) Fallback: đọc từ storage (lock để không đọc dồn dập)
  if (!tokenReadPromise) {
    tokenReadPromise = authStorage
      .read()
      .then(({ token }) => token ?? null)
      .finally(() => {
        tokenReadPromise = null;
      });
  }

  const tokenFromStorage = await tokenReadPromise;
  if (tokenFromStorage) setAuthToken(tokenFromStorage);
  return tokenFromStorage;
};

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const headers = AxiosHeaders.from(config.headers);

    if (shouldSkipAuthHeader(config.url)) {
      config.headers = headers;
      return config;
    }

    // Nếu request đã có Authorization thì giữ nguyên
    if (!headers.has("Authorization")) {
      const token = await getTokenFast();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let queue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const enqueue = () =>
  new Promise<string>((resolve, reject) => queue.push({ resolve, reject }));

const flush = (error: unknown, token: string | null) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token as string)));
  queue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error?.response) return Promise.reject(error);

    const status: number = error.response.status;
    const req = error.config;

    if (status !== 401 || shouldSkipAuthHeader(req?.url)) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      const token = await enqueue();
      const headers = AxiosHeaders.from(req.headers);
      headers.set("Authorization", `Bearer ${token}`);
      req.headers = headers;
      return apiClient(req);
    }

    if (req?._retry) return Promise.reject(error);
    req._retry = true;
    isRefreshing = true;

    try {
      const { data } = await apiClient.post("/auth/refresh-token", {});
      const accessToken = data?.accessToken;
      if (!accessToken) throw new Error("No accessToken");

      const { remember } = await authStorage.read();
      await authStorage.setTokenOnly(accessToken, remember);

      // Quan trọng: set token vào cache + defaults ngay lập tức
      setAuthToken(accessToken);
      const headers = AxiosHeaders.from(req.headers);
      headers.set("Authorization", `Bearer ${accessToken}`);
      req.headers = headers;

      flush(null, accessToken);
      return apiClient(req);
    } catch (e) {
      flush(e, null);
      setAuthToken(null);
      await authStorage.clear();
      notifyAuthExpired();
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
