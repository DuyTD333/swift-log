import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CalendarCell from "./CalendarCell";

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  attendanceDates: string[];
}

export function Calendar({
  selectedDate,
  onDateSelect,
  attendanceDates,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const daysLabel = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const currentDay = new Date().getDate();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days: (number | null)[] = [];
  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);

  for (let i = firstDay; i > 1; i--) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleGetDateString = (day: number | null) => {
    const formattedDay = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return day ? formattedDay : null;
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.navButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{monthName}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navButton}>→</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const monthName = `${String(currentMonth.getMonth() + 1).padStart(2, "0")}/${currentMonth.getFullYear()}`;

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.weekdaysRow}>
        {daysLabel.map((day) => (
          <Text key={day} style={styles.weekdayLabel}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.gridContainer}>
        {days.map((day, index) => {
          const dateStr = handleGetDateString(day);
          const isSelected = dateStr === selectedDate;
          const hasAttendance = dateStr && attendanceDates.includes(dateStr);
          return (
            <CalendarCell
              key={index}
              day={day}
              dateStr={dateStr}
              isSelected={isSelected}
              hasAttendance={hasAttendance}
              index={index}
              currentDay={currentDay}
              onDateSelect={onDateSelect}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    borderRadius: 28,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E8E8E4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navButton: {
    fontSize: 18,
    color: "#6B6B68",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
    color: "#6B6B68",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxHeight: 215,
  },
});
