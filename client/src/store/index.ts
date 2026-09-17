import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import scoreReducer from "./slices/scoreSlice";
import charityReducer from "./slices/charitySlice";
import drawReducer from "./slices/drawSlice";
import winnerReducer from "./slices/winnerSlice";
import adminReducer from "./slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    subscription: subscriptionReducer,
    scores: scoreReducer,
    charity: charityReducer,
    draw: drawReducer,
    winner: winnerReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
