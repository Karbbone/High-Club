import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { api } from "@/services/api";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatbotScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Démarrer à l'étape 1
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendMessage = async () => {
    // Afficher un log pour le débogage
    console.log("handleSendMessage appelé, étape actuelle:", step);

    // Toujours effacer les erreurs précédentes au début
    setError("");

    // Si on est à l'étape 1, passer à l'étape 2
    if (step === 1) {
      console.log("Passage à l'étape 2");
      setStep(2);
      setError("");
      return;
    }

    // Si on est à l'étape 2, envoyer directement le message
    if (step === 2) {
      try {
        setIsSending(true);
        console.log("Envoi du message:", { subject, body: message, userId: 1 });
        await api.post("/messages", {
          subject,
          body: message,
          userId: 1,
        });

        // Message envoyé avec succès
        setSuccess(true);

        // Attendre 2 secondes avant de rediriger
        setTimeout(() => {
          router.replace({ pathname: "/", params: { messageSuccess: "true" } });
        }, 2000);
      } catch (err) {
        setError("Erreur: " + (err.message || "Une erreur est survenue"));
        console.error(err);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
      setError("");
    }
  };

  const getButtonText = () => {
    switch (step) {
      case 1:
        return "Suivant";
      case 2:
        return "Envoyer";
      default:
        return "Suivant";
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 80 : 0}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            Nous contacter (Étape {step})
          </ThemedText>
        </View>

        <ScrollView style={styles.chatContainer}>
          <View style={styles.messageContainer}>
            <View style={styles.botMessage}>
              <Text style={styles.botText}>
                Bonjour ! Comment puis-je vous aider aujourd&apos;hui ?
              </Text>
            </View>

            <View style={styles.botMessage}>
              <Text style={styles.botText}>
                Quel est le sujet de votre message ?
              </Text>
            </View>

            {step >= 2 && (
              <View style={styles.userMessage}>
                <Text style={styles.userText}>{subject}</Text>
              </View>
            )}

            {step >= 2 && (
              <View style={styles.botMessage}>
                <Text style={styles.botText}>
                  Veuillez détailler votre message :
                </Text>
              </View>
            )}

            {success && (
              <View style={styles.successMessage}>
                <Text style={styles.successText}>
                  Message envoyé avec succès ! Redirection...
                </Text>
              </View>
            )}

            {error ? (
              <View style={styles.errorMessage}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={
              step === 1
                ? "Saisissez le sujet..."
                : "Saisissez votre message..."
            }
            value={step === 1 ? subject : message}
            onChangeText={step === 1 ? setSubject : setMessage}
            multiline={step === 2}
          />
          <TouchableOpacity
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            onPress={() => {
              console.log("Bouton pressé");
              handleSendMessage();
            }}
            disabled={isSending}
            activeOpacity={0.7} // Feedback visuel amélioré
          >
            {isSending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>{getButtonText()}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: Platform.OS === "android" ? 40 : 20, // Plus d'espace en bas sur Android
  },
  messageContainer: {
    flex: 1,
  },
  botMessage: {
    backgroundColor: "#e1e1e1",
    padding: 12,
    borderRadius: 16,
    borderTopLeftRadius: 4,
    marginBottom: 16,
    maxWidth: "80%",
  },
  botText: {
    fontSize: 16,
    color: "#222",
  },
  userMessage: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 16,
    borderTopRightRadius: 4,
    marginBottom: 16,
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  userText: {
    fontSize: 16,
    color: "#fff",
  },
  errorMessage: {
    backgroundColor: "#ffdddd",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "#d32f2f",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: Platform.OS === "android" ? 30 : 16, // Plus d'espace en bas sur Android
    marginBottom: Platform.OS === "android" ? 10 : 0, // Marge supplémentaire sur Android
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#222",
    borderRadius: 24,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3, // Ombre sur Android
    shadowColor: "#000", // Ombre sur iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sendButtonDisabled: {
    backgroundColor: "#888",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: "#e9e9e9",
    color: "#666",
  },
  confirmMessage: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  confirmText: {
    color: "#2e7d32",
  },
  successMessage: {
    backgroundColor: "#e8f5e9",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#81c784",
  },
  successText: {
    color: "#2e7d32",
    fontWeight: "bold",
    textAlign: "center",
  },
});
