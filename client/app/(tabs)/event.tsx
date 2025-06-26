import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEvents } from '@/services/EventService';
import dateFormat from "dateformat";
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



export default function EventScreen() {
  const { data: events, isLoading, error } = useEvents();
  const router = useRouter();

  if (isLoading) return <Text>Loading...</Text>;
  //to-do return error page
  if (error)
    return <Text style={{ paddingTop: 20 }}>Error: {error.message}</Text>;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Événements à venir</ThemedText>
      <ScrollView style={{ flex: 1, marginBottom: 80 }} >
        {events && events.data.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Aucun événement à venir
          </Text>
        )}
        {events.data.length > 0 &&
          events.data.map((event, idx) => (
            <View key={idx} style={styles.card}>
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
                  <Text style={styles.sectionProps}>
                    {dateFormat(event.endDatetime, "ddd dd mmm, hh:MM")}
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
    backgroundColor: "#fff",
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
    fontWeight: 'bold',
    color: '#222',
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
  },
  sectionProps: {
    color: "#888",
    fontSize: 15,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: Platform.OS === "ios" ? 100 : 24, // ← plus haut sur iOS
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  fabIcon: {
    fontSize: 28,
    color: "#fff",
  },
  reserveBtn: {
    backgroundColor: '#222',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  reserveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
