import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SERVER_URL } from '../config';

interface Props {
  onSubmit: (chatId: string) => void;
  hideModal: () => void;
}

export default function EnterChatIdModalContent({ onSubmit, hideModal }: Props) {
  const { colors } = useTheme();
  const [input, setInput] = useState('');

  const handleSubmit = async (id: string) => {
    try {
      const response = axios.get(`${SERVER_URL}/api/chats/${id}`);
      if ((await response).data) {
        hideModal();
        onSubmit(id);
      } else {
        Alert.alert('Error', 'Chat ID does not exist');
      }
    } catch (error) {
      Alert.alert('Error', 'Chat ID does not exist');
    }
  };

  return (
    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
      <Text style={[styles.label, { color: colors.onSurface }]}>Enter Chat ID:</Text>
      <TextInput
        placeholder="Chat ID"
        value={input}
        onChangeText={setInput}
        style={[styles.input, { borderColor: colors.onSurfaceVariant, color: colors.onSurface }]}
        placeholderTextColor={colors.onSurfaceVariant}
      />
      <View style={styles.buttonsRow}>
        <Button title="Cancel" onPress={() => { hideModal(); onSubmit(''); }} />
        <Button title="Join Chat" onPress={() => input.trim() && handleSubmit(input.trim())} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#888',
    paddingHorizontal: 10,
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
