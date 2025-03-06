import React, { useRef, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, Modal } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { LightTheme, DarkTheme } from './theme'; // your MD3 themes from theme.ts
import { ErrorBoundary } from 'react-error-boundary';
import RootNavigator from './navigation/RootNavigator';
import useAppStore from './stores/appStore';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Something went wrong:</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
    </View>
  );
}

export default function App() {
  const { isDarkTheme, modal, hideModal } = useAppStore();
  const paperTheme = isDarkTheme ? DarkTheme : LightTheme;
  const navigationRef = useRef(null);
  const navigationTheme = {
    ...(isDarkTheme ? NavigationDarkTheme : NavigationDefaultTheme),
    colors: {
      ...(isDarkTheme ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface, // Header background color
      text: paperTheme.colors.onSurface, // Header text color
      border: paperTheme.colors.outline,
      notification: paperTheme.colors.error,
    },
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={paperTheme.colors.background}
      />
      <PaperProvider theme={paperTheme}>
        <NavigationContainer
          ref={navigationRef}
          theme={navigationTheme}
        >
          <RootNavigator />
        </NavigationContainer>

        <Modal
          visible={modal.visible}
          transparent
          animationType="slide"
          onRequestClose={hideModal}
        >
          <View style={styles.modalContainer}>
            <View style={{ backgroundColor: paperTheme.colors.background, padding: 20 }}>
              {modal.content}
            </View>
          </View>
        </Modal>
      </PaperProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});