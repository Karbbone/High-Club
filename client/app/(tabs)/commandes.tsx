import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
// Remplace ce hook par ton vrai hook pour récupérer les billets
import { useUserBooking } from '@/services/UserService';
import { useRouter } from 'expo-router';
import dateFormat from "dateformat";


export default function Commands() {
  const { data: bookings, isLoading, error } = useUserBooking();
  const router = useRouter();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text style={{ paddingTop: 20 }}>Error: {error.message}</Text>;

  return (
    
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Mes Commandes</ThemedText>
      <ScrollView style={{ flex: 1, marginBottom: 80 }}>
        {bookings && bookings.data.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun billet trouvé</Text>
        )}
        {bookings && bookings.data.length > 0 && bookings.data.map((booking, idx) => (
          <View key={idx} style={styles.card}>
            <Image
              source={{ uri: booking.event?.images[0]?.link || 'https://via.placeholder.com/300' }}
              style={styles.imagePlaceholder}
            />
            <Text style={styles.sectionTitle}>{booking.event?.name || 'Événement inconnu'}</Text>
            <Text style={styles.sectionProps}>Date : {dateFormat(booking.event?.startDatetime, "dd mmmm yyyy, hh:mm") || '-'}</Text>
            <TouchableOpacity
              style={styles.reserveBtn}
              onPress={() => router.navigate({ pathname: `booking/${booking.id}`, params: { booking: JSON.stringify(booking) } })}
            >
              <Text style={styles.reserveBtnText}>Réservation</Text>
            </TouchableOpacity>
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
    backgroundColor: '#fff',
    paddingTop: Platform.select({
      ios: 80,
      android: 80,
      default: 20,
    }),
  },
  title: {
    marginBottom: 8,
  },
  card: {
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1.8,
    backgroundColor: '#B0B3B8',
    borderRadius: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
  },
  sectionProps: {
    color: '#888',
    fontSize: 15,
    marginBottom: 16,
  },
  reserveBtn: {
    backgroundColor: '#222',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  reserveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 5,
  },
});