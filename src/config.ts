export const APP_NAME = "YChat";

import Constants from 'expo-constants';
export const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL || "http://192.168.1.3:3000";
 // Replace YOUR_PC_IP with your actual  IP

export const SOCKET_URL = SERVER_URL; // If using Socket.io for real-time chat

export const API_ROUTES = {
  LOGIN: `${SERVER_URL}/api/login`,
  REGISTER: `${SERVER_URL}/api/register`,
  MESSAGES: `${SERVER_URL}/api/messages`,
  CALL: `${SERVER_URL}/api/call`,
  DELETE_CHAT: `${SERVER_URL}/api/delete-chat`,
};

export const APP_CONFIG = {
  MESSAGE_EXPIRY_HOURS: 24, // Auto-delete messages after 24 hours
};
