import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'react-native-paper'; // Import useTheme
import SignInScreen from '../screens/SignInScreen';
import AppNavigator from './AppNavigator';
import useAppStore from '../stores/appStore';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme(); // Get theme colors

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false, // Hide header globally (if needed)
        // Add theme-aware header styles if you decide to show headers
        headerStyle: {
          backgroundColor: colors.surface, // Use theme-based header background
        },
        headerTintColor: colors.onSurface, // Use theme-based header text color
      }}
    >
      {!user.id ? (
        <Stack.Screen name="SignIn" component={SignInScreen} />
      ) : (
        <Stack.Screen name="ChatList" component={AppNavigator} />
      )}
    </Stack.Navigator>
  );
}