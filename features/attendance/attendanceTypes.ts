// src/features/attendance/attendanceTypes.ts

export type AttendanceStatus = "idle" | "checked_in" | "checked_out";
export type CheckInMethod = "deep_link" | "qr_scan" | "manual" | "notification";

export interface AttendanceRecord {
  user_id: string;
  location_id: string;
  location_name: string;
  check_in_time: string;
  check_out_time: string | null;
  method: CheckInMethod;
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  notes: string | null;
  date: string;
}

export interface AttendanceState {
  status: AttendanceStatus;
  currentRecord: AttendanceRecord | null;
  history: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;
  pendingOfflineRecords: AttendanceRecord[]; // MMKV offline queue
  selectedDate: string; // ISO date string for history view
  hasAttendance: boolean;
}

// Deep link parameters — luôn validate trước khi dùng
export interface CheckInDeepLinkParams {
  location_id: string;
  location_name: string;
  token: string; // HMAC token để xác thực link
  expires_at: string; // Unix timestamp
}
