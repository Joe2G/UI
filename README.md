# 📱 YChat - React Native Chat App

Welcome to **YChat**, a sleek and modern chat application built with **React Native & Expo**! 🚀

## ✨ Features

✔️ **Real-time Messaging** (via Socket.io) 📨  
✔️ **WebRTC Calls** (Voice) 📞  
✔️ **VIP & Regular Chats** 🔒  
✔️ **Dark Mode Support** 🌙  
✔️ **Chat Sharing & Deletion** ✂️  
✔️ **Auto-Deleting Messages (24h Expiry)** ⏳  
✔️ **Theming with React Native Paper** 🎨  
✔️ **State Management with Zustand** 🏗️  

---

## 📂 Folder Structure

```
frontend/
├── assets/                  # App icon
├── src/
│   ├── components/          # UI components (ChatList, SendMessage, MessageBubble, etc.)
│   ├── hooks/               # Custom hooks (useSocket, useUsername, etc.)
│   ├── modals/              # Custom modals (ChatNameModal, EnterChatIdModalContent)
│   ├── navigation/          # App navigations (AppNavigator, RootNavigator)
│   ├── screens/             # Screens of the app (ChatScreen, SignInScreen)
│   ├── stores/              # Global state (appStore.ts)
│   ├── types/               # TypeScript definitions
│   ├── config.ts            # API & Socket.io configurations
│   ├── theme.ts             # Light & Dark mode themes
│   ├── App.tsx              # Main entry point
│   └── index.js             # Registers App component
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
├── package.json             # Dependencies & scripts
└── README.md                # You are here! 🎉
```

---

## 🚀 Getting Started

### **1️⃣ Install Dependencies**
Run the following command in the root directory:
```bash
npm install
```

### **2️⃣ Start the Expo Server**
```bash
npx expo start
```

> _Make sure your backend is running at `http://192.168.1.5:3000` (or update `SERVER_URL` in `config.ts`)._

### **3️⃣ Run on an Android Device**
- Install **Expo Go** on your phone 📲
- Scan the QR code in the terminal
- Start chatting! 🎉

---

## 🔧 Building the APK
To generate an APK for Android, use Expo's **EAS Build**:

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```
2. **Configure EAS**
   ```bash
   eas build:configure
   ```
3. **Build the APK**
   ```bash
   eas build -p android --profile production
   ```
4. **Download & Install** the APK from the Expo dashboard!

---

## 🛠️ Troubleshooting

**White Screen Issue?**
- Ensure there’s no `App.js` in the root folder (only `src/App.tsx` should exist).
- Clear cache and restart Expo:
  ```bash
  npx expo start -c
  ```
- Check the Metro Bundler logs for errors.

**WebRTC Calls Not Working?**
- Verify that both devices are on the same network.
- Ensure microphone & camera permissions are enabled in `app.json`:
  ```json
  "permissions": [
    "INTERNET", "RECORD_AUDIO"
  ]
  ```

---

## 🎨 UI Preview
🔹 **Chat List:** Displays all available chats with options to create, delete, and share.  
🔹 **Chat Screen:** Real-time messaging with a send box and WebRTC call button.  
🔹 **Dark Mode:** Automatic theme switching for better accessibility.  
🔹 **Modals & Forms:** Seamless user interactions with modals for chat creation, user login, etc.  

---

## 💡 Future Improvements
- ✅ **Push Notifications** using Expo Notifications
- ✅ **Better Offline Support & Caching**
- ✅ **More Customizable Themes**

📬 **Want to contribute or report issues?** Feel free to open a PR or raise an issue!

---

### 🚀 Built with ❤️ using:
- **Expo** (Managed Workflow)
- **React Native** (Navigation & Paper for UI)
- **Socket.io** (Real-time messaging)
- **WebRTC** (Voice calls)
- **Zustand** (Global state management)
- **Sequelize & Express** (Backend API)

Enjoy chatting! 🗨️🚀

