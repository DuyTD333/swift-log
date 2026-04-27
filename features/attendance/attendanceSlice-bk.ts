// // src/features/attendance/attendanceSlice.ts
// import { attendanceService } from "@/services/attendanceService";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type {
//   AttendanceRecord,
//   AttendanceState,
//   CheckInMethod,
// } from "./attendanceTypes";

// const initialState: AttendanceState = {
//   status: "idle",
//   currentRecord: null,
//   history: [],
//   isLoading: false,
//   error: null,
//   pendingOfflineRecords: [],
//   selectedDate: new Date().toISOString().split("T")[0],
// };

// // Async thunk untuk simpan ke local storage
// const saveCurrentRecordToStorage = async (record: AttendanceRecord | null) => {
//   try {
//     if (record) {
//       await AsyncStorage.setItem(
//         "@attendance_current_record",
//         JSON.stringify(record),
//       );
//     } else {
//       await AsyncStorage.removeItem("@attendance_current_record");
//     }
//   } catch (error) {
//     console.error("[AsyncStorage] Save current record failed:", error);
//   }
// };

// const saveHistoryToStorage = async (history: AttendanceRecord[]) => {
//   try {
//     await AsyncStorage.setItem("@attendance_history", JSON.stringify(history));
//   } catch (error) {
//     console.error("[AsyncStorage] Save history failed:", error);
//   }
// };

// const savePendingRecordsToStorage = async (records: AttendanceRecord[]) => {
//   try {
//     await AsyncStorage.setItem(
//       "@attendance_pending_records",
//       JSON.stringify(records),
//     );
//   } catch (error) {
//     console.error("[AsyncStorage] Save pending records failed:", error);
//   }
// };

// // Load dari local storage
// export const loadAttendanceFromStorage = createAsyncThunk(
//   "attendance/loadFromStorage",
//   async () => {
//     try {
//       const [currentRecord, history, pendingRecords] = await Promise.all([
//         AsyncStorage.getItem("@attendance_current_record"),
//         AsyncStorage.getItem("@attendance_history"),
//         AsyncStorage.getItem("@attendance_pending_records"),
//       ]);

//       return {
//         currentRecord: currentRecord ? JSON.parse(currentRecord) : null,
//         history: history ? JSON.parse(history) : [],
//         pendingOfflineRecords: pendingRecords ? JSON.parse(pendingRecords) : [],
//       };
//     } catch (error) {
//       console.error("[AsyncStorage] Load failed:", error);
//       return {
//         currentRecord: null,
//         history: [],
//         pendingOfflineRecords: [],
//       };
//     }
//   },
// );

// export const checkIn = createAsyncThunk(
//   "attendance/checkIn",
//   async (params: {
//     locationId: string;
//     locationName: string;
//     method: CheckInMethod;
//   }) => {
//     return await attendanceService.checkIn(params);
//   },
// );

// export const checkOut = createAsyncThunk(
//   "attendance/checkOut",
//   async (recordId: string) => {
//     return await attendanceService.checkOut(recordId);
//   },
// );

// export const syncOfflineRecords = createAsyncThunk(
//   "attendance/syncOffline",
//   async (_, { getState }) => {
//     const state = getState() as { attendance: AttendanceState };
//     return await attendanceService.syncPendingRecords(
//       state.attendance.pendingOfflineRecords,
//     );
//   },
// );

// export const fetchAttendanceHistory = createAsyncThunk(
//   "attendance/fetchHistory",
//   async (params: { userId: string; startDate: string; endDate: string }) => {
//     return await attendanceService.getHistory(params);
//   },
// );

// export const fetchAttendanceByDate = createAsyncThunk(
//   "attendance/fetchByDate",
//   async (date: string) => {
//     return await attendanceService.getByDate(date);
//   },
// );

// const attendanceSlice = createSlice({
//   name: "attendance",
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     addPendingOfflineRecord: (
//       state,
//       action: PayloadAction<AttendanceRecord>,
//     ) => {
//       state.pendingOfflineRecords.push(action.payload);
//       savePendingRecordsToStorage(state.pendingOfflineRecords);
//     },
//     setSelectedDate: (state, action: PayloadAction<string>) => {
//       state.selectedDate = action.payload;
//     },
//     clearCurrentRecord: (state) => {
//       state.currentRecord = null;
//       state.status = "idle";
//       saveCurrentRecordToStorage(null);
//     },
//     setStatusIdle: (state) => {
//       state.status = "idle";
//     },
//   },
//   extraReducers: (builder) => {
//     // Load from storage
//     builder.addCase(loadAttendanceFromStorage.fulfilled, (state, action) => {
//       state.currentRecord = action.payload.currentRecord;
//       state.history = action.payload.history;
//       state.pendingOfflineRecords = action.payload.pendingOfflineRecords;
//       // Set status based on current record
//       if (state.currentRecord && !state.currentRecord.check_out_time) {
//         state.status = "checked_in";
//       } else {
//         state.status = "idle";
//       }
//     });

//     // Check In
//     builder
//       .addCase(checkIn.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(checkIn.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.status = "checked_in";
//         state.currentRecord = action.payload;
//         // Save to storage
//         saveCurrentRecordToStorage(action.payload);
//       })
//       .addCase(checkIn.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message ?? "Check-in thất bại";
//       });

//     // Check Out
//     builder
//       .addCase(checkOut.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(checkOut.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.status = "checked_out";
//         state.currentRecord = action.payload;
//         // Add to history
//         state.history.unshift(action.payload);
//         // Save to storage
//         saveCurrentRecordToStorage(action.payload);
//         saveHistoryToStorage(state.history);
//       })
//       .addCase(checkOut.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message ?? "Check-out thất bại";
//       });

//     // Fetch History
//     builder
//       .addCase(fetchAttendanceHistory.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.history = action.payload;
//         saveHistoryToStorage(action.payload);
//       })
//       .addCase(fetchAttendanceHistory.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message ?? "Fetch history thất bại";
//       });

//     // Fetch By Date
//     builder.addCase(fetchAttendanceByDate.fulfilled, (state, action) => {
//       if (action.payload.length > 0) {
//         state.selectedDate = action.payload[0].check_in_time.split("T")[0];
//       }
//     });

//     // Sync Offline Records
//     builder
//       .addCase(syncOfflineRecords.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(syncOfflineRecords.fulfilled, (state) => {
//         state.isLoading = false;
//         state.pendingOfflineRecords = [];
//         savePendingRecordsToStorage([]);
//       })
//       .addCase(syncOfflineRecords.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.error.message ?? "Sync thất bại";
//       });
//   },
// });

// export const {
//   clearError,
//   addPendingOfflineRecord,
//   setSelectedDate,
//   clearCurrentRecord,
//   setStatusIdle,
// } = attendanceSlice.actions;
// export default attendanceSlice.reducer;
