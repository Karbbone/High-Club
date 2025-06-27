import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
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
  View,
} from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

function AppContent() {
  const router = useRouter();
  const segments = useSegments();
  const isChatbot = segments[0] === "chatbot";
  
  // const { useAuth } = require("@/hooks/useAuth");
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) return;
    
    const isOnAuthPage = segments[0] === "login" || segments[0] === "register";
    
    if (!user && !isOnAuthPage) {
      router.replace("/login");
    } else if (user && isOnAuthPage) {
      router.replace("/(tabs)");
    }
  }, [user, segments, isInitialized, router]);

  if (!isInitialized) {
    return (
      <ThemeProvider value={DarkTheme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#192734' }}>
          <Text style={{ color: '#fff' }}>Chargement...</Text>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            title: "Home",
          }}
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            title: "Connexion" 
          }} 
        />
        <Stack.Screen 
          name="register" 
          options={{ 
            headerShown: false,
            title: "Inscription" 
          }} 
        />
        <Stack.Screen name="scanner" options={{ title: "Scanner" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
      {!isChatbot && user && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.navigate("chatbot")}
        >
          <Text style={styles.fabIcon}>💬</Text>
        </TouchableOpacity>
      )}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();
  useColorScheme();
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
      <AppContent />
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
