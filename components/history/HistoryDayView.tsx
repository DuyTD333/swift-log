import { setSelectedDate } from "@/features/attendance/attendanceSlice";
import { AppDispatch, RootState } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AttendanceSummary } from "../attendance/AttendanceSummary";
import { Calendar } from "../calendar/Calendar";

export default function HistoryDayView() {
  const dispatch = useDispatch<AppDispatch>();
  const { history, selectedDate } = useSelector((s: RootState) => s.attendance);

  const selectedDateRecords = useMemo(
    () =>
      history.filter((r) => {
        const recordDate = r.check_in_time.split("T")[0];
        return recordDate === selectedDate;
      }),
    [history, selectedDate],
  );

  const attendanceDates = useMemo(
    () =>
      Array.from(new Set(history.map((r) => r.check_in_time.split("T")[0]))),
    [history],
  );

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={(date) => dispatch(setSelectedDate(date))}
        attendanceDates={attendanceDates}
      />
      {selectedDateRecords.length > 0 ? (
        <View style={styles.summaryContainer}>
          <AttendanceSummary
            record={selectedDateRecords[0]}
            selectedDate={selectedDate}
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons
            name="calendar"
            size={20}
            color="#0F6E56"
            style={styles.pickerIcon}
          />
          <Text style={styles.emptyStateTitle}>Không có dữ liệu</Text>
          <Text style={styles.emptyStateDesc}>
            Chưa có chấm công vào ngày này
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    marginBottom: 15,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    backgroundColor: "transparent",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#E8E8E4",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptyStateDesc: {
    fontSize: 14,
    color: "#6B6B68",
    textAlign: "center",
  },
  pickerIcon: {
    marginRight: 4,
  },
});
