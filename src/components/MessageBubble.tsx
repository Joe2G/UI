import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface MessageBubbleProps {
  message: {
    text: string;
    timestamp: number;
    sender: string;
  };
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const theme = useTheme();
  const isDarkMode = theme.dark;

  // Check if this is a system message
  if (message.sender === 'system') {
    return (
      <View style={styles.systemContainer}>
        <Text style={styles.systemText}>{message.text}</Text>
      </View>
    );
  }

  // Determine bubble colors based on sender and dark mode
  let bubbleBackground: string;
  let textColor: string = '#F8F8F8'; // default for light mode
  if (isCurrentUser) {
    // Current user bubble (right side)
    bubbleBackground = isDarkMode ? 'rgba(89,112,129,0.5)' : '#27474E';
  } else {
    // Other user's bubble (left side)
    bubbleBackground = isDarkMode ? '#255957' : '#009E8C';
  }

  if (isDarkMode) {
    textColor = '#FFFFFF';
  }

  // Format timestamp as HH:MM
  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.container,
        { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      {/* Only show the sender's name if it's NOT the current user */}
      {!isCurrentUser && (
        <Text style={[styles.senderName, { color: '#333' }]}>
          {message.sender}
        </Text>
      )}

      <View style={[styles.bubble, { backgroundColor: bubbleBackground }]}>
        <Text style={[styles.text, { color: textColor }]}>{message.text}</Text>
        <Text style={[styles.timestamp, { color: textColor, opacity: 0.8 }]}>
          {timeString}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6, // spacing between messages
    maxWidth: '80%',
  },
  senderName: {
    fontSize: 12,
    marginBottom: 4,
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  text: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  systemContainer: {
    alignSelf: 'center',
    marginVertical: 8,
  },
  systemText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});

export default MessageBubble;
