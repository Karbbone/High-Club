import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEvents } from "@/services/EventService";
import { useProducts } from "@/services/ProductService";
import { useCreateBooking } from "@/services/BookingService";
import { useAuth } from "@/hooks/useAuth";
import { Event } from "@/types/IEvent";
import { useNavigation } from "@react-navigation/native";
import dateFormat from "dateformat";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function BookingScreen() {
  const { event } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();

  const { data: products, isLoading: productsLoading } = useProducts();
  const createBookingMutation = useCreateBooking();

  const [users, setUsers] = useState([{ email: "", purchases: {} }]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!products) return;
    
    let totalAmount = 0;
    const ticketPrice = 15;
    
    users.forEach(user => {
      Object.entries(user.purchases).forEach(([productId, quantity]) => {
        const product = products.find(p => p.id === Number(productId));
        if (product) {
          totalAmount += Number(product.price) * (quantity as number);
        }
      });
    });
    
    totalAmount += users.length * ticketPrice;
    
    setTotal(totalAmount);
  }, [users, products]);

  const addUser = () => {
    setUsers([...users, { email: "", purchases: {} }]);
  };

  const updateUser = (idx, field, value) => {
    const updated = [...users];
    if (field === "email") {
      updated[idx][field] = value;
    } else {
      const productId = field;
      updated[idx].purchases = {
        ...updated[idx].purchases,
        [productId]: Math.max(0, (updated[idx].purchases[productId] || 0) + value)
      };
    }
    setUsers(updated);
  };

  // Fonction pour supprimer une place
  const removeUser = (idx) => {
    setUsers(users.filter((_, i) => i !== idx));
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Réservation" });
  }, [navigation]);

  const { data: events, isLoading, error } = useEvents();

  let parsedEvent: Event | null = null;
  if (event) {
    const eventString = Array.isArray(event) ? event[0] : event;
    parsedEvent = JSON.parse(eventString);
  }

  if (isLoading || productsLoading)
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
      <ThemedText style={styles.title}>Réserver vos places</ThemedText>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Image
          source={{
            uri:
              parsedEvent.images[0].link || "https://via.placeholder.com/300",
          }}
          style={styles.imagePlaceholder}
        />
        <Text style={styles.sectionTitle}>{parsedEvent.name}</Text>
        <Text style={styles.subTitle}>{parsedEvent.artist}</Text>
        <Text style={styles.sectionProps}>{parsedEvent.description}</Text>

        <View style={styles.dateRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.dateIcon}>🗓️</Text>
            <View>
              <Text style={styles.dateText}>
                {dateFormat(parsedEvent.startDatetime, "ddd dd mmm, hh:MM")}
              </Text>
              <Text style={styles.dateText}>
                {dateFormat(parsedEvent.endDatetime, "ddd dd mmm, hh:MM")}
              </Text>
            </View>
          </View>
        </View>

        <ThemedView style={{ backgroundColor: "fff" }}>
          <ThemedText type="title" style={styles.title}>
            Précommande billets & boissons
          </ThemedText>
          <ScrollView style={{ flex: 1, marginBottom: 80 }}>
            {users.map((user, idx) => (
              <View
                key={`user-${idx}-${user.email || Math.random()}`}
                style={styles.card}
              >
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
                  onChangeText={(text) => updateUser(idx, "email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={styles.sectionProps}>Précommande boissons :</Text>
                
                {products && products.map((product) => (
                  <View key={product.id} style={styles.drinkRow}>
                    <View style={styles.drinkInfo}>
                      <Text style={styles.drinkTitle}>{product.name}</Text>
                      <Text style={styles.drinkPrice}>{product.price} €</Text>
                    </View>
                    <View style={styles.counter}>
                      <TouchableOpacity
                        onPress={() =>
                          updateUser(idx, product.id, -1)
                        }
                        style={styles.counterBtn}
                      >
                        <Text style={styles.counterBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.counterValue}>
                        {user.purchases[product.id] || 0}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateUser(idx, product.id, 1)
                        }
                        style={styles.counterBtn}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={addUser}>
              <Text style={styles.addBtnText}>Ajouter une place</Text>
            </TouchableOpacity>
          </ScrollView>
        </ThemedView>
      </ScrollView>
      <Text style={styles.total}>Total de votre réservation : {total} €</Text>

      <TouchableOpacity
        style={styles.reserveBtn}
        onPress={() => {
          // Vérifier que l'événement existe et a un ID
          if (!parsedEvent || !parsedEvent.id) {
            console.error('❌ Erreur: parsedEvent ou parsedEvent.id est undefined');
            Toast.show({
              type: "error",
              text1: "Erreur",
              text2: "Impossible de récupérer les informations de l'événement.",
            });
            return;
          }
          
          // Préparer les données de réservation au format backend
          const bookingData = {
            datetime: new Date().toISOString(),
            user_id: user.id,
            event_id: parsedEvent.id,
            purchases: Object.entries(users[0].purchases || {}).map(([productId, quantity]) => ({
              product_id: Number(productId),
              quantity: quantity as number
            })).filter(purchase => purchase.quantity > 0),
            guests: users.slice(1).map(user => ({
              email: user.email,
              purchases: Object.entries(user.purchases || {}).map(([productId, quantity]) => ({
                product_id: Number(productId),
                quantity: quantity as number
              })).filter(purchase => purchase.quantity > 0)
            }))
          };
          
          // Envoyer la réservation
          createBookingMutation.mutate(bookingData, {
            onSuccess: () => {
              Toast.show({
                type: "success",
                text1: "Réservation réussie",
                text2: "Votre réservation a bien été prise en compte.",
              });
              router.navigate("/commandes");
            },
            onError: (error) => {
              console.error('❌ Erreur lors de la réservation:', error);
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Une erreur est survenue lors de la réservation.",
              });
            }
          });
        }}
      >
        <Text style={styles.reserveBtnText}>
          {createBookingMutation.isPending ? "Réservation..." : "Réserver"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.pointsText}>
        Grâce à cette réservation vous obtiendrez 135 points !{" "}
        <Text style={styles.link}>Découvrir mes avantages</Text>
      </Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#192734",
    paddingTop: 20,
  },
  title: {
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1.8,
    backgroundColor: "#AEB1B7",
    borderRadius: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 2,
    color: "#fff",
  },
  sectionProps: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    color: "#fff",
  },
  changeText: {
    color: "#ccc",
    fontWeight: "500",
    fontSize: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  pricePer: {
    fontSize: 17,
    fontWeight: "500",
    color: "#fff",
  },
  priceTotal: {
    color: "#ccc",
    fontSize: 14,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  counterBtnText: {
    color: "#192734",
    fontSize: 20,
    fontWeight: "bold",
  },
  counterValue: {
    fontSize: 18,
    fontWeight: "500",
    minWidth: 20,
    textAlign: "center",
    color: "#fff",
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 10,
    color: "#fff",
  },
  drinkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  drinkTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  drinkSub: {
    color: "#ccc",
    fontSize: 14,
  },
  total: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 18,
    marginBottom: 14,
    color: "#fff",
  },
  reserveBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  reserveBtnText: {
    color: "#192734",
    fontWeight: "bold",
    fontSize: 18,
  },
  pointsText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: "#192734",
  },
  card: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#2a3947",
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#192734",
  },
  addBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  addBtnText: {
    color: "#192734",
    fontWeight: "bold",
    fontSize: 18,
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "#555",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  removeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 22,
  },
  drinkInfo: {
    flex: 1,
  },
  drinkPrice: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 2,
  },
});
