import { Text, View, StyleSheet } from "react-native";
import NInput from "./NInput";

interface FormProps {
  hour: string;
  hourLabel: string;
  minute: string;
  minuteLabel: string;
  onChangeHour: (hour: string) => void;
  onChangeMinute: (minute: string) => void;
}

export default function Form(params: FormProps) {
  return (
    <View style={styles.actions}>
      <View style={styles.timeInputContainer}>
        <Text style={styles.timeLabel}>{params.hourLabel}</Text>
        <NInput
          value={params.hour}
          placeholder={"HH"}
          onChangeText={params.onChangeHour}
        />
        <Text style={styles.timeLabel}>{params.minuteLabel}</Text>
        <NInput
          value={params.minute}
          placeholder={"MM"}
          onChangeText={params.onChangeMinute}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#d8d4bcf0",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B6B68",
  },
  statusCard: {
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E8E4",
    minHeight: 50,
    justifyContent: "center",
  },
  statusCardActive: {
    borderColor: "#006272",
    backgroundColor: "transparent",
  },
  locationName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  checkInTime: {
    fontSize: 15,
    color: "#006272",
    marginBottom: 10,
    marginTop: 10,
  },
  methodBadge: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  methodBadgeText: {
    fontSize: 12,
    color: "#006272",
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 15,
    color: "#006272",
    textAlign: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#A32D2D",
  },
  errorDismiss: {
    fontSize: 14,
    color: "#A32D2D",
    fontWeight: "600",
    marginLeft: 8,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 14,
    color: "#1A1A1A",
    marginRight: 8,
    marginLeft: 8,
    fontWeight: "bold",
  },
  actions: {
    marginTop: 8,
  },
});
