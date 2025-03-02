import { create } from 'zustand';

interface AppState {
  user: { id: string; username: string };
  modal: { visible: boolean; content: React.ReactNode };
  currentChat: string | null;
  isDarkTheme: boolean;
  setUser: (user: { id: string; username: string }) => void;
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
  setCurrentChat: (chatId: string) => void;
  toggleTheme: () => void;
}

const useAppStore = create<AppState>((set) => ({
  user: { id: '', username: '' },
  modal: { visible: false, content: null },
  currentChat: null,
  isDarkTheme: false,
  setUser: (user) => set({ user }),
  showModal: (content) => set({ modal: { visible: true, content } }),
  hideModal: () => set({ modal: { visible: false, content: null } }),
  setCurrentChat: (chatId) => set({ currentChat: chatId }),
  toggleTheme: () => set((state) => ({ isDarkTheme: !state.isDarkTheme })),
}));

export default useAppStore;