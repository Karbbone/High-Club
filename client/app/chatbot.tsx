import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatbotScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Utiliser useCallback pour éviter des rendus inutiles
  const handleSendMessage = useCallback(async () => {
    setError("");

    if (step === 1) {
      setStep(2);
      return;
    }

    // Si on est à l'étape 2, envoyer directement le message
    if (step === 2) {
      try {
        setIsSending(true);
        console.log("Données à envoyer:", {
          subject,
          body: message,
          userId: user?.id,
        });
        await api.post("/messages", {
          subject,
          body: message,
          userId: user?.id,
        });
        setSuccess(true);

        setTimeout(() => {
          router.replace({ pathname: "/", params: { messageSuccess: "true" } });
        }, 2000);
      } catch (err) {
        setError("Erreur: " + (err.message ?? "Une erreur est survenue"));
      } finally {
        setIsSending(false);
      }
    }
  }, [step, subject, message, router, user?.id]);

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
      keyboardVerticalOffset={90}
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
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              isSending && styles.sendButtonDisabled,
              pressed && styles.sendButtonPressed,
            ]}
            onPressIn={() => handleSendMessage()}
            onPress={handleSendMessage}
            disabled={isSending}
            android_ripple={{ color: "#fff", borderless: false }}
          >
            {isSending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>{getButtonText()}</Text>
            )}
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#192734",
    paddingTop: Platform.OS === "ios" ? 20 : 40,
  },
  buttonContainer: {
    overflow: "hidden",
    borderRadius: 24,
    marginLeft: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a3947",
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
    color: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
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
    backgroundColor: "#192734",
    borderTopWidth: 1,
    borderTopColor: "#2a3947",
    paddingBottom: Platform.OS === "android" ? 30 : 16, // Plus d'espace en bas sur Android
    marginBottom: Platform.OS === "android" ? 10 : 0, // Marge supplémentaire sur Android
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
    maxHeight: 100,
    color: "#192734",
  },
  sendButton: {
    backgroundColor: "#fff",
    borderRadius: 24,
    minWidth: 100,
    height: 50, // Hauteur fixe pour assurer une zone tactile suffisante
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
    paddingHorizontal: 10, // Assure une zone de toucher minimale
    marginLeft: 8,
    // Assurer que le bouton est clickable
    zIndex: 1000,
    position: "relative",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonPressed: {
    backgroundColor: "#f0f0f0",
    transform: [{ scale: 0.95 }],
  },
  sendButtonText: {
    color: "#192734",
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
