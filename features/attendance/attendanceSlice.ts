import { attendanceService } from "@/services/attendanceService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  AttendanceRecord,
  AttendanceState,
  CheckInMethod,
} from "./attendanceTypes";

const STORAGE_KEYS = {
  CURRENT_RECORD: "@attendance_current_record",
  HISTORY: "@attendance_history",
  PENDING: "@attendance_pending_records",
};

const initialState: AttendanceState = {
  status: "idle",
  currentRecord: null,
  history: [],
  isLoading: false,
  error: null,
  pendingOfflineRecords: [],
  selectedDate: new Date().toISOString().split("T")[0],
  hasAttendance: false,
};

const persistData = async (key: string, data: any) => {
  try {
    if (data === null) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.error(`[Storage Error] Fail to save ${key}:`, e);
  }
};

export const loadAttendanceFromStorage = createAsyncThunk(
  "attendance/loadFromStorage",
  async () => {
    const [current, history, pending] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.CURRENT_RECORD),
      AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
      AsyncStorage.getItem(STORAGE_KEYS.PENDING),
    ]);

    return {
      currentRecord: current ? JSON.parse(current) : null,
      history: history ? JSON.parse(history) : [],
      pendingOfflineRecords: pending ? JSON.parse(pending) : [],
    };
  },
);

export const getByDate = createAsyncThunk(
  "attendance/getByDate",
  async (date: string, { rejectWithValue }) => {
    try {
      const response: AttendanceRecord | undefined =
        await attendanceService.getByDate(date);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Check-in thất bại");
    }
  },
);

export const checkIn = createAsyncThunk(
  "attendance/checkIn",
  async (
    params: {
      locationId: string;
      locationName: string;
      method: CheckInMethod;
      date: string;
      hour: number;
      minute: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const response: AttendanceRecord =
        await attendanceService.checkIn(params);
      await persistData(STORAGE_KEYS.CURRENT_RECORD, response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Check-in thất bại");
    }
  },
);

export const checkOut = createAsyncThunk(
  "attendance/checkOut",
  async (params: { hour: number; minute: number }, { getState }) => {
    const response = await attendanceService.checkOut(params);

    await persistData(STORAGE_KEYS.CURRENT_RECORD, null);

    const state = (getState() as any).attendance as AttendanceState;
    const newHistory = [response, ...state.history];
    await persistData(STORAGE_KEYS.HISTORY, newHistory.slice(0, 50)); // Giới hạn 50 bản ghi cho nhẹ

    return response;
  },
);

export const updateAttendance = createAsyncThunk(
  "attendance/update",
  async (
    params: {
      check_in_hour: number;
      check_in_minute: number;
      check_out_hour: number;
      check_out_minute: number;
      date: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response: AttendanceRecord = await attendanceService.update(params);
      await persistData(STORAGE_KEYS.CURRENT_RECORD, response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Update Attendance thất bại");
    }
  },
);

export const syncOfflineRecords = createAsyncThunk(
  "attendance/syncOffline",
  async (_, { getState }) => {
    const state = (getState() as any).attendance as AttendanceState;
    if (state.pendingOfflineRecords.length === 0) return [];

    const response = await attendanceService.syncPendingRecords(
      state.pendingOfflineRecords,
    );
    await persistData(STORAGE_KEYS.PENDING, []); // Xóa trắng sau khi sync
    return response;
  },
);

const saveCurrentRecordToStorage = async (record: AttendanceRecord | null) => {
  try {
    if (record) {
      await AsyncStorage.setItem(
        "@attendance_current_record",
        JSON.stringify(record),
      );
    } else {
      await AsyncStorage.removeItem("@attendance_current_record");
    }
  } catch (error) {
    console.error("[AsyncStorage] Save current record failed:", error);
  }
};

export const fetchAttendanceHistory = createAsyncThunk(
  "attendance/fetchHistory",
  async (params: { userId: string; startDate: string; endDate: string }) => {
    return await attendanceService.getHistory(params);
  },
);

export const fetchAttendanceByDate = createAsyncThunk(
  "attendance/fetchByDate",
  async (date: string) => {
    return await attendanceService.getByDate(date);
  },
);

const saveHistoryToStorage = async (history: AttendanceRecord[]) => {
  try {
    await AsyncStorage.setItem("@attendance_history", JSON.stringify(history));
  } catch (error) {
    console.error("[AsyncStorage] Save history failed:", error);
  }
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addPendingRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      state.pendingOfflineRecords.push(action.payload);
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
      const hasAttendance = state.history.some((record) => {
        const recordDate = record.check_in_time.split("T")[0];
        return recordDate === action.payload;
      });
      state.hasAttendance = hasAttendance;
    },
    clearCurrentRecord: (state) => {
      state.currentRecord = null;
      state.status = "idle";
      saveCurrentRecordToStorage(null);
    },
    clearHistory: (state) => {
      state.history = [];
      saveHistoryToStorage([]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAttendanceFromStorage.fulfilled, (state, action) => {
        state.currentRecord = action.payload.currentRecord;
        state.history = action.payload.history;
        state.pendingOfflineRecords = action.payload.pendingOfflineRecords;
        state.status =
          state.currentRecord && !state.currentRecord.check_out_time
            ? "checked_in"
            : "idle";
      })

      .addCase(checkIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecord = action.payload;
        state.status = "checked_in";
        saveCurrentRecordToStorage(action.payload);
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "idle";
        state.history.unshift(action.payload);
        state.currentRecord = null;
        saveCurrentRecordToStorage(action.payload);
      })
      .addCase(syncOfflineRecords.fulfilled, (state) => {
        state.pendingOfflineRecords = [];
      })
      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
        saveHistoryToStorage(action.payload);
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Fetch history thất bại";
      })
      .addCase(fetchAttendanceByDate.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedDate = action.payload.check_in_time.split("T")[0];
        }
      });
  },
});

export const {
  clearError,
  setSelectedDate,
  addPendingRecord,
  clearCurrentRecord,
  clearHistory,
} = attendanceSlice.actions;
export default attendanceSlice.reducer;
