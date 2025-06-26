import { Overlay } from "@/components/Overlay";
import { CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  AppState,
  Platform,
  StatusBar,
  SafeAreaView,
  StyleSheet,
} from "react-native";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
    const router = useRouter();


  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(() => {
              router.push({
                pathname: "/booking-qr/result",
                params: { booking: data }, 
              });
            }, 500);
          }
        }}
      />
      <Overlay />
    </SafeAreaView>
  );
}