import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import useAppStore from '../stores/appStore';

// Configure notification handling (optional)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// This hook triggers a local notification if a new message arrives
// and the message sender is NOT the current user.
export default function useNewMessageNotification(newMessage: { id: string; text: string; sender: string } | null) {
  const { user } = useAppStore();
  useEffect(() => {
    if (newMessage && user && newMessage.sender !== user.username) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Message Received',
          body: newMessage.text,
          data: { messageId: newMessage.id },
        },
        trigger: null, // fires immediately
      });
    }
  }, [newMessage, user]);
}
