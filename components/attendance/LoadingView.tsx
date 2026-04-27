import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingView() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0F6E56" />
      <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#6B6B68",
    fontWeight: "500",
  },
});
