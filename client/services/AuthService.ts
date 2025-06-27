import { api } from '@/services/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/IUser';

// Types pour l'authentification
interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
  birthdate: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Clés pour AsyncStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Service d'authentification
export class AuthService {
  // Stocker le token
  static async setToken(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    // Configurer le token dans les headers axios
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Récupérer le token
  static async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }

  // Supprimer le token
  static async removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
  }

  // Stocker les données utilisateur
  static async setUser(user: User) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Récupérer les données utilisateur
  static async getUser(): Promise<User | null> {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Supprimer les données utilisateur
  static async removeUser() {
    await AsyncStorage.removeItem(USER_KEY);
  }

  // Initialiser l'authentification (appelé au démarrage de l'app)
  static async initializeAuth() {
    const token = await this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Déconnexion complète
  static async logout() {
    await this.removeToken();
    await this.removeUser();
  }

  // Nettoyer complètement l'état d'authentification
  static async clearAuth() {
    await this.logout();
    // Nettoyer aussi les headers axios
    delete api.defaults.headers.common['Authorization'];
  }
}

// Hooks React Query pour l'authentification
export function useLogin() {
  return useMutation({
    mutationFn: async (loginData: LoginData) => {
      const response = await api.post<AuthResponse>('/auth/login', loginData);
      const { data } = response.data;
      
      // Stocker le token et les données utilisateur
      await AuthService.setToken(data.token);
      await AuthService.setUser(data.user);
      
      // Mettre à jour l'état global de l'utilisateur
      const { setAuthUser } = require('@/hooks/useAuth');
      setAuthUser(data.user);
      
      return response.data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const response = await api.post<AuthResponse>('/auth/register', registerData);
      return response.data;
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post('/auth/logout');
      } catch (error) {
        // Ignorer les erreurs de déconnexion côté serveur
      }
      
      // Déconnexion côté client
      await AuthService.logout();
      
      // Nettoyer l'état global de l'utilisateur
      const { setAuthUser, resetAuthState } = require('@/hooks/useAuth');
      setAuthUser(null);
      resetAuthState();
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await api.get<{ success: boolean; data: User }>('/auth/me');
        return response.data;
      } catch (error) {
        console.log('Erreur useMe:', error);
        throw error;
      }
    },
    retry: false, // Ne pas retenter en cas d'échec
  });
} 