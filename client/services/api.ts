import axios from 'axios';

const apiDomain = process.env.EXPO_PUBLIC_API_DOMAIN || 'localhost';
const apiPort = process.env.EXPO_PUBLIC_API_PORT || '3333';
const apiProtocol = process.env.EXPO_PUBLIC_API_PROTOCOL || 'http';

const API_URL = `${apiProtocol}://${apiDomain}:${apiPort}`;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});