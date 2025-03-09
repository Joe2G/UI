import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppStore from '../stores/appStore';
import useUsername from '../hooks/useUsername';
import axios from 'axios';
import { SERVER_URL } from '../config';
import { useTheme } from 'react-native-paper';

export default function SignInScreen({ navigation }) {
  useUsername();
  const { setUser } = useAppStore();
  const { colors } = useTheme();
  const [username, setUsername] = useState('');

  const handleSubmit = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      Alert.alert('Input Error', 'Please enter a username');
      return;
    }

    console.log('[FRONTEND] Attempting registration with:', { username: trimmedUsername });

    try {
      const response = await axios.post(`${SERVER_URL}/api/register`, { username: trimmedUsername }, { timeout: 10000 });
      console.log('[FRONTEND] Server response:', response.data);

      if (!response.data?.password || !response.data?.username) {
        throw new Error('Invalid server response structure');
      }

      const userData = {
        id: response.data.password,
        username: response.data.username,
      };

      console.log('[FRONTEND] Storing user data:', userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      console.log('[FRONTEND] Navigating to ChatList');
      navigation.replace('ChatList');
    } catch (error) {
      console.error('[FRONTEND] Registration error:', error.response?.data || error.message);
      let errorMessage = error.response?.data?.error || 'Failed to create account';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.onSurface }]}>Welcome To YChat</Text>
      <Text style={[styles.subtitle, { color: colors.onSurface }]}>Get Started</Text>
      <Text style={[styles.label, { color: colors.onSurface }]}>Enter your username</Text>
      <TextInput
        placeholder="Username"
        style={[styles.input, { borderColor: colors.onSurfaceVariant, color: colors.onSurface, backgroundColor: colors.surface }]}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        testID="usernameInput"
        placeholderTextColor={colors.onSurfaceVariant}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#007AFF' }]} // Changed from colors.primary
        onPress={handleSubmit}
        testID="submitButton"
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
      <Text style={[styles.footer, { color: colors.onSurfaceVariant }]}>This App is made By Joe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 45,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderRadius: 8,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 12,
  },
});