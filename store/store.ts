import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/authSlice";
import userReducer from "@/store/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
