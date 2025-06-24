import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useHello } from '@/controller/HelloWorld';
import { StyleSheet, Text } from 'react-native';

export default function BookingScreen() {
  const { data: data, isLoading, error } = useHello();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Mes Réservations</ThemedText>
      <ThemedText type='default'> { data.hello }</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  bookingItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
  },
});
