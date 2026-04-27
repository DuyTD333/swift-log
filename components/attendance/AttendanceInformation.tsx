import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AttendanceInformationProps {
  label: string;
  value: string | null;
  valueColor: string;
}

export function AttendanceInformation({
  label,
  value,
  valueColor,
}: AttendanceInformationProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, { color: valueColor }]}>
        {value || "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E8E8E4",
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
});
