import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CalendarCellProps {
  day: number | null;
  dateStr: string | null;
  isSelected: boolean;
  hasAttendance: boolean | "" | null;
  index: number;
  currentDay: number;
  onDateSelect: (date: string) => void;
}

export default function CalendarCell({
  day,
  dateStr,
  isSelected,
  hasAttendance,
  index,
  currentDay,
  onDateSelect,
}: CalendarCellProps) {
  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.dayCell,
        isSelected && styles.dayCellSelected,
        hasAttendance && !isSelected && styles.dayCellAttendance,
      ]}
      onPress={() => dateStr && onDateSelect(dateStr)}
      disabled={!day}
    >
      <Text
        style={[
          styles.dayText,
          isSelected && styles.dayTextSelected,
          hasAttendance && !isSelected && styles.dayTextAttendance,
          !day && styles.dayTextDisabled,
          day === currentDay && styles.currentDay,
          day === currentDay && isSelected && styles.selectCurrentDay,
        ]}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    borderRadius: 20,
  },
  dayCellSelected: {
    backgroundColor: "#006272",
  },
  dayCellAttendance: {
    backgroundColor: "transparent",
    fontWeight: "bold",
  },
  dayText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#1A1A1A",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  dayTextAttendance: {
    fontWeight: "bold",
    color: "#33818E",
  },
  dayTextDisabled: {
    color: "#D3D1C7",
  },
  selectCurrentDay: {
    color: "#FFFFFF",
  },
  currentDay: {
    color: "#993C1D",
    fontWeight: "bold",
  },
});
