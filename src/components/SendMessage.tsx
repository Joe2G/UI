import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import useSocket from '../hooks/useSocket';
import useAppStore from '../stores/appStore';

interface SendMessageProps {
  chatId: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const socket = useSocket();
  const { user } = useAppStore();
  const { colors, dark } = useTheme(); // Get dark mode status
  const styles = useStyles(colors);

  const handleSend = () => {
    if (message.trim() && user.id) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: user.id,
        chatId,
        timestamp: Date.now(),
      };

      socket?.emit('message', newMessage);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: dark ? colors.onSurface : colors.onSurface, // Use onSurface for border
            color: colors.onSurface,
            backgroundColor: colors.surface,
          },
        ]}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        placeholderTextColor={colors.onSurfaceVariant}
        onSubmitEditing={handleSend}
      />
      <IconButton
        icon="send"
        onPress={handleSend}
        iconColor={dark ? colors.onSurface : colors.onSurface} // Use onSurface for icon
        size={24}
        style={styles.iconButton}
      />
    </View>
  );
};

const useStyles = (colors: any) => 
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: 16,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.outline,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 25,
      paddingHorizontal: 16,
      marginRight: 8,
      fontSize: 16,
    },
    iconButton: {
      margin: 0,
    },
  });

export default SendMessage;