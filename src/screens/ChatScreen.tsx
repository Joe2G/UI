import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, KeyboardAvoidingView, Platform, View, ActivityIndicator, RefreshControl, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useTheme, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useSocket from '../hooks/useSocket';
import useAppStore from '../stores/appStore';
import MessageBubble from '../components/MessageBubble';
import SendMessage from '../components/SendMessage';
import ChatNameModal from '../modals/ChatNameModal';
import useNewMessageNotification from '../hooks/useNewMessageNotification';
import { SERVER_URL } from '../config';

import { RootStackParamList } from '../types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  sender: string;
  userId: string;
  timestamp: number;
}

type ChatScreenNavProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
  const { user, showModal, hideModal } = useAppStore();

  // Get route params
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavProp>();
  const { chatId, title } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);

  const { colors } = useTheme();
  const socket = useSocket();
  const [customName, setCustomName] = useState<string>(title ?? chatId);

  // Ref for FlatList to handle scrolling
  const flatListRef = useRef<FlatList>(null);

  // Load custom name from AsyncStorage
  useEffect(() => {
    const loadChatName = async () => {
      const storedName = await AsyncStorage.getItem(`chatName_${chatId}`);
      if (storedName) {
        setCustomName(storedName);
      } else {
        setCustomName(title ?? chatId);
      }
    };
    loadChatName();
  }, [chatId, title]);

  // ──────────────────────────────────────────────────────────
  // 1) Show the pen icon in the header
  // ──────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    navigation.setOptions({
      title: customName,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="phone"
            onPress={startCall}
            iconColor={colors.onSurface}
          />
          <IconButton
            icon="pencil"
            onPress={handleEditChatName}
            iconColor={colors.onSurface}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: colors.surface, // Use theme color for header background
      },
      headerTintColor: colors.onSurface, // Use theme color for header text
    });
  }, [navigation, customName, colors]);

  const startCall = () => {
    console.log('Starting call...');
    // Add your call logic here
  };

  const handleEditChatName = async () => {
    // Show a custom modal with <ChatNameModal />
    showModal(
      <ChatNameModal
        initialValue={customName}
        onSubmit={async (newName) => {
          hideModal();
          if (newName) {
            setCustomName(newName);
            await AsyncStorage.setItem(`chatName_${chatId}`, newName);
          }
        }}
      />
    );
  };

  // Load custom chat name from AsyncStorage
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
    return () => keyboardDidShowListener.remove();
  }, []);

  // ──────────────────────────────────────────────────────────
  // 2) Load & Refresh Messages
  // ──────────────────────────────────────────────────────────
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${SERVER_URL}/api/messages`, { params: { chatId } });
      setMessages(response.data);
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
    setRefreshing(false);
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }

    socket.emit('joinChat', { chatId, userId: user.id });
    socket.emit('getMessages', { chatId });

    socket.on('getMessages', (msgs: Message[]) => {
      setMessages(msgs);
      setLoading(false);
    });

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      // Save the new message so that our hook can trigger a notification.
      setLatestMessage(msg);
    });

    // Fallback: Fetch messages if no socket response
    const timeout = setTimeout(async () => {
      if (messages.length === 0) {
        try {
          const response = await axios.get(`${SERVER_URL}/api/messages`, { params: { chatId } });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    }, 3000);

    return () => {
      socket.off('getMessages');
      socket.off('message');
      clearTimeout(timeout);
    };
  }, [socket, chatId, messages]);

  // Call the notification hook with the latest message
  useNewMessageNotification(latestMessage);

  if (loading) {
    return (
      <View style={styles(colors).loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ──────────────────────────────────────────────────────────
  // 3) Render the screen
  // ──────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id || item.timestamp.toString()}
        renderItem={({ item }) => (
          <MessageBubble message={item} isCurrentUser={item.userId === user.id} />
        )}
        contentContainerStyle={styles(colors).contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <SendMessage chatId={chatId} />
    </KeyboardAvoidingView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  contentContainer: {
    paddingVertical: 16, // Increased from 10 for more vertical spacing
    paddingHorizontal: 12, // Slightly increased from 10 for better margins
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, // Match theme background
  },
});