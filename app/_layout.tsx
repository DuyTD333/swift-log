import { loadAttendanceFromStorage } from "@/features/attendance/attendanceSlice";
import { AppDispatch, persistor, store } from "@/store";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0F6E56" />
    </View>
  );
}

function RootStackWithInitialization() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load attendance data from AsyncStorage on app start
    dispatch(loadAttendanceFromStorage());
  }, [dispatch]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="checkin" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <RootStackWithInitialization />
        </PersistGate>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
