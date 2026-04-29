import { HistoryViewMode } from "@/app/history";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface ModeProps {
  label: string;
  mode: HistoryViewMode;
  viewMode: HistoryViewMode;
  setViewMode: (mode: "month" | "day") => void;
}

export default function Mode({
  label,
  mode,
  viewMode,
  setViewMode,
}: ModeProps) {
  return (
    <TouchableOpacity
      style={[styles.modeButton, viewMode === mode && styles.modeButtonActive]}
      onPress={() => setViewMode(mode)}
      activeOpacity={0.7}
    >
      <Text style={viewMode === mode ? styles.modeTextActive : styles.modeText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  modeButtonActive: {
    backgroundColor: "#006272",
  },
  modeText: {
    color: "#006272",
    fontWeight: "600",
    fontSize: 13,
  },
  modeTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});
