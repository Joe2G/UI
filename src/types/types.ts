export interface Message {
  id: string;
  text: string;
  sender: string;
  chatId: string;
  timestamp: number;
}

export interface Chat {
  isVIP: any;
  chatId: string;
  userId: string;
  customChatId?: string;
  lastMessage: string;
}
