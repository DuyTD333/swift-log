// // src/store/index.ts
// import attendanceReducer from "@/features/attendance/attendanceSlice";
// import { configureStore } from "@reduxjs/toolkit";
// import { persistReducer, persistStore, Storage } from "redux-persist";

// const mmkv = new MMKV({ id: "app-store" });

// const mmkvStorage: Storage = {
//   setItem: (key, value) => {
//     mmkv.set(key, value);
//     return Promise.resolve(true);
//   },
//   getItem: (key) => {
//     const value = mmkv.getString(key);
//     return Promise.resolve(value ?? null);
//   },
//   removeItem: (key) => {
//     mmkv.delete(key);
//     return Promise.resolve();
//   },
// };

// const persistedAttendance = persistReducer(
//   {
//     key: "attendance",
//     storage: mmkvStorage,
//     whitelist: ["currentRecord", "pendingOfflineRecords"],
//   },
//   attendanceReducer,
// );

// export const store = configureStore({
//   reducer: {
//     attendance: persistedAttendance,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import attendanceReducer from "@/features/attendance/attendanceSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const persistedAttendance = persistReducer(
  {
    key: "attendance",
    storage: AsyncStorage,
    whitelist: ["currentRecord", "pendingOfflineRecords", "history"],
  },
  attendanceReducer,
);

export const store = configureStore({
  reducer: {
    attendance: persistedAttendance,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
