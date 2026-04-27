import React from "react";
import { StyleSheet, View } from "react-native";

export interface ModeToggleProps {
  children: React.ReactNode;
}

export default function ModeToggle({ children }: ModeToggleProps) {
  return <View style={styles.modeToggle}>{children}</View>;
}

const styles = StyleSheet.create({
  modeToggle: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingVertical: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E8E8E4",
    gap: 10,
  },
});
