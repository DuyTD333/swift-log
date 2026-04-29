import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { excelService } from "@/services/excelService";
import { AttendanceRecord } from "../attendance/attendanceTypes";

interface ExportState {
  isExporting: boolean;
  error: string | null;
  lastExportedAt: string | null;
}

const initialState: ExportState = {
  isExporting: false,
  error: null,
  lastExportedAt: null,
};

export const exportAttendanceToExcel = createAsyncThunk(
  "export/exportToExcel",
  async (data: AttendanceRecord[], { rejectWithValue }) => {
    try {
      const fileName = `cham_cong_${new Date().toISOString().split("T")[0]}.xlsx`;
      await excelService.exportToExcel(data, fileName);
      return new Date().toISOString();
    } catch (error: any) {
      return rejectWithValue(error.message || "Export failed");
    }
  }
);

const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    clearExportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportAttendanceToExcel.pending, (state) => {
        state.isExporting = true;
        state.error = null;
      })
      .addCase(exportAttendanceToExcel.fulfilled, (state, action) => {
        state.isExporting = false;
        state.lastExportedAt = action.payload;
      })
      .addCase(exportAttendanceToExcel.rejected, (state, action) => {
        state.isExporting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearExportError } = exportSlice.actions;
export default exportSlice.reducer;
