import { TextInput, StyleSheet } from "react-native";

interface TInputProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}

export default function NInput({
  value,
  placeholder,
  onChangeText,
}: TInputProps) {
  return (
    <TextInput
      style={styles.timeInput}
      keyboardType="numeric"
      maxLength={2}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  timeInput: {
    width: 135,
    height: 43,
    borderWidth: 2,
    borderColor: "#E8E8E4",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
  },
});
