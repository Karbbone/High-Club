import { useNavigation } from "@react-navigation/native";
import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol"; // Adjust the import path as necessary

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const outer = rrect(rect(0, 0, width, height), 0, 0);
const inner = rrect(
  rect(
    width / 2 - innerDimension / 2,
    height / 2 - innerDimension / 2,
    innerDimension,
    innerDimension
  ),
  50,
  50
);

export const Overlay = () => {
  const navigation = useNavigation();

  const handleClose = () => navigation.goBack();

  return (
    <>
      <Canvas
        style={
          Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
        }
      >
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
      </Canvas>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <IconSymbol size={28} name="arrow.backward.circle.fill" color={'light'} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20, // Adjust position for left arrow
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5, // Adds shadow for Android
    shadowColor: "black", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  closeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});