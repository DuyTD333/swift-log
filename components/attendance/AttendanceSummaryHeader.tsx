import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AttendanceSummaryHeaderProps {
  selectedDate: string;
}

export default function AttendanceSummaryHeader({
  selectedDate,
}: AttendanceSummaryHeaderProps) {
  const dateLabel = new Date(selectedDate).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dateLabel}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push({
            pathname: "/checkin",
            params: { date: selectedDate },
          });
        }}
      >
        <View style={styles.buttonBox}>
          <Text style={styles.buttonText}>Sửa</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
    color: "#1A1A1A",
  },
  button: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
    color: "#1A1A1A",
  },
  buttonBox: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#006272",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  buttonText: {
    flex: 1,
    fontSize: 12,
    color: "#ffffff",
  },
});
