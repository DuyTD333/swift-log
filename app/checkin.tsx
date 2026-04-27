import type { AppDispatch, RootState } from "@/store";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIn,
  checkOut,
  clearCurrentRecord,
  fetchAttendanceByDate,
  updateAttendance,
} from "../features/attendance/attendanceSlice";
import { AttendanceRecord } from "@/features/attendance/attendanceTypes";
import Form from "@/components/checkin/Form";
import Button from "@/components/Button";

interface CheckIn {
  hour: string;
  minute: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CheckOut extends CheckIn {}

const initTime = {
  hour: "",
  minute: "",
};

export default function CheckInScreen() {
  const { date } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { status, currentRecord, isLoading } = useSelector(
    (s: RootState) => s.attendance,
  );

  const [editingRecord, setEditingRecord] =
    React.useState<AttendanceRecord | null>(null);
  const [checkInTime, setCheckInTime] = React.useState<CheckIn>(initTime);
  const [checkOutTime, setCheckOutTime] = React.useState<CheckOut>(initTime);
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  // console.log("=============================================");
  // console.log("=============================================");
  // console.log("=============================================");
  // console.log(JSON.stringify(editingRecord, null, 2));
  // console.log('CheckInTime: ', JSON.stringify(checkInTime, null, 2));
  // console.log('CheckOutTime', JSON.stringify(checkOutTime, null, 2));
  // console.log("=============================================");
  // console.log("=============================================");
  // console.log("=============================================");

  const getRecordForDate = useCallback(async () => {
    const record = await dispatch(fetchAttendanceByDate(date as string));
    if (!record.payload) {
      return;
    }
    const rec = record.payload as AttendanceRecord;
    setEditingRecord(rec);
    if (rec.check_in_time) {
      const date = new Date(rec.check_in_time);
      setCheckInTime({
        hour: String(date.getHours()).padStart(2, "0"),
        minute: String(date.getMinutes()).padStart(2, "0"),
      });
    }
    if (rec.check_out_time) {
      const date = new Date(rec.check_out_time);
      setCheckOutTime({
        hour: String(date.getHours()).padStart(2, "0"),
        minute: String(date.getMinutes()).padStart(2, "0"),
      });
    }
  }, [date, dispatch]);

  const handleCheckIn = useCallback(async () => {
    if (checkInTime.hour === "" || checkInTime.minute === "") {
      setErrorMsg("Vui lòng nhập giờ và phút");
      return;
    } else {
      setErrorMsg("");
    }

    console.log('handleCheckIn: ', JSON.stringify({
        locationId: "LOTSO",
        locationName: "LOTSO",
        method: "manual",
        date: date as string,
        hour: parseInt(checkInTime.hour, 10),
        minute: parseInt(checkInTime.minute, 10),
      }, null, 2));

    await dispatch(
      checkIn({
        locationId: "LOTSO",
        locationName: "LOTSO",
        method: "manual",
        date: date as string,
        hour: parseInt(checkInTime.hour, 10),
        minute: parseInt(checkInTime.minute, 10),
      }),
    );
    setCheckInTime({ hour: "", minute: "" });
    setTimeout(() => {
      router.back();
    }, 500);
  }, [checkInTime.hour, checkInTime.minute, date, dispatch]);

  const handleCheckOut = useCallback(async () => {
    if (!currentRecord && !editingRecord) return;
    if (checkOutTime.hour === "" || checkOutTime.minute === "") {
      setErrorMsg("Vui lòng nhập giờ và phút");
      return;
    } else {
      setErrorMsg("");
    }

    await dispatch(
      checkOut({
        hour: parseInt(checkOutTime.hour, 10),
        minute: parseInt(checkOutTime.minute, 10),
      }),
    );
    dispatch(clearCurrentRecord());
    setCheckOutTime({ hour: "", minute: "" });
    router.back();
  }, [
    currentRecord,
    editingRecord,
    checkOutTime.hour,
    checkOutTime.minute,
    dispatch,
  ]);

  const handleUpdate = useCallback(async () => {
    if (checkInTime.hour === "" || checkInTime.minute === "") {
      setErrorMsg("Vui lòng nhập giờ và phút");
      return;
    } else if (checkOutTime.hour === "" || checkOutTime.minute === "") {
      setErrorMsg("Vui lòng nhập giờ và phút");
      return;
    }
    const updatedAttendance = await dispatch(
      updateAttendance({
        check_in_hour: parseInt(checkInTime.hour, 10),
        check_in_minute: parseInt(checkInTime.minute, 10),
        check_out_hour: parseInt(checkOutTime.hour, 10),
        check_out_minute: parseInt(checkOutTime.minute, 10),
        date: date as string,
      }),
    );
    console.log("updatedAttendance: ", updatedAttendance);
    setCheckInTime(initTime);
    setCheckOutTime(initTime);
    setEditingRecord(null);
    router.back();
  }, [checkInTime, checkOutTime.hour, checkOutTime.minute, date, dispatch]);

  useEffect(() => {
    getRecordForDate();
  }, [getRecordForDate]);

  const subtitleText = new Date(date as string).toLocaleDateString("vi-VN", {
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
        {editingRecord ? (
          <Text style={styles.checkInTime}>
            Check-in lúc{" "}
            {new Date(editingRecord.check_in_time).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        ) : (
          <Text style={styles.emptyText}>Nhấn để ghi nhận chấm công</Text>
        )}
      </View>
      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
      <Form
        hour={checkInTime.hour}
        hourLabel={"Giờ"}
        minute={checkInTime.minute}
        minuteLabel={"Phút"}
        onChangeHour={(hour: string) =>
          setCheckInTime((prev) => ({ ...prev, hour: hour }))
        }
        onChangeMinute={(minute: string) =>
          setCheckInTime((prev) => ({ ...prev, minute: minute }))
        }
      />
      {!editingRecord && (
        <View style={styles.buttonWrapper}>
          <View style={{ width: 150 }}>
            <Button
              label={"Check In"}
              onPress={handleCheckIn}
              isDisabled={isLoading}
            />
          </View>
        </View>
      )}
      <Form
        hour={checkOutTime.hour}
        hourLabel={"Giờ"}
        minute={checkOutTime.minute}
        minuteLabel={"Phút"}
        onChangeHour={(hour: string) =>
          setCheckOutTime((prev) => ({ ...prev, hour: hour }))
        }
        onChangeMinute={(minute: string) =>
          setCheckOutTime((prev) => ({ ...prev, minute: minute }))
        }
      />
      {!editingRecord && (
        <View style={styles.buttonWrapper}>
          <View style={{ width: 150 }}>
            <Button
              label={"Check Out"}
              onPress={handleCheckOut}
              isDisabled={isLoading}
            />
          </View>
        </View>
      )}
      {editingRecord && (
        <View style={[styles.buttonWrapper, { marginTop: 10 }]}>
          <View style={{ width: 150 }}>
            <Button
              label={"Update"}
              onPress={handleUpdate}
              isDisabled={isLoading}
            />
          </View>
        </View>
      )}
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
  checkInTime: {
    fontSize: 15,
    color: "#006272",
    marginBottom: 10,
    marginTop: 10,
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
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
});
