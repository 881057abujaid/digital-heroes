"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { initializeAuth, fetchCurrentUser } from "./slices/authSlice";
import { fetchSubscription } from "./slices/subscriptionSlice";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(initializeAuth());
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      store.dispatch(fetchCurrentUser());
      store.dispatch(fetchSubscription());
    }
  }, []);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
