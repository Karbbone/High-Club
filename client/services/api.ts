import axios from 'axios';
import Constants from 'expo-constants';

const config = Constants.expoConfig?.extra || {};
const apiDomain = config.apiDomain || 'localhost';
const apiPort = config.apiPort || '3333';
const apiProtocol = config.apiProtocol || 'http';

const API_URL = `${apiProtocol}://${apiDomain}:${apiPort}`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les tokens d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou AsyncStorage pour mobile
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 