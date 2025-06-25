import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Event } from '@/types/IEvent';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import dateFormat from "dateformat";
import {Picker} from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEvents } from '@/services/EventService';
import { useNavigation } from '@react-navigation/native';  

export default function BookingScreen() {
  const { id, event } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Réservation' });
  }, [navigation]);
  
  const { data: events, isLoading, error } = useEvents();

  const parsedEvent: Event | null = event ? JSON.parse(event) : null;


  const [places, setPlaces] = useState(0);
  const [softs, setSofts] = useState(0);
  const [alcohols, setAlcohols] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(places * 25 + softs * 8 + alcohols * 12);
  }, [places, softs, alcohols]);

  const incrementPlaces = () => {
    setPlaces(places + 1);
  };

  const decrementPlaces = () => {
    if (places > 0) setPlaces(places - 1);
  };

  const incrementSofts = () => {
    setSofts(softs + 1);
  };

  const decrementSofts = () => {
    if (softs > 0) setSofts(softs - 1);
  };

  const incrementAlcohols = () => {
    setAlcohols(alcohols + 1);
  };

  const decrementAlcohols = () => {
    if (alcohols > 0) setAlcohols(alcohols - 1);
  };

  if (isLoading) return <Text>Loading...</Text>;
  //to-do return error page
  if (error) return <Text style={{ paddingTop: 20 }}>Error: {error.message}</Text>;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Réserver vos places</ThemedText>
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
        <View>
          <TouchableOpacity>
            <Text style={styles.changeText}>Autre soirées</Text>
            <Picker
              selectedValue={parsedEvent.id}
              onValueChange={(itemValue, itemIndex) =>
                router.navigate({ pathname: `booking/${itemValue}`, params: { event: JSON.stringify(events.data[itemIndex]) } })
              }>
                {events.data.map((event) => (
                  <Picker.Item key={event.id} label={event.name} value={event.id} />
                ))}
            </Picker>
          </TouchableOpacity>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.pricePer}>25€ / Personne</Text>
            <Text style={styles.priceTotal}>75€ total</Text>
          </View>
          <View style={styles.counter}>
            <TouchableOpacity style={styles.counterBtn} onPress={decrementPlaces}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{places}</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={incrementPlaces}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subTitle}>Précommandez vos boissons :</Text>

        <View style={styles.drinkRow}>
          <View>
            <Text style={styles.drinkTitle}>Boissons Alcoolisés</Text>
            <Text style={styles.drinkSub}>12€ par conso</Text>
          </View>
          <View style={styles.counter}>
            <TouchableOpacity style={styles.counterBtn} onPress={decrementAlcohols}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{alcohols}</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={incrementAlcohols}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.drinkRow}>
          <View>
            <Text style={styles.drinkTitle}>Boissons Softs</Text>
            <Text style={styles.drinkSub}>8€ par cons</Text>
          </View>
          <View style={styles.counter}>
            <TouchableOpacity style={styles.counterBtn} onPress={decrementSofts}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterValue}>{softs}</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={incrementSofts}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.total}>Total de votre réservation : {total} €</Text>

        <TouchableOpacity style={styles.reserveBtn}>
          <Text style={styles.reserveBtnText}>Réserver</Text>
        </TouchableOpacity>

        <Text style={styles.pointsText}>
          Grâce à cette réservation vous obtiendrez 135 points !{' '}
          <Text style={styles.link}>Découvrir mes avantages</Text>
        </Text>
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
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 22,
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
});
