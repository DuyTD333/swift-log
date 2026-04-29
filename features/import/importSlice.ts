import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { excelService } from "@/services/excelService";
import { AttendanceRecord } from "../attendance/attendanceTypes";

interface ImportState {
  isImporting: boolean;
  error: string | null;
  importedData: AttendanceRecord[] | null;
}

const initialState: ImportState = {
  isImporting: false,
  error: null,
  importedData: null,
};

export const importAttendanceFromExcel = createAsyncThunk(
  "import/importFromExcel",
  async (existingHistory: AttendanceRecord[], { rejectWithValue }) => {
    try {
      const data = await excelService.importFromExcel(existingHistory);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Import failed");
    }
  }
);

const importSlice = createSlice({
  name: "import",
  initialState,
  reducers: {
    clearImportError: (state) => {
      state.error = null;
    },
    resetImportedData: (state) => {
      state.importedData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(importAttendanceFromExcel.pending, (state) => {
        state.isImporting = true;
        state.error = null;
      })
      .addCase(importAttendanceFromExcel.fulfilled, (state, action) => {
        state.isImporting = false;
        state.importedData = action.payload;
      })
      .addCase(importAttendanceFromExcel.rejected, (state, action) => {
        state.isImporting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearImportError, resetImportedData } = importSlice.actions;
export default importSlice.reducer;
