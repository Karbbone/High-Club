import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstname: '',
    lastname: '',
    birthdate: new Date('1990-01-01'),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date('1990-01-01'));
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    const { email, password, confirmPassword, username, firstname, lastname, birthdate } = formData;
    
    if (!email || !password || !confirmPassword || !username || !firstname || !lastname) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      await register({ 
        email, 
        password, 
        username, 
        firstname, 
        lastname,
        birthdate: birthdate.toISOString().split('T')[0] // Format YYYY-MM-DD
      });
      Alert.alert('Succès', 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.', [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const confirmDate = () => {
    updateFormData('birthdate', tempDate);
    setShowDatePicker(false);
  };

  const cancelDate = () => {
    setTempDate(formData.birthdate);
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    setTempDate(formData.birthdate);
    setShowDatePicker(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>Inscription</ThemedText>
            
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              placeholderTextColor="#666"
              value={formData.firstname}
              onChangeText={(value) => updateFormData('firstname', value)}
              autoComplete="given-name"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Nom"
              placeholderTextColor="#666"
              value={formData.lastname}
              onChangeText={(value) => updateFormData('lastname', value)}
              autoComplete="family-name"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor="#666"
              value={formData.username}
              onChangeText={(value) => updateFormData('username', value)}
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            
            <TouchableOpacity
              style={styles.dateInput}
              onPress={openDatePicker}
            >
              <ThemedText style={styles.dateInputText}>
                {formatDate(formData.birthdate)}
              </ThemedText>
              <ThemedText style={styles.dateInputLabel}>Date de naissance</ThemedText>
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry
              autoComplete="new-password"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor="#666"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry
              autoComplete="new-password"
            />
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <ThemedText style={styles.buttonText}>
                {isLoading ? 'Inscription...' : "S'inscrire"}
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.push('/login')}
            >
              <ThemedText style={styles.linkText}>
                Déjà un compte ? Se connecter
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {showDatePicker && (
        <>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
            minimumDate={new Date('1900-01-01')}
          />
          {Platform.OS === 'ios' && (
            <View style={styles.datePickerButtons}>
              <TouchableOpacity style={styles.datePickerButton} onPress={cancelDate}>
                <ThemedText style={styles.datePickerButtonText}>Annuler</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.datePickerButton, styles.datePickerButtonConfirm]} onPress={confirmDate}>
                <ThemedText style={styles.datePickerButtonTextConfirm}>Confirmer</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192734',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#192734',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#192734',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateInputText: {
    color: '#192734',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateInputLabel: {
    color: '#192734',
    fontSize: 14,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  datePickerButtonConfirm: {
    backgroundColor: '#fff',
  },
  datePickerButtonTextConfirm: {
    color: '#192734',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 