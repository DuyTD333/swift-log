import attendanceReducer from "@/features/attendance/attendanceSlice";
import exportReducer from "@/features/export/exportSlice";
import importReducer from "@/features/import/importSlice";
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

const persistedExport = persistReducer(
  {
    key: "export",
    storage: AsyncStorage,
    whitelist: [],
  },
  exportReducer,
);

const persistedImport = persistReducer(
  {
    key: "import",
    storage: AsyncStorage,
    whitelist: [],
  },
  importReducer,
);

export const store = configureStore({
  reducer: {
    attendance: persistedAttendance,
    export: persistedExport,
    import: persistedImport,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
