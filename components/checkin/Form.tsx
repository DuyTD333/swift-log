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
