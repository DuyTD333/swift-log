// // src/services/attendanceService.ts
// import type {
//   AttendanceRecord,
//   CheckInMethod,
// } from "@/features/attendance/attendanceTypes";

// export const attendanceService = {
//   async checkIn(method: CheckInMethod): Promise<AttendanceRecord | boolean> {
//     // try {
//     //   const {
//     //     data: { user },
//     //   } = await supabase.auth.getUser();
//     //   if (!user) throw new Error("Người dùng chưa đăng nhập");

//     //   // Lấy tọa độ GPS (optional)
//     //   let coordinates = null;
//     //   const { status } = await Location.requestForegroundPermissionsAsync();
//     //   if (status === "granted") {
//     //     const loc = await Location.getCurrentPositionAsync({});
//     //     coordinates = {
//     //       latitude: loc.coords.latitude,
//     //       longitude: loc.coords.longitude,
//     //     };
//     //   }

//     //   const { data, error } = await supabase
//     //     .from("attendance")
//     //     .insert({
//     //       user_id: user.id,
//     //       location_id: params.locationId,
//     //       location_name: params.locationName,
//     //       check_in_time: new Date().toISOString(),
//     //       method: params.method,
//     //       coordinates,
//     //     })
//     //     .select()
//     //     .single();

//     //   if (error) throw error;

//     // Log analytics event
//     //   await crashlytics().log(`Check-in: ${params.locationName}`);
//     // return data;
//     return true;
//     // } catch (error: any) {
//     //   crashlytics().recordError(error as Error);
//     // console.log("[AttendanceService] Check-in error:", error.message);
//     // throw error;
//     // }
//   },

//   async checkOut(recordId: string): Promise<AttendanceRecord | boolean> {
//     // const { data, error } = await supabase
//     //   .from("attendance")
//     //   .update({ check_out_time: new Date().toISOString() })
//     //   .eq("id", recordId)
//     //   .select()
//     //   .single();

//     // if (error) {
//     // crashlytics().recordError(error as Error);
//     // throw error;
//     // return data;
//     // }
//     return false;
//   },

//   async syncPendingRecords(records: AttendanceRecord[]): Promise<void> {
//     if (!records.length) return;
//     // const { error } = await supabase.from("attendance").upsert(records);
//     // if (error) crashlytics().recordError(error as Error);
//   },
//   async getHistory(params: {
//     userId: string;
//     startDate: string;
//     endDate: string;
//   }): Promise<AttendanceRecord[]> {
//     // try {
//     // const { data, error } = await supabase
//     //   .from("attendance")
//     //   .select("*")
//     //   .eq("user_id", params.userId)
//     //   .gte("check_in_time", params.startDate)
//     //   .lte("check_in_time", params.endDate)
//     //   .order("check_in_time", { ascending: false });

//     // if (error) throw error;
//     // return data || [];
//     return [];
//     // } catch (error) {
//     // console.error("[AttendanceService] getHistory failed:", error);
//     // throw error;
//     // }
//   },

//   async getByDate(date: string): Promise<AttendanceRecord[]> {
//     // try {
//     //   const {
//     //     data: { user },
//     //   } = await supabase.auth.getUser();
//     //   if (!user) throw new Error("Người dùng chưa đăng nhập");

//     //   const startOfDay = `${date}T00:00:00Z`;
//     //   const endOfDay = `${date}T23:59:59Z`;

//     //   const { data, error } = await supabase
//     //     .from("attendance")
//     //     .select("*")
//     //     .eq("user_id", user.id)
//     //     .gte("check_in_time", startOfDay)
//     //     .lte("check_in_time", endOfDay)
//     //     .order("check_in_time", { ascending: true });

//     //   if (error) throw error;
//     //   return data || [];
//     // } catch (error) {
//     //   console.error("[AttendanceService] getByDate failed:", error);
//     //   throw error;
//     // }
//     return [];
//   },

//   calculateWorkHours(records: AttendanceRecord[]): {
//     checkinTime: string | null;
//     checkoutTime: string | null;
//     totalHours: number;
//   } {
//     const checkins = records.filter((r) => !r.check_out_time);
//     const checkouts = records.filter((r) => r.check_out_time);

//     if (!checkins.length || !checkouts.length) {
//       return { checkinTime: null, checkoutTime: null, totalHours: 0 };
//     }

//     const checkinTime = new Date(checkins[0].check_in_time);
//     const checkoutTime = new Date(checkouts[0].check_out_time!);
//     const totalMs = checkoutTime.getTime() - checkinTime.getTime();
//     const totalHours = totalMs / (1000 * 60 * 60);

//     return {
//       checkinTime: checkinTime.toLocaleTimeString("vi-VN", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       checkoutTime: checkoutTime.toLocaleTimeString("vi-VN", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       totalHours: Math.round(totalHours * 100) / 100,
//     };
//   },
// };
