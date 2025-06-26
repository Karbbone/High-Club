import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useBookingTickets } from "@/services/UserService";
import { getStatusTranslation, getStatusColor } from "@/types/enums";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import dateFormat from "dateformat";

const { width } = Dimensions.get("window");

export default function BookingTicketsScreen() {
  const { booking, userId } = useLocalSearchParams();
  const router = useRouter();

  let parsedBooking = null;
  if (booking) {
    const bookingString = Array.isArray(booking) ? booking[0] : booking;
    parsedBooking = JSON.parse(bookingString);
  }

  const { data: ticketsData, isLoading, error } = useBookingTickets(
    Number(userId),
    parsedBooking?.id
  );

  if (!parsedBooking) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Erreur: Impossible de charger les données de réservation
        </ThemedText>
      </ThemedView>
    );
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Chargement des billets...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Erreur: {error.message}
        </ThemedText>
      </ThemedView>
    );
  }

  const { data } = ticketsData || {};
  const { tickets, isBookingOwner, booking: bookingInfo } = data || {};

  return (
    <ThemedView style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>
          {isBookingOwner ? "Mes Billets" : "Mon Billet"}
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {/* Contenu principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.eventName}>
          {bookingInfo?.event?.name ?? parsedBooking.event?.name ?? "Événement"}
        </ThemedText>

        <ThemedText style={styles.eventDetails}>
          Réservation #{parsedBooking.id}
          {isBookingOwner && tickets && tickets.length > 1 && (
            <Text style={styles.ticketCount}>
              {" "}
              - {tickets.length} billet{tickets.length > 1 ? "s" : ""}
            </Text>
          )}
        </ThemedText>

        {tickets && tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <View key={ticket.id} style={styles.ticketContainer}>
              {isBookingOwner && tickets.length > 1 && (
                <Text style={styles.ticketLabel}>
                  Billet {index + 1} - {ticket.user?.firstname} {ticket.user?.lastname}
                </Text>
              )}

              {/* QR Code */}
              <View style={styles.qrContainer}>
                <QRCode
                  value={JSON.stringify(ticket)}
                  size={width * 0.6}
                  color="#192734"
                  backgroundColor="#ffffff"
                />
              </View>

              <ThemedText style={styles.instructions}>
                Présentez ce QR code à l&apos;entrée de l&apos;événement
              </ThemedText>

              <View style={styles.ticketInfo}>
                <ThemedText style={styles.infoLabel}>Événement:</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {bookingInfo?.event?.name ?? parsedBooking.event?.name ?? "N/A"}
                </ThemedText>

                <ThemedText style={styles.infoLabel}>Date:</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {bookingInfo?.event?.startDatetime
                    ? dateFormat(
                        new Date(bookingInfo.event.startDatetime),
                        "dd mmmm yyyy, hh:mm"
                      )
                    : dateFormat(
                        new Date(parsedBooking.event?.startDatetime),
                        "dd mmmm yyyy, hh:mm"
                      ) ?? "N/A"}
                </ThemedText>

                <ThemedText style={styles.infoLabel}>Statut:</ThemedText>
                <ThemedText 
                  style={[
                    styles.infoValue, 
                    { color: getStatusColor(ticket.status?.name ?? "Waiting") }
                  ]}
                >
                  {getStatusTranslation(ticket.status?.name ?? "Waiting")}
                </ThemedText>

                {ticket.purchases && ticket.purchases.length > 0 && (
                  <>
                    <ThemedText style={styles.infoLabel}>Achats:</ThemedText>
                    {ticket.purchases.map((purchase, idx) => (
                      <ThemedText key={idx} style={styles.purchaseInfo}>
                        • {purchase.product?.name} (x{purchase.quantity})
                      </ThemedText>
                    ))}
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noTickets}>
            Aucun billet trouvé pour cette réservation
          </ThemedText>
        )}
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
  backButtonText: {
    fontSize: 24,
    color: "#fff",
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
  ticketCount: {
    color: "#fff",
    fontWeight: "bold",
  },
  ticketContainer: {
    width: "100%",
    marginBottom: 40,
  },
  ticketLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 8,
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
  ticketInfo: {
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
  purchaseInfo: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 10,
    marginBottom: 2,
  },
  noTickets: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginTop: 40,
  },
}); 