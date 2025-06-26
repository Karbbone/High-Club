import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEvents } from "@/services/EventService";
import dateFormat from "dateformat";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EventScreen() {
  const { data: events, isLoading, error } = useEvents();
  const router = useRouter();

  if (isLoading)
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ color: "#fff" }}>Loading...</ThemedText>
      </ThemedView>
    );
  //to-do return error page
  if (error)
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ paddingTop: 20, color: "#fff" }}>
          Error: {error.message}
        </ThemedText>
      </ThemedView>
    );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Événements à venir</ThemedText>
      <ScrollView style={{ flex: 1, marginBottom: 80 }}>
        {events && events.data.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#fff" }}>
            Aucun événement à venir
          </Text>
        )}
        {events.data.length > 0 &&
          events.data.map((event) => (
            <View key={event.id} style={styles.card}>
              <Image
                source={{
                  uri:
                    event.images[0].link || "https://via.placeholder.com/300",
                }}
                style={styles.imagePlaceholder}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <View style={{ maxWidth: "50%" }}>
                  <Text style={styles.sectionTitle}>{event.name}</Text>
                  <Text style={styles.sectionProps}>{event.description}</Text>
                  <Text style={styles.sectionProps}>
                    {dateFormat(event.startDatetime, "ddd dd mmm, hh:MM")}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.reserveBtn}
                  onPress={() =>
                    router.navigate({
                      pathname: `booking/${event.id}`,
                      params: { event: JSON.stringify(event) },
                    })
                  }
                >
                  <Text style={styles.reserveBtnText}>Réservation</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: "#192734",
    paddingTop: Platform.select({
      ios: 80,
      android: 80,
      default: 20,
    }),
    paddingBottom: 20,
  },
  title: {
    marginBottom: 8,
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1.8,
    backgroundColor: "#B0B3B8",
    borderRadius: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 4,
    color: "#fff",
  },
  sectionProps: {
    color: "#ccc",
    fontSize: 15,
  },
  reserveBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  reserveBtnText: {
    color: "#192734",
    fontWeight: "bold",
    fontSize: 18,
  },
});
