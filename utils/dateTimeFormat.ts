export function dateToLocaleTimeString(time: Date | string) {
  return new Date(time).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
