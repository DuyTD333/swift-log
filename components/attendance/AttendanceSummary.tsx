import type { AttendanceRecord } from "@/features/attendance/attendanceTypes";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AttendanceInformation } from "./AttendanceInformation";
import AttendanceSummaryHeader from "./AttendanceSummaryHeader";

interface AttendanceSummaryProps {
  record: AttendanceRecord;
  selectedDate: string;
}

interface AttendanceStats {
  checkinTime: string | null;
  checkoutTime: string | null;
  totalHours: number;
  totalSalary: number;
  status: "complete" | "incomplete";
}

export function AttendanceSummary({
  record,
  selectedDate,
}: AttendanceSummaryProps) {
  const calculateStats = () => {
    if (!record.check_in_time || !record.check_out_time) {
      return {
        checkinTime: null,
        checkoutTime: null,
        totalHours: 0,
        totalSalary: 0,
        status: "incomplete",
      } as AttendanceStats;
    }

    const checkinTime = new Date(record.check_in_time);
    const checkoutTime = new Date(record.check_out_time);
    const diffHours =
      (checkoutTime.getTime() - checkinTime.getTime()) / (1000 * 60 * 60);
    const totalHours = Math.round(diffHours * 100) / 100;
    let totalSalary = totalHours * 19000; // Lương 19k/giờ
    if (totalHours >= 8) {
      totalSalary += 20000; // Thưởng 20k nếu đủ 8 tiếng
    }

    return {
      checkinTime: checkinTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      checkoutTime: checkoutTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      totalHours,
      totalSalary,
      status: "complete",
    } as AttendanceStats;
  };

  const stats = calculateStats();

  return (
    <View style={styles.container}>
      <AttendanceSummaryHeader selectedDate={selectedDate} />
      <View style={styles.cardsGrid}>
        <AttendanceInformation
          label={"Check-in"}
          value={stats.checkinTime}
          valueColor={"#006272"}
        />
        <AttendanceInformation
          label={"Check-out"}
          value={stats.checkoutTime}
          valueColor={"#993C1D"}
        />
        <AttendanceInformation
          label={"Tổng giờ"}
          value={stats.totalHours >= 0 ? `${stats.totalHours} h` : "—"}
          valueColor={"#185FA5"}
        />
        <AttendanceInformation
          label={"Tiền Lương"}
          value={`${stats.totalSalary.toLocaleString()} đ`}
          valueColor={"#185FA5"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "#E8E8E4",
  },
  cardsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 5,
  },
  card: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 8,
    padding: 4,
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 11,
    color: "#6B6B68",
    marginBottom: 3,
  },
  cardValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  logContainer: {
    borderTopWidth: 0.5,
    borderTopColor: "#E8E8E4",
    paddingTop: 16,
  },
  logTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B6B68",
    marginBottom: 12,
  },
  logItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeline: {
    width: 30,
    alignItems: "center",
    marginRight: 12,
  },
  timelineConnector: {
    position: "absolute",
    width: 2,
    height: 40,
    backgroundColor: "#D3D1C7",
    top: 16,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 1,
  },
  logContent: {
    flex: 1,
  },
  logTime: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  logLocation: {
    fontSize: 12,
    color: "#6B6B68",
    marginBottom: 2,
  },
  logMethod: {
    fontSize: 11,
    color: "#9A9A96",
  },
});
