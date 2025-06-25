import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import dateFormat from "dateformat";
import { useRouter } from "expo-router";
import { useUsers } from "@/services/UserService";

export default function Account() {
  const { data, isLoading, error } = useUsers();
  const user = data?.data;
  console.log("user", user);

  const router = useRouter();

  if (isLoading) return <Text>Loading...</Text>;
  //to-do return error page
  if (error)
    return <Text style={{ paddingTop: 20 }}>Error: {error.message}</Text>;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Votre profil
      </ThemedText>
      <ScrollView style={{ flex: 1, marginBottom: 80 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={{
              uri: user?.image?.link || "https://via.placeholder.com/300",
            }}
            style={styles.imagePlaceholder}
          />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.subtitleBold}>Bonjour,</Text>
            <Text style={styles.largeText}>
              {user.firstname} {user.lastname},
            </Text>
          </View>
        </View>

        <Text style={styles.largeText}>
          Vous avez cumulé {user.fidelityPoint} points !
        </Text>

        <Text style={styles.subtitle}>Vos informations personnelles :</Text>

        <View style={styles.accountRow}>
          <View>
            <Text style={styles.accountTitle}>Nom d'utilisateur</Text>
            <Text style={styles.accountSub}>{user.username}</Text>
          </View>
        </View>
        <View style={styles.accountRow}>
          <View>
            <Text style={styles.accountTitle}>Email</Text>
            <Text style={styles.accountSub}>{user.email}</Text>
          </View>
        </View>
        <View style={styles.accountRow}>
          <View>
            <Text style={styles.accountTitle}>Date de naissance</Text>
            <Text style={styles.accountSub}>
              {dateFormat(user.birthdate, "dd mmmm yyyy")}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.updateUserBtn}
          onPress={() =>
            router.navigate({
              pathname: ``,
              params: { user: JSON.stringify(user) },
            })
          }
        >
          <Text style={styles.updateUserBtnText}>
            Mettre à jour mes informations
          </Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Vos informations de connexion :</Text>
        <View style={styles.accountRow}>
          <View>
            <Text style={styles.accountTitle}>Mot de passe</Text>
            <Text style={styles.accountSub}>***********</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.updateUserBtn}
          onPress={() =>
            router.navigate({
              pathname: ``,
              params: { user: JSON.stringify(user) },
            })
          }
        >
          <Text style={styles.updateUserBtnText}>
            Modifier mon mot de passe
          </Text>
        </TouchableOpacity>
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
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  title: {
    marginBottom: 25,
    fontWeight: "bold",
    color: "#222",
  },
  imagePlaceholder: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#AEB1B7",
    borderRadius: 100,
    marginBottom: 12,
  },
  subtitleBold: {
    fontWeight: "900",
    fontSize: 18,
    marginTop: 18,
    marginBottom: 5,
    color: "#222",
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 10,
    color: "#222",
  },
  largeText: {
    fontWeight: "600",
    fontSize: 18,
    marginTop: 5,
    marginBottom: 14,
    color: "#222",
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  accountSub: {
    color: "#888",
    fontSize: 14,
  },
  updateUserBtn: {
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  updateUserBtnText: {
    color: "#fff",
    fontWeight: "bold",

    fontSize: 16,
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
    color: "#222",
  },
});
