import { useColorScheme } from "@/hooks/useColorScheme";
import NetInfo from "@react-native-community/netinfo";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  AppState,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const router = useRouter();
  const segments = useSegments();
  const isChatbot = segments[0] === "chatbot";
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
  });

  function onAppStateChange(status) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              title: "Home",
            }}
          />
          <Stack.Screen name="scanner" options={{ title: "Scanner" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
        {!isChatbot && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.navigate("chatbot")}
          >
            <Text style={styles.fabIcon}>💬</Text>
          </TouchableOpacity>
        )}
      </ThemeProvider>
      <Toast position="top" />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    top: Platform.OS === "ios" ? 56 : 24, // ← plus haut sur iOS
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 28,
    color: "#192734",
  },
});
