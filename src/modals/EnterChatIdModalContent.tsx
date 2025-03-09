import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { SERVER_URL } from '../config';
import useAppStore from '../stores/appStore';

interface Props {
  onSubmit: (chatId: string) => void;
  hideModal: () => void;
}

export default function EnterChatIdModalContent({ onSubmit, hideModal }: Props) {
  const { colors } = useTheme();
  const { user } = useAppStore();
  const [input, setInput] = useState('');

  const handleSubmit = async (id: string) => {
    if (!user?.id) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    try {
      const response = await axios.post(`${SERVER_URL}/api/chats/join`, { chatId: id, userId: user.id });
      if (response.data) {
        hideModal();
        onSubmit(id);
      } else {
        Alert.alert('Error', 'Chat ID does not exist');
      }
    } catch (error) {
      console.error('Error joining chat:', error);
      Alert.alert('Error', 'Chat ID does not exist or you are not authorized to join it.');
    }
  };

  return (
    <Surface style={[styles.modalContent, { backgroundColor: colors.surface, elevation: 4 }]}>
      <Text style={[styles.label, { color: colors.onSurface }]}>Enter Chat ID:</Text>
      <TextInput
        placeholder="Chat ID"
        value={input}
        onChangeText={setInput}
        style={[styles.input, { borderColor: colors.onSurfaceVariant, color: colors.onSurface, backgroundColor: colors.background }]}
        placeholderTextColor={colors.onSurfaceVariant}
      />
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={{ backgroundColor: '#6c757d', padding: 10, borderRadius: 5 }}
          onPress={() => { hideModal(); onSubmit(''); }}
        >
          <Text style={{ color: '#fff' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }}
          onPress={() => input.trim() && handleSubmit(input.trim())}
        >
          <Text style={{ color: '#fff' }}>Join Chat</Text>
        </TouchableOpacity>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
  },
  label: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '500',
  },
  input: {
    height: 45,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderRadius: 8,
    width: '100%',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});