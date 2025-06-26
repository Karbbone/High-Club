import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { useCameraPermissions } from "expo-camera";

export default function Camera() {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#192734", dark: "#192734" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Overview", headerShown: false }} />
        <Text style={styles.title}>QR Code Scanner</Text>
        <View style={{ gap: 20 }}>
          <Pressable onPress={requestPermission}>
            <Text style={styles.buttonStyle}>Request Permissions</Text>
          </Pressable>
          <Link href={"/scanner"} asChild>
            <Pressable disabled={!isPermissionGranted}>
              <Text
                style={[
                  styles.buttonStyle,
                  { opacity: !isPermissionGranted ? 0.5 : 1 },
                ]}
              >
                Scan Code
              </Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#192734",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonStyle: {
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#192734",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    overflow: "hidden",
  },
});
