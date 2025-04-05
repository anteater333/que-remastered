// store.ts
/**
 * @module store
 * 어플리케이션 전역적으로 사용될 상태의 저장소
 */

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; // v6

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

/**
 * redux-persist
 * 새로고침 시에도 redux state가 유지되도록 합니다.
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Globalized app store
 */
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["payload.user"],
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
export const persistor = persistStore(store);
