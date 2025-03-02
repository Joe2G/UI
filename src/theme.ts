import { MD3LightTheme as PaperDefaultTheme, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';

export const LightTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: '#6200ee',       // Modern purple
    accent: '#03dac4',        // Modern teal
    background: '#ffffff',
    surface: '#f5f5f5',
    onSurface: '#000000',     // Used for text on surfaces
    error: '#B00020',
    onSurfaceVariant: '#757575', // Used for placeholder text
  },
};

export const DarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#bb86fc',       // Lighter purple for dark mode
    accent: '#03dac6',
    background: '#121212',
    surface: '#1e1e1e',
    onSurface: '#ffffff',
    error: '#cf6679',
    onSurfaceVariant: '#a1a1a1',
  },
};
