import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default

import rootReducer from "./rootReducer"; // 👈 Your combined reducer

import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseapi";
import { courseProgressApi } from "@/features/api/courseProgressApi";

// ✅ Only persist the `auth` slice
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // 👈 Persist only this slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create the store
export const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required for redux-persist compatibility
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      courseApi.middleware,
      purchaseApi.middleware,
      courseProgressApi.middleware
    ),
});

// ✅ Persistor to be used in <PersistGate>
export const persistor = persistStore(appStore);

// ✅ (Optional) Load current user on app init
const initializeApp = async () => {
  await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }));
};

initializeApp();
