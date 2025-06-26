import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEvents } from '@/services/EventService';
import { Event } from '@/types/IEvent';
import { useNavigation } from '@react-navigation/native';
import dateFormat from "dateformat";
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function BookingScreen() {
  const { id, event } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  
  const [users, setUsers] = useState([
    { email: '', softs: 0, alcohols: 0 }
  ]);

  const [total, setTotal] = useState(0);
  useEffect(() => {
    const totalSofts = users.reduce((sum, user) => sum + user.softs, 0);
    const totalAlcohols = users.reduce((sum, user) => sum + user.alcohols, 0);
    setTotal(totalSofts * 12 + totalAlcohols * 8 + (users.length * 15));
  }, [users]);


  const addUser = () => {
    setUsers([...users, { email: '', softs: 0, alcohols: 0 }]);
  };

  const updateUser = (idx, field, value) => {
    const updated = [...users];
    updated[idx][field] = value;
    setUsers(updated);
  };

  // Fonction pour supprimer une place
  const removeUser = (idx) => {
    setUsers(users.filter((_, i) => i !== idx));
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Réservation' });
  }, [navigation]);
  
  const { data: events, isLoading, error } = useEvents();

  const parsedEvent: Event | null = event ? JSON.parse(event) : null;

  if (isLoading) return <Text>Loading...</Text>;
  //to-do return error page
  if (error) return <Text style={{ paddingTop: 20 }}>Error: {error.message}</Text>;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Réserver vos places</ThemedText>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Image
          source={{ uri: parsedEvent.images[0].link || 'https://via.placeholder.com/300' }}
          style={styles.imagePlaceholder}
        />
        <Text style={styles.sectionTitle}>{parsedEvent.name}</Text>
        <Text style={styles.subTitle}>{parsedEvent.artist}</Text>
        <Text style={styles.sectionProps}>{parsedEvent.description}</Text>

        <View style={styles.dateRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.dateIcon}>🗓️</Text>
            <View>
              <Text style={styles.dateText}>{dateFormat(parsedEvent.startDatetime, 'ddd dd mmm, hh:MM')}</Text>
              <Text style={styles.dateText}>{dateFormat(parsedEvent.endDatetime, 'ddd dd mmm, hh:MM')}</Text>
            </View>
          </View>
        </View>
        
        <ThemedView style={{ backgroundColor: 'fff' }}>
              <ThemedText type="title" style={styles.title}>Précommande billets & boissons</ThemedText>
              <ScrollView style={{ flex: 1, marginBottom: 80 }}>
                {users.map((user, idx) => (
                  <View key={idx} style={styles.card}>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeUser(idx)}
                      hitSlop={10}
                    >
                      <Text style={styles.removeBtnText}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.sectionTitle}>Utilisateur {idx + 1}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={user.email}
                      onChangeText={text => updateUser(idx, 'email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <Text style={styles.sectionProps}>Précommande boissons :</Text>
                    <View style={styles.drinkRow}>
                      <Text>Boissons Alcoolisées</Text>
                      <View style={styles.counter}>
                        <TouchableOpacity onPress={() => updateUser(idx, 'alcohols', Math.max(0, user.alcohols - 1))} style={styles.counterBtn}>
                          <Text style={styles.counterBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{user.alcohols}</Text>
                        <TouchableOpacity onPress={() => updateUser(idx, 'alcohols', user.alcohols + 1)} style={styles.counterBtn}>
                          <Text style={styles.counterBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.drinkRow}>
                      <Text>Boissons Softs</Text>
                      <View style={styles.counter}>
                        <TouchableOpacity onPress={() => updateUser(idx, 'softs', Math.max(0, user.softs - 1))} style={styles.counterBtn}>
                          <Text style={styles.counterBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{user.softs}</Text>
                        <TouchableOpacity onPress={() => updateUser(idx, 'softs', user.softs + 1)} style={styles.counterBtn}>
                          <Text style={styles.counterBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={styles.addBtn} onPress={addUser}>
                  <Text style={styles.addBtnText}>Ajouter une place</Text>
                </TouchableOpacity>
              </ScrollView>
            </ThemedView>
        </ScrollView>
        <Text style={styles.total}>Total de votre réservation : {total} €</Text>

        <TouchableOpacity style={styles.reserveBtn} onPress={() => {
              Toast.show({
                type: 'success',
                text1: 'Réservation réussie',
                text2: 'Votre réservation a bien été prise en compte.',
                onHide: () => {
                  // router.navigate('/commandes');
                }
              });
              router.navigate('/commandes');
            }}>
          <Text style={styles.reserveBtnText}>Réserver</Text>
        </TouchableOpacity>

        <Text style={styles.pointsText}>
          Grâce à cette réservation vous obtiendrez 135 points !{' '}
          <Text style={styles.link}>Découvrir mes avantages</Text>
        </Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1.8,
    backgroundColor: '#AEB1B7',
    borderRadius: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 2,
  },
  sectionProps: {
    color: '#888',
    fontSize: 15,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#222',
  },
  changeText: {
    color: '#888',
    fontWeight: '500',
    fontSize: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  pricePer: {
    fontSize: 17,
    fontWeight: '500',
    color: '#222',
  },
  priceTotal: {
    color: '#888',
    fontSize: 14,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center',
    color: '#222',
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 10,
    marginBottom: 10,
    color: '#222',
  },
  drinkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  drinkTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  drinkSub: {
    color: '#888',
    fontSize: 14,
  },
  total: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 18,
    marginBottom: 14,
    color: '#222',
  },
  reserveBtn: {
    backgroundColor: '#222',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  reserveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  pointsText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  link: {
    color: '#8f5fff',
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: '#222',
  },
  card: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#8f5fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: '#eee',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  removeBtnText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});
