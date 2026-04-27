import { LoadingView } from "@/components/attendance/LoadingView";
import Button from "@/components/Button";
import HistoryDayView from "@/components/history/HistoryDayView";
import HistoryHeader from "@/components/history/HistoryHeader";
import HistoryMonthView from "@/components/history/HistoryMonthView";
import Mode from "@/components/mode/Mode";
import ModeToggle from "@/components/mode/ModeToggle";
import {
  fetchAttendanceByDate,
  fetchAttendanceHistory,
} from "@/features/attendance/attendanceSlice";
import { AppDispatch, type RootState } from "@/store";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export type HistoryViewMode = "day" | "month";

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedDate, isLoading, hasAttendance } = useSelector(
    (s: RootState) => s.attendance,
  );
  const [viewMode, setViewMode] = useState<HistoryViewMode>("day");

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

  return (
    <View style={[styles.container]}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <HistoryHeader />
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
        {isLoading ? (
          <LoadingView />
        ) : viewMode === "day" ? (
          <HistoryDayView />
        ) : (
          <HistoryMonthView />
        )}
      </SafeAreaView>
      {viewMode === "day" && !hasAttendance && (
        <SafeAreaView style={styles.buttonContainer}>
          <Button label={"+"} onPress={() => router.push("/checkin")} />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#d8d4bcf0",
  },
  safeArea: {
    flex: 1,
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
