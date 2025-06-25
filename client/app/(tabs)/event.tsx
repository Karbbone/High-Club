import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DateFormatterService } from '@/services/DateFormatterService';
import { useEvents } from '@/services/EventService';
import { Image } from 'expo-image';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EventScreen() {
  const { data: events, isLoading, error } = useEvents();
  
  if (isLoading) return <Text>Loading...</Text>;
  //to-do return error page
  if (error) return <Text style={{ paddingTop: 20 }}>Error: {error.message}</Text>;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Événements à venir</ThemedText>
      <ScrollView>
        {events && events.data.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun événement à venir</Text>
        )}
        {events.data.length > 0 && events.data.map((event, idx) => (
          <View key={idx} style={styles.card}>
            <Image
              source={{ uri: event.images[0].link || 'https://via.placeholder.com/300' }}
              style={styles.imagePlaceholder}
            />
            <Text style={styles.sectionTitle}>{event.artist}</Text>
            <Text style={styles.sectionProps}>{event.description}</Text>
            <Text style={styles.sectionProps}>{DateFormatterService.format(event.startDatetime, 'DD-MM-YYYY / HH:mm')}</Text>
            <Text style={styles.sectionProps}>{DateFormatterService.format(event.endDatetime, 'DD-MM-YYYY / HH:mm')}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.fab}>
        <Text style={styles.fabIcon}>😊</Text>
      </View>
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
    fontWeight: 'bold',
    color: '#222',
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
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabIcon: {
    fontSize: 28,
    color: '#fff',
  },
});
