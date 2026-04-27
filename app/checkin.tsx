import type { AppDispatch, RootState } from "@/store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIn,
  checkOut,
  clearCurrentRecord,
  fetchAttendanceByDate,
} from "../features/attendance/attendanceSlice";

export default function CheckInScreen() {
  const { date } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { status, currentRecord, isLoading } = useSelector(
    (s: RootState) => s.attendance,
  );

  const [editingRecord, setEditingRecord] = React.useState<any | null>(null);
  const [hour, setHour] = React.useState<string>("");
  const [minute, setMinute] = React.useState<string>("");
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        if (date && currentRecord?.date === date) {
          setEditingRecord(null);
          dispatch(clearCurrentRecord());
          setHour("");
          setMinute("");
          return;
        }

        if (date && currentRecord?.date === date) {
          setEditingRecord(currentRecord);
        }
      } catch (error: any) {
        console.log("Error loading current record into state", error);
      }
    })();
  }, [currentRecord, date, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const action = await dispatch(fetchAttendanceByDate(date as string));
        console.log("Fetched attendance for date", date, action);
        const payload = (action as any).payload;
        if (Array.isArray(payload) && payload.length > 0) {
          const rec = payload[0];
          setEditingRecord(rec);
          if (rec.check_in_time) {
            const d = new Date(rec.check_in_time);
            setHour(String(d.getHours()).padStart(2, "0"));
            setMinute(String(d.getMinutes()).padStart(2, "0"));
          }
        }
      } catch (e: any) {
        console.log("Failed to fetch attendance for date", date, e);
        setErrorMsg("Không thể tải dữ liệu chấm công cho ngày này");
      }
    })();
  }, [dispatch, date]);

  const handleCheckIn = useCallback(async () => {
    if (hour === "" || minute === "") {
      setErrorMsg("Vui lòng nhập giờ và phút");
      return;
    } else {
      setErrorMsg("");
    }
    if (editingRecord) {
      await dispatch(
        checkOut({
          hour: parseInt(hour, 10),
          minute: parseInt(minute, 10),
        }),
      );
    }
    await dispatch(
      checkIn({
        locationId: "VY",
        locationName: "LOTSO",
        method: "manual",
        date: new Date().toISOString().split("T")[0],
        hour: parseInt(hour, 10),
        minute: parseInt(minute, 10),
      }),
    );
    setHour("");
    setMinute("");
    setEditingRecord(null);
  }, [dispatch, editingRecord, hour, minute]);

  const handleCheckOut = useCallback(async () => {
    if (!currentRecord && !editingRecord) return;
    if (hour === "" || minute === "") {
      setErrorMsg("Vui lòng nhập giờ và phút");
      return;
    } else {
      setErrorMsg("");
    }

    await dispatch(
      checkOut({
        hour: parseInt(hour, 10),
        minute: parseInt(minute, 10),
      }),
    );
    dispatch(clearCurrentRecord());
    setHour("");
    setMinute("");
    setEditingRecord(null);
  }, [dispatch, currentRecord, editingRecord, hour, minute]);

  const handleUpdateCheckIn = useCallback(async () => {
    if (!editingRecord) return;
    await handleCheckIn();
    router.back();
  }, [editingRecord, handleCheckIn]);

  const handleUpdateCheckOut = useCallback(async () => {
    if (!editingRecord) return;
    await handleCheckOut();
    router.back();
  }, [editingRecord, handleCheckOut]);

  const renderWhenCheckedIn = () => {
    return currentRecord ? (
      <>
        <Text style={styles.checkInTime}>
          Check-in lúc{" "}
          {new Date(currentRecord.check_in_time).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        {currentRecord.method === "deep_link" && (
          <View style={styles.methodBadge}>
            <Text style={styles.methodBadgeText}>Qua đường dẫn</Text>
          </View>
        )}
      </>
    ) : (
      <Text style={styles.emptyText}>Nhấn để ghi nhận chấm công</Text>
    );
  };

  const renderEditingRecord = () => {
    return (
      <>
        <Text style={styles.checkInTime}>
          Check-in lúc{" "}
          {editingRecord.check_in_time
            ? new Date(editingRecord.check_in_time).toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )
            : "-"}
        </Text>
        {editingRecord.check_out_time && (
          <Text style={styles.checkInTime}>
            Check-out lúc{" "}
            {new Date(editingRecord.check_out_time).toLocaleTimeString(
              "vi-VN",
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            )}
          </Text>
        )}
      </>
    );
  };

  const renderEditingRecordActions = () => {
    return (
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleUpdateCheckIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonPrimaryText}>Cập nhật Check In</Text>
          )}
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleUpdateCheckOut}
          disabled={isLoading}
        >
          <Text style={styles.buttonDangerText}>Cập nhật Check Out</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCheckinStatus = () => {
    return (
      <View style={{ flexDirection: "row", gap: 12, justifyContent: "center" }}>
        {currentRecord?.check_in_time && !currentRecord?.check_out_time && (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleCheckIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonPrimaryText}>Check In</Text>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleCheckOut}
        >
          <Text style={styles.buttonDangerText}>Check Out</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const subtitleText = date
    ? new Date(date as string).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          {status === "checked_in" ? "Đang làm việc" : "Chưa check-in"}
        </Text>
        <Text style={styles.subtitle}>{subtitleText}</Text>
      </View>
      <View
        style={[
          styles.statusCard,
          status === "checked_in" && styles.statusCardActive,
        ]}
      >
        {editingRecord ? renderEditingRecord() : renderWhenCheckedIn()}
      </View>
      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
      <View style={styles.actions}>
        <View style={styles.timeInputContainer}>
          <Text style={styles.timeLabel}>Giờ</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            maxLength={2}
            placeholder="HH"
            value={hour}
            onChangeText={setHour}
          />
          <Text style={[styles.timeLabel, { marginLeft: 12 }]}>Phút</Text>
          <TextInput
            style={styles.timeInput}
            keyboardType="numeric"
            maxLength={2}
            placeholder="MM"
            value={minute}
            onChangeText={setMinute}
          />
        </View>
        {editingRecord ? renderEditingRecordActions() : renderCheckinStatus()}
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
    fontWeight: "bold",
  },
  timeInput: {
    width: 135,
    height: 43,
    borderWidth: 2,
    borderColor: "#E8E8E4",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
  },
  actions: {
    marginTop: 8,
  },
  button: {
    height: 40,
    width: 160,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#006272",
  },
  buttonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonDanger: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#A32D2D",
  },
  buttonDangerText: {
    color: "#A32D2D",
    fontSize: 15,
    fontWeight: "600",
  },
});
