import type {
  AttendanceRecord,
  CheckInMethod,
} from "@/features/attendance/attendanceTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  CURRENT_RECORD: "@attendance_current_record",
  HISTORY: "@attendance_history",
  PENDING_RECORDS: "@attendance_pending_records",
} as const;

// Helper functions
const saveToStorage = async (key: string, data: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`[AsyncStorage] Failed to save to ${key}:`, error);
    throw error;
  }
};

const getFromStorage = async <T = any>(key: string): Promise<T | null> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`[AsyncStorage] Failed to get ${key}:`, error);
    return null;
  }
};

const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`[AsyncStorage] Failed to remove ${key}:`, error);
  }
};

export const attendanceService = {
  async checkIn(params: {
    locationId: string;
    locationName: string;
    method: CheckInMethod;
    date: string;
    hour: number;
    minute: number;
  }): Promise<AttendanceRecord> {
    const checkInDate = new Date(params.date);
    if (typeof params.hour === "number" && typeof params.minute === "number") {
      checkInDate.setHours(params.hour, params.minute, 0, 0);
    }

    const record: AttendanceRecord = {
      user_id: "current-user",
      location_id: params.locationId,
      location_name: params.locationName,
      check_in_time: checkInDate.toISOString(),
      check_out_time: null,
      method: params.method,
      coordinates: null,
      notes: null,
      date: checkInDate.toISOString().split("T")[0],
    };

    const history = await getFromStorage<AttendanceRecord[]>(
      STORAGE_KEYS.HISTORY,
    );
    const mergedHistory = [record, ...(history || [])];
    console.log('mergedHistory: ', JSON.stringify(mergedHistory, null, 2));

    await Promise.all([
      saveToStorage(STORAGE_KEYS.HISTORY, mergedHistory),
      saveToStorage(STORAGE_KEYS.CURRENT_RECORD, record),
    ]);
    return record;
  },

  async checkOut(params: {
    hour: number;
    minute: number;
  }): Promise<AttendanceRecord> {
    const record = await getFromStorage<AttendanceRecord>(
      STORAGE_KEYS.CURRENT_RECORD,
    );

    if (!record) {
      throw new Error("Không tìm thấy bản ghi check-in");
    }

    const checkoutDate = new Date();
    if (typeof params.hour === "number" && typeof params.minute === "number") {
      checkoutDate.setHours(params.hour, params.minute, 0, 0);
    }

    const updatedRecord: AttendanceRecord = {
      ...record,
      check_out_time: checkoutDate.toISOString(),
    };

    const history = await getFromStorage<AttendanceRecord[]>(
      STORAGE_KEYS.HISTORY,
    );
    const newHistory = [updatedRecord, ...(history || [])];

    await Promise.all([
      saveToStorage(STORAGE_KEYS.HISTORY, newHistory),
      removeFromStorage(STORAGE_KEYS.CURRENT_RECORD),
      removeFromStorage(STORAGE_KEYS.HISTORY),
    ]);

    return updatedRecord;
  },

  async update(params: {
    check_in_hour: number;
    check_in_minute: number;
    check_out_hour: number;
    check_out_minute: number;
    date: string;
  }): Promise<AttendanceRecord> {
    const attendanceRecord = await this.getByDate(params.date);
    if (!attendanceRecord) {
      throw new Error(`Không tìm thấy bản ghi update ${params.date}`);
    }
    const checkinDate = new Date();
    if (
      typeof params.check_in_hour === "number" &&
      typeof params.check_in_minute === "number"
    ) {
      checkinDate.setHours(params.check_in_hour, params.check_in_minute, 0, 0);
    }
    const checkoutDate = new Date();
    if (
      typeof params.check_out_hour === "number" &&
      typeof params.check_out_minute === "number"
    ) {
      checkoutDate.setHours(
        params.check_out_hour,
        params.check_out_minute,
        0,
        0,
      );
    }
    const updatedAttendanceRecord: AttendanceRecord = {
      ...attendanceRecord,
      check_out_time: checkoutDate.toISOString(),
      check_in_time: checkinDate.toISOString(),
    };
    const history = await getFromStorage<AttendanceRecord[]>(
      STORAGE_KEYS.HISTORY,
    );
    const newHistory = [updatedAttendanceRecord, ...(history || [])];
    await saveToStorage(STORAGE_KEYS.HISTORY, newHistory);
    return updatedAttendanceRecord;
  },

  async syncPendingRecords(records: AttendanceRecord[]): Promise<void> {
    if (!records.length) return;

    const history = await getFromStorage<AttendanceRecord[]>(
      STORAGE_KEYS.HISTORY,
    );
    const mergedHistory = [...records, ...(history || [])];

    await Promise.all([
      saveToStorage(STORAGE_KEYS.HISTORY, mergedHistory),
      removeFromStorage(STORAGE_KEYS.PENDING_RECORDS),
    ]);
  },

  async getHistory(params: {
    userId: string;
    startDate: string;
    endDate: string;
  }): Promise<AttendanceRecord[]> {
    const history = await getFromStorage<AttendanceRecord[]>(
      STORAGE_KEYS.HISTORY,
    );

    if (!history) return [];

    return history.filter((record) => {
      const recordDate = record.check_in_time.split("T")[0];
      return recordDate >= params.startDate && recordDate <= params.endDate;
    });
  },

  async getByDate(date: string): Promise<AttendanceRecord | undefined> {
    const history = await getFromStorage<AttendanceRecord[]>(
      STORAGE_KEYS.HISTORY,
    );

    if (!history) return undefined;

    return history.find((record) => {
      const recordDate = record.check_in_time.split("T")[0];
      return recordDate === date;
    });
  },

  async getCurrentRecord(): Promise<AttendanceRecord | null> {
    return getFromStorage<AttendanceRecord>(STORAGE_KEYS.CURRENT_RECORD);
  },

  async clearCurrentRecord(): Promise<void> {
    await removeFromStorage(STORAGE_KEYS.CURRENT_RECORD);
  },

  async clearHistory(): Promise<void> {
    await removeFromStorage(STORAGE_KEYS.HISTORY);
  },

  async exportHistory(): Promise<AttendanceRecord[]> {
    const history = await getFromStorage<AttendanceRecord[]>(
      STORAGE_KEYS.HISTORY,
    );
    return history || [];
  },

  calculateWorkHours(records: AttendanceRecord[]): {
    checkinTime: string | null;
    checkoutTime: string | null;
    totalHours: number;
  } {
    const checkins = records.filter((r) => !r.check_out_time);
    const checkouts = records.filter((r) => r.check_out_time);

    if (!checkins.length || !checkouts.length) {
      return { checkinTime: null, checkoutTime: null, totalHours: 0 };
    }

    const checkinTime = new Date(checkins[0].check_in_time);
    const checkoutTime = new Date(checkouts[0].check_out_time!);
    const totalMs = checkoutTime.getTime() - checkinTime.getTime();
    const totalHours = totalMs / (1000 * 60 * 60);

    return {
      checkinTime: checkinTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      checkoutTime: checkoutTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      totalHours: Math.round(totalHours * 100) / 100,
    };
  },
};
