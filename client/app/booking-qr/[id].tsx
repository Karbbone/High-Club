import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const { width } = Dimensions.get("window");

export default function BookingQRScreen() {
  const { booking } = useLocalSearchParams();
  const router = useRouter();

  let parsedBooking = null;
  if (booking) {
    const bookingString = Array.isArray(booking) ? booking[0] : booking;
    parsedBooking = JSON.parse(bookingString);
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
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Mon Billet</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {/* Contenu principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.eventName}>
          {parsedBooking.event?.name ?? "Événement"}
        </ThemedText>

        <ThemedText style={styles.eventDetails}>
          Réservation #{parsedBooking.id}
        </ThemedText>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={JSON.stringify(parsedBooking)}
            size={width * 0.6}
            color="#192734"
            backgroundColor="#ffffff"
          />
        </View>

        <ThemedText style={styles.instructions}>
          Présentez ce QR code à l&apos;entrée de l&apos;événement
        </ThemedText>

        <View style={styles.bookingInfo}>
          <ThemedText style={styles.infoLabel}>Événement:</ThemedText>
          <ThemedText style={styles.infoValue}>
            {parsedBooking.event?.name ?? "N/A"}
          </ThemedText>

          <ThemedText style={styles.infoLabel}>Date:</ThemedText>
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

          <ThemedText style={styles.infoLabel}>Statut:</ThemedText>
          <ThemedText style={[styles.infoValue, styles.statusActive]}>
            Actif
          </ThemedText>
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
  backButton: {
    padding: 8,
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
  qrContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  instructions: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
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
});
