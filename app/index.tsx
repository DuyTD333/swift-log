import { LoadingView } from "@/components/attendance/LoadingView";
import Button from "@/components/Button";
import HistoryDayView from "@/components/history/HistoryDayView";
import HistoryMonthView from "@/components/history/HistoryMonthView";
import Mode from "@/components/mode/Mode";
import ModeToggle from "@/components/mode/ModeToggle";
import {
  fetchAttendanceByDate,
  fetchAttendanceHistory,
} from "@/features/attendance/attendanceSlice";
import { exportAttendanceToExcel } from "@/features/export/exportSlice";
import { importAttendanceFromExcel } from "@/features/import/importSlice";
import { AppDispatch, type RootState } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export type HistoryViewMode = "day" | "month";

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDate, isLoading, hasAttendance, history } = useSelector(
    (s: RootState) => s.attendance,
  );
  const { isExporting } = useSelector((s: RootState) => s.export);
  const { isImporting } = useSelector((s: RootState) => s.import);

  const [viewMode, setViewMode] = useState<HistoryViewMode>("day");
  const pushToCheckIn = () => {
    router.push({
      pathname: "/checkin",
      params: { date: selectedDate },
    });
  };

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const endDate = now.toISOString().split("T")[0];

    dispatch(
      fetchAttendanceHistory({
        userId: "current-user-id",
        startDate,
        endDate,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAttendanceByDate(selectedDate));
  }, [selectedDate, dispatch]);

  const handleExport = async () => {
    if (history.length === 0) {
      Alert.alert("Thông báo", "Không có dữ liệu để xuất");
      return;
    }
    try {
      await dispatch(exportAttendanceToExcel(history)).unwrap();
      Alert.alert("Thành công", "Xuất tệp Excel thành công");
    } catch (error: any) {
      Alert.alert("Lỗi", error || "Xuất tệp thất bại");
    }
  };

  const handleImport = async () => {
    try {
      const data = await dispatch(importAttendanceFromExcel(history)).unwrap();
      if (data && data.length > 0) {
        Alert.alert(
          "Thành công",
          `Đã nhập ${data.length} bản ghi mới. (Các bản ghi trùng ngày đã được bỏ qua)`,
        );
        // Here you might want to dispatch an action to save these records to your backend/local state
      } else {
        Alert.alert(
          "Thông báo",
          "Không có dữ liệu mới để nhập (tất cả các bản ghi đã tồn tại hoặc tệp rỗng)",
        );
      }
    } catch (error: any) {
      if (error !== "Người dùng đã hủy chọn tệp") {
        Alert.alert("Lỗi", error || "Nhập tệp thất bại");
      }
    }
  };

  return (
    <View style={[styles.container]}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <ModeToggle>
            <Mode
              label="Ngày"
              mode="day"
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <Mode
              label="Tháng"
              mode="month"
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </ModeToggle>

          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleImport}
              disabled={isImporting}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#006272" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleExport}
              disabled={isExporting}
            >
              <Ionicons
                name="cloud-download-outline"
                size={20}
                color="#006272"
              />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading || isExporting || isImporting ? (
          <LoadingView />
        ) : viewMode === "day" ? (
          <HistoryDayView />
        ) : (
          <HistoryMonthView />
        )}
      </SafeAreaView>
      {viewMode === "day" && !hasAttendance && (
        <SafeAreaView style={styles.buttonContainer}>
          <Button label={"+"} onPress={pushToCheckIn} />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: "#d8d4bcf0",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  actionGroup: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 7,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 23,
    borderRadius: 20,
    borderColor: "#E8E8E4",
    borderWidth: 1.5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
    alignItems: "center",
    borderRadius: 50,
    paddingHorizontal: 130,
  },
});
