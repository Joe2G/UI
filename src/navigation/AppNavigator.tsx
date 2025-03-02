import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import ChatList from '../components/ChatList';
import ChatScreen from '../screens/ChatScreen';

type AppNavigatorProps = {
  toggleTheme: () => void;
  isDarkTheme: boolean;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator({ toggleTheme, isDarkTheme }: AppNavigatorProps) {
  return (
    <Stack.Navigator
      id={undefined}
      screenOptions={{
        headerStyle: { backgroundColor: isDarkTheme ? '#1e1e1e' : '#f5f5f5' },
        headerTintColor: isDarkTheme ? '#ffffff' : '#000000',
      }}
    >
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{ title: 'YChat' }}
      />

      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.chatId })}
      />

    </Stack.Navigator>
  );
}
