import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';

interface ChatNameModalProps {
  initialValue: string;
  onSubmit: (newName: string) => void;
}

export default function ChatNameModal({ initialValue, onSubmit }: ChatNameModalProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(initialValue);

  return (
    <Surface style={[styles.container, { backgroundColor: colors.surface, elevation: 4 }]}>
      <Text style={[styles.label, { color: colors.onSurface }]}>Edit Chat Name</Text>
      <TextInput
        style={[styles.input, { borderColor: colors.onSurfaceVariant, color: colors.onSurface, backgroundColor: colors.background }]}
        value={name}
        onChangeText={setName}
        placeholder="Enter new chat name"
        placeholderTextColor={colors.onSurfaceVariant}
      />
      <Button
        title="Save"
        onPress={() => onSubmit(name.trim())}
        color={colors.primary}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    width: '100%',
  },
});