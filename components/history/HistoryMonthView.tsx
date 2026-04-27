import { RootState } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { AttendanceSummary } from "../attendance/AttendanceSummary";

export default function HistoryMonthView() {
  const { history } = useSelector((s: RootState) => s.attendance);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const selectedMonthRecords = useMemo(
    () =>
      history.filter((r) => {
        const ym = r.check_in_time.slice(0, 7);
        return ym === selectedMonth;
      }),
    [history, selectedMonth],
  );

  const daysInSelectedMonth = useMemo(() => {
    const days = Array.from(
      new Set(selectedMonthRecords.map((r) => r.check_in_time.split("T")[0])),
    ).sort((a, b) => b.localeCompare(a));
    return days;
  }, [selectedMonthRecords]);

  const formatMonthYear = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long" });
  };

  const monthGroups = useMemo(() => {
    const map: Record<string, typeof history> = {};
    history.forEach((r) => {
      const ym = r.check_in_time.slice(0, 7);
      if (!map[ym]) map[ym] = [];
      map[ym].push(r);
    });
    return map;
  }, [history]);

  const monthList = useMemo(
    () => Object.keys(monthGroups).sort((a, b) => b.localeCompare(a)),
    [monthGroups],
  );

  const handleMonthSelect = useCallback((newMonth: string) => {
    setSelectedMonth(newMonth);
    setShowMonthPicker(false);
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.monthPickerButton}
        onPress={() => setShowMonthPicker(!showMonthPicker)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar"
          size={20}
          color="#0F6E56"
          style={styles.pickerIcon}
        />
        <Text style={styles.monthPickerText}>
          {formatMonthYear(selectedMonth)}
        </Text>
        <Ionicons
          name={showMonthPicker ? "chevron-up" : "chevron-down"}
          size={20}
          color="#0F6E56"
        />
      </TouchableOpacity>
      {showMonthPicker && (
        <View style={styles.monthPickerDropdown}>
          <ScrollView
            style={styles.monthPickerScroll}
            showsVerticalScrollIndicator={false}
          >
            {monthList.length === 0 ? (
              <View style={styles.noMonthsText}>
                <Text style={styles.noMonthsLabel}>
                  Chưa có dữ liệu chấm công
                </Text>
              </View>
            ) : (
              monthList.map((ym) => (
                <TouchableOpacity
                  key={ym}
                  style={[
                    styles.monthPickerOption,
                    selectedMonth === ym && styles.monthPickerOptionActive,
                  ]}
                  onPress={() => handleMonthSelect(ym)}
                >
                  <Text
                    style={[
                      styles.monthPickerOptionText,
                      selectedMonth === ym &&
                        styles.monthPickerOptionTextActive,
                    ]}
                  >
                    {formatMonthYear(ym)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {daysInSelectedMonth.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="calendar-outline"
              size={34}
              color="#006272"
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyStateTitle}>Không có dữ liệu</Text>
            <Text style={styles.emptyStateDesc}>
              {selectedMonth} chưa có chấm công
            </Text>
          </View>
        ) : (
          <View style={styles.monthRecordsContainer}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthHeaderTitle}>
                {formatMonthYear(selectedMonth)}
              </Text>
              <View style={styles.monthHeaderStats}>
                <Text style={styles.monthHeaderCount}>
                  {selectedMonthRecords.length} lần chấm công
                </Text>
              </View>
            </View>
            <View style={styles.daysContainer}>
              {daysInSelectedMonth.map((day, index) => {
                const dayRecord = selectedMonthRecords.find(
                  (r) => r.check_in_time.split("T")[0] === day,
                );
                if (!dayRecord) return null;
                return (
                  <View key={day}>
                    <View style={styles.dayRecordContainer}>
                      <AttendanceSummary
                        record={dayRecord}
                        selectedDate={day}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  monthPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E8E8E4",
    gap: 8,
  },
  pickerIcon: {
    marginRight: 4,
  },
  monthPickerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  monthPickerDropdown: {
    marginTop: 3,
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E8E8E4",
    maxHeight: 280,
    overflow: "hidden",
  },
  monthPickerScroll: {
    maxHeight: 280,
  },
  monthPickerOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  monthPickerOptionActive: {
    backgroundColor: "transparent",
  },
  monthPickerOptionText: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  monthPickerOptionTextActive: {
    color: "#1A1A1A",
  },
  monthPickerOptionCount: {
    fontSize: 12,
    color: "#006272",
    fontWeight: "400",
  },
  monthPickerOptionCountActive: {
    color: "#006272",
    fontWeight: "600",
  },
  noMonthsText: {
    paddingVertical: 15,
    alignItems: "center",
  },
  noMonthsLabel: {
    fontSize: 13,
    color: "#006272",
  },
  summaryContainer: {
    marginBottom: 15,
  },
  monthRecordsContainer: {
    marginBottom: 10,
  },
  monthHeader: {
    backgroundColor: "transparent",
    borderRadius: 27,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#E8E8E4",
  },
  monthHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  monthHeaderStats: {
    flexDirection: "row",
    gap: 16,
  },
  monthHeaderCount: {
    fontSize: 13,
    color: "#6B6B68",
    fontWeight: "500",
  },
  monthHeaderDays: {
    fontSize: 13,
    color: "#6B6B68",
    fontWeight: "500",
  },
  daysContainer: {
    backgroundColor: "transparent",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#E8E8E4",
    marginTop: 13,
  },
  dayDayOfWeek: {
    fontSize: 12,
    color: "#006272",
    fontWeight: "400",
    textTransform: "capitalize",
  },
  dayRecordContainer: {
    backgroundColor: "transparent",
    borderRadius: 28,
    padding: 10,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "transparent",
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "#E8E8E4",
    marginTop: 10,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  emptyStateDesc: {
    fontSize: 14,
    color: "#6B6B68",
    textAlign: "center",
  },
});
