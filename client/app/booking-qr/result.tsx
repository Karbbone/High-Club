import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function BookingResultScreen() {
  const { booking } = useLocalSearchParams();
  let parsedBooking = null;
  if (booking) {
    parsedBooking = JSON.parse(Array.isArray(booking) ? booking[0] : booking);
  }

  if (!parsedBooking) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Erreur: Impossible de charger les données de réservation
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Récapitulatif de la commande</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.eventName}>
          {parsedBooking.event?.name ?? "Événement"}
        </ThemedText>

        <ThemedText style={styles.eventDetails}>
          Commande #{parsedBooking.id}
        </ThemedText>

        <View style={styles.bookingInfo}>
          <ThemedText style={styles.infoLabel}>Événement :</ThemedText>
          <ThemedText style={styles.infoValue}>
            {parsedBooking.event?.name ?? "N/A"}
          </ThemedText>

          <ThemedText style={styles.infoLabel}>Date :</ThemedText>
          <ThemedText style={styles.infoValue}>
            {parsedBooking.event?.startDatetime
              ? new Date(parsedBooking.event.startDatetime).toLocaleDateString(
                  "fr-FR",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "N/A"}
          </ThemedText>

          <ThemedText style={styles.infoLabel}>Statut :</ThemedText>
          <ThemedText style={[styles.infoValue, styles.statusActive]}>
            Actif
          </ThemedText>

          {/* Affichage des utilisateurs et précommandes */}
          {parsedBooking.users && Array.isArray(parsedBooking.users) && (
            <>
              <ThemedText style={[styles.infoLabel, { marginTop: 18 }]}>
                Utilisateurs & Précommandes :
              </ThemedText>
              {parsedBooking.users.map((user, idx) => (
                <View key={idx} style={styles.userCard}>
                  <ThemedText style={styles.userTitle}>
                    Place {idx + 1}
                  </ThemedText>
                  <ThemedText style={styles.userEmail}>
                    {user.email}
                  </ThemedText>
                  <ThemedText style={styles.userDrinks}>
                    Boissons alcoolisées : {user.alcohols ?? 0}
                  </ThemedText>
                  <ThemedText style={styles.userDrinks}>
                    Boissons softs : {user.softs ?? 0}
                  </ThemedText>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#192734",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.select({
      ios: 60,
      android: 60,
      default: 20,
    }),
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: "center",
    paddingBottom: 40,
  },
  eventName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 40,
  },
  bookingInfo: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
    marginTop: 12,
  },
  infoValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  statusActive: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  userCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    marginBottom: 4,
  },
  userTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  userEmail: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 2,
  },
  userDrinks: {
    color: "#fff",
    fontSize: 13,
  },
});