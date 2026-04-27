import { StyleSheet, Text, View } from "react-native";

export default function HistoryHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.titleSection}>
        <View>
          <Text style={styles.title}>Chấm công</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
        </View>
        {/* <View style={{ width: 100 }}>
          <Button onPress={() => router.push("/checkin")} label="Nhập" />
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  titleSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B6B68",
  },
});
