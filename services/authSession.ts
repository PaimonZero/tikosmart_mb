type AuthExpiredHandler = () => void;

let handler: AuthExpiredHandler | null = null;

export const setAuthExpiredHandler = (fn: AuthExpiredHandler | null) => {
  handler = fn;
};

export const notifyAuthExpired = () => {
  try {
    handler?.();
  } catch {
    // ignore
  }
};
