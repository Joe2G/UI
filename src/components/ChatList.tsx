import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, IconButton, Menu } from 'react-native-paper';
import axios from 'axios';
import useAppStore from '../stores/appStore';
import { Chat } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { SERVER_URL } from '../config';
import * as Clipboard from 'expo-clipboard';
import EnterChatIdModalContent from '../modals/EnterChatIdModalContent';

const REQUIRED_VIP_PASSWORD = 'Th@I$N0tTheP@$$w0rd';

interface ChatListProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

function ChatList() {
  const { isDarkTheme, toggleTheme } = useAppStore();
  const { user, showModal, hideModal } = useAppStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // For refresh control
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  // State for the plus-menu
  const [menuVisible, setMenuVisible] = useState(false);

  // ─────────────────────────────────────────────────────────────
  //  Fetch user chats
  // ─────────────────────────────────────────────────────────────
  const fetchChats = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(`${SERVER_URL}/api/chats`, {
        params: { userId: user.id },
      });
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
      Alert.alert('Error', 'Failed to fetch chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user?.id]);

  // ─────────────────────────────────────────────────────────────
  //  Header with Toggle Theme & Plus Menu
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon={isDarkTheme ? 'weather-sunny' : 'weather-night'}
            onPress={toggleTheme}
            iconColor={colors.onSurface} // Use theme color
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="plus"
                onPress={() => setMenuVisible(true)}
                iconColor={colors.onSurface} // Use theme color
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                createRegularChat();
              }}
              title="Regular Chat"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                createVIPChat();
              }}
              title="VIP Chat"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                enterChatId();
              }}
              title="Enter Chat ID"
            />
          </Menu>
        </View>
      ),
      headerStyle: {
        backgroundColor: colors.background, // Set the header background color based on the theme
      },
      headerTintColor: colors.onSurface, // Set the header text color based on the theme
      headerTitleStyle: {
        color: colors.onSurface, // Set header title color
      },
    });
  }, [navigation, menuVisible, isDarkTheme, toggleTheme, colors]);
  // ─────────────────────────────────────────────────────────────
  //  Create a Regular Chat
  // ─────────────────────────────────────────────────────────────
  const createRegularChat = async () => {
    if (!user?.id) return;
    try {
      const response = await axios.post(`${SERVER_URL}/api/chats`, {
        ownerId: user.id,
        isVIP: false,
      });
      Alert.alert('Chat Created', 'Regular chat created successfully.');
      navigation.navigate('Chat', { chatId: response.data.chatId });
      fetchChats();
    } catch (error) {
      console.error('Error creating regular chat:', error);
      Alert.alert('Error', 'Could not create regular chat.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  VIP Chat Modal Content (with VIP password)
  // ─────────────────────────────────────────────────────────────
  const VIPChatModalContent = () => {
    const [input, setInput] = useState('');
    const [password, setPassword] = useState('');
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ marginBottom: 8, color: colors.onSurface }}>
          Enter custom Chat ID for VIP Chat:
        </Text>
        <TextInput
          placeholder="Custom Chat ID"
          value={input}
          onChangeText={setInput}
          style={[styles.input, { borderColor: colors.onSurfaceVariant, color: colors.onSurface }]}
          placeholderTextColor={colors.onSurfaceVariant}
        />
        <Text style={{ marginBottom: 8, color: colors.onSurface }}>
          Enter VIP Password:
        </Text>
        <TextInput
          placeholder="VIP Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { borderColor: colors.onSurfaceVariant, color: colors.onSurface }]}
          placeholderTextColor={colors.onSurfaceVariant}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
          <Button
            title="Cancel"
            onPress={() => {
              hideModal();
            }}
          />
          <Button
            title="Create VIP Chat"
            onPress={async () => {
              if (input.trim() && password.trim() === REQUIRED_VIP_PASSWORD) {
                try {
                  const response = await axios.post(`${SERVER_URL}/api/chats`, {
                    ownerId: user.id,
                    isVIP: true,
                    customChatId: input.trim(),
                  });
                  hideModal();
                  Alert.alert('VIP Chat Created', 'Your VIP chat was created successfully.');
                  navigation.navigate('Chat', { chatId: response.data.chatId });
                  fetchChats();
                } catch (error) {
                  console.error('Error creating VIP chat:', error);
                  Alert.alert('Error', 'Could not create VIP chat.');
                }
              } else {
                Alert.alert('Input Error', 'Please enter a valid Chat ID and correct VIP Password.');
              }
            }}
          />
        </View>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────
  //  Create a VIP Chat (trigger modal)
  // ─────────────────────────────────────────────────────────────
  const createVIPChat = () => {
    showModal(<VIPChatModalContent />);
  };

  // ─────────────────────────────────────────────────────────────
  //  Enter Chat ID (using a custom modal for Android)
  // ─────────────────────────────────────────────────────────────
  const enterChatId = () => {
    showModal(
      <EnterChatIdModalContent
        onSubmit={(id) => {
          hideModal();
          if (id) {
            navigation.navigate('Chat', { chatId: id });
          }
        }}
        hideModal={hideModal} // Pass the actual hideModal function
      />
    );
  };

  // ─────────────────────────────────────────────────────────────
  //  Delete a chat
  // ─────────────────────────────────────────────────────────────
  const deleteChat = (chatId: string) => {
    Alert.alert('Delete Chat', 'Are you sure you want to delete this chat?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${SERVER_URL}/api/chats/${chatId}`);
            Alert.alert('Chat Deleted', 'Chat was deleted successfully.');
            fetchChats();
          } catch (error) {
            console.error('Error deleting chat:', error);
            Alert.alert('Error', 'Could not delete chat.');
          }
        },
      },
    ]);
  };

  // ─────────────────────────────────────────────────────────────
  //  Share a chat (copy link to clipboard)
  // ─────────────────────────────────────────────────────────────
  const shareChat = async (chatId: string) => {
    // Create a deep link using your custom scheme "j2chat"
    const link = chatId;
    try {
      await Clipboard.setStringAsync(link);
      Alert.alert('Copied', 'Chat link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing chat:', error);
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  Header with Toggle Theme & Plus Menu
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon={isDarkTheme ? 'weather-sunny' : 'weather-night'}
            onPress={toggleTheme}
            iconColor={isDarkTheme ? '#ffffff' : '#000000'}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="plus"
                onPress={() => setMenuVisible(true)}
                iconColor={isDarkTheme ? '#ffffff' : '#000000'}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                createRegularChat();
              }}
              title="Regular Chat"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                createVIPChat();
              }}
              title="VIP Chat"
            />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                enterChatId();
              }}
              title="Enter Chat ID"
            />
          </Menu>
        </View>
      ),
    });
  }, [navigation, menuVisible, isDarkTheme, toggleTheme]);

  // ─────────────────────────────────────────────────────────────
  //  Render chat list
  // ─────────────────────────────────────────────────────────────
  const renderChatItem = ({ item }: { item: Chat }) => (
    <View style={[styles.chatItem, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={styles.chatContent}
        onPress={() => navigation.navigate('Chat', { chatId: item.chatId })}
      >
        <Text style={[styles.chatName, { color: colors.onSurface }]}>
          {item.isVIP ? item.customChatId : item.chatId}
        </Text>
        <Text style={[styles.lastMessage, { color: colors.onSurfaceVariant }]}>
          {item.lastMessage || ''}
        </Text>
      </TouchableOpacity>
      {/* Content remains the same */}
      <View style={styles.buttons}>
        <IconButton
          icon="share"
          onPress={() => shareChat(item.chatId)}
          iconColor={colors.primary}
          size={20}
        />
        <IconButton
          icon="delete"
          onPress={() => deleteChat(item.chatId)}
          iconColor={colors.error}
          size={20}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chatId}
        renderItem={renderChatItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: colors.onSurface }}>
            No chats available
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  shareButton: {
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatList;
