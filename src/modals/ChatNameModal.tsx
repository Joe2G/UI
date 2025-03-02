import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface ChatNameModalProps {
  initialValue: string;
  onSubmit: (newName: string) => void;
}

export default function ChatNameModal({ initialValue, onSubmit }: ChatNameModalProps) {
  const [name, setName] = useState(initialValue);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Chat Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter new chat name"
      />
      <Button
        title="Save"
        onPress={() => onSubmit(name.trim())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
});
