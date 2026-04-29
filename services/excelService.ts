import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system/legacy"; // TODO: update FileSystem logic.
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { AttendanceRecord } from "../features/attendance/attendanceTypes";
import { Platform } from "react-native";
import { dateToLocaleTimeString } from "@/utils";

export const excelService = {
  /**
   * Export AttendanceRecord list to Excel file
   */
  exportToExcel: async (data: AttendanceRecord[], fileName: string) => {
    try {
      const exportData = data.map((record) => ({
        "Mã Nhân Viên": record.user_id,
        "Mã Địa Điểm": record.location_id,
        "Tên Địa Điểm": record.location_name,
        "Thời Gian Vào": dateToLocaleTimeString(record.check_in_time),
        "Thời Gian Ra": dateToLocaleTimeString(record.check_out_time || ""),
        "Phương Thức": record.method,
        Ngày: record.date,
        "Ghi Chú": record.notes || "",
        "Kinh Độ": record.coordinates?.longitude || "",
        "Vĩ Độ": record.coordinates?.latitude || "",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ChamCong");
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const uri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (Platform.OS === "android" || Platform.OS === "ios") {
        await Sharing.shareAsync(uri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Xuất dữ liệu chấm công",
          UTI: "com.microsoft.excel.xlsx",
        });
      } else {
        console.warn("Tính năng xuất trên web chưa được hỗ trợ đầy đủ trong dịch vụ này.");
      }
    } catch (error) {
      console.error("Lỗi Xuất:", error);
      throw new Error("Không thể xuất tệp Excel");
    }
  },

  /**
   * Import AttendanceRecord list from Excel file
   */
  importFromExcel: async (
    existingHistory: AttendanceRecord[],
  ): Promise<AttendanceRecord[]> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        throw new Error("Người dùng đã hủy chọn tệp");
      }

      const fileUri = result.assets[0].uri;
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const workbook = XLSX.read(fileBase64, { type: "base64" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const importedData: AttendanceRecord[] = jsonData.map((item) => ({
        user_id: String(item["Mã Nhân Viên"] || ""),
        location_id: String(item["Mã Địa Điểm"] || ""),
        location_name: String(item["Tên Địa Điểm"] || ""),
        check_in_time: String(item["Thời Gian Vào"] || ""),
        check_out_time: item["Thời Gian Ra"] || null,
        method: (item["Phương Thức"] as any) || "manual",
        date: String(item["Ngày"] || ""),
        notes: item["Ghi Chú"] || null,
        coordinates:
          item["Kinh Độ"] && item["Vĩ Độ"]
            ? {
                longitude: Number(item["Kinh Độ"]),
                latitude: Number(item["Vĩ Độ"]),
              }
            : null,
      }));

      const existingDates = new Set(existingHistory.map((r) => r.date));
      const filteredData = importedData.filter(
        (record) => !existingDates.has(record.date),
      );

      return filteredData;
    } catch (error) {
      console.error("Lỗi Nhập:", error);
      throw new Error("Không thể nhập tệp Excel. Vui lòng kiểm tra định dạng.");
    }
  },
};
