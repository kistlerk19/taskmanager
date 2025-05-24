import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { api } from "@/state/api";
import globalReducer from "@/state/globalSlice";
import authReducer from "@/state/authSlice";
import { Provider } from 'react-redux';
import React from 'react';

// Create listener middleware for side effects
const listenerMiddleware = createListenerMiddleware();

export const makeStore = () => {
  return configureStore({
    reducer: {
      global: globalReducer,
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            // Ignore these action types
            'persist/PERSIST',
            'persist/REHYDRATE',
          ],
        },
      })
        .concat(api.middleware)
        .prepend(listenerMiddleware.middleware),
  });
};

const store = makeStore();

const StoreProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

export default StoreProvider;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;