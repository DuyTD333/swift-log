// // src/hooks/useHandleDeepLinks.ts
// import { checkIn } from "@/features/attendance/attendanceSlice";
// import type { CheckInDeepLinkParams } from "@/features/attendance/attendanceTypes";
// import crashlytics from "@react-native-firebase/crashlytics";
// import { useURL } from "expo-linking";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// // Validate HMAC token và expiry để chống injection
// function validateDeepLinkParams(
//   params: Partial<CheckInDeepLinkParams>,
// ): params is CheckInDeepLinkParams {
//   if (
//     !params.location_id ||
//     !params.location_name ||
//     !params.token ||
//     !params.expires_at
//   ) {
//     return false;
//   }
//   // Kiểm tra link chưa hết hạn
//   const expiresAt = parseInt(params.expires_at, 10);
//   if (Date.now() / 1000 > expiresAt) {
//     console.warn("[DeepLink] Link đã hết hạn");
//     return false;
//   }
//   // Sanitize: chỉ cho phép alphanumeric + dấu gạch ngang
//   const safePattern = /^[a-zA-Z0-9\-_\s]+$/;
//   if (!safePattern.test(params.location_name)) {
//     console.warn("[DeepLink] location_name không hợp lệ");
//     return false;
//   }
//   return true;
// }

// export function useHandleDeepLinks() {
//   const url = useURL();
//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!url) return;

//     try {
//       const parsed = new URL(url);
//       const path = parsed.pathname;

//       // Route: myapp://attendance/checkin?location_id=...&token=...
//       if (path.includes("/attendance/checkin") || path.includes("checkin")) {
//         const params: Partial<CheckInDeepLinkParams> = {
//           location_id: parsed.searchParams.get("location_id") ?? undefined,
//           location_name: parsed.searchParams.get("location_name") ?? undefined,
//           token: parsed.searchParams.get("token") ?? undefined,
//           expires_at: parsed.searchParams.get("expires_at") ?? undefined,
//         };

//         if (!validateDeepLinkParams(params)) {
//           router.push("/error?reason=invalid_link");
//           return;
//         }

//         dispatch(
//           checkIn({
//             locationId: params.location_id,
//             locationName: params.location_name,
//             method: "deep_link",
//           }),
//         );

//         router.push("/attendance/checkin");
//       }
//     } catch (error) {
//       crashlytics().recordError(error as Error);
//     }
//   }, [url]);
// }
