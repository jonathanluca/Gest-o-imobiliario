import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { theme } from '../theme'; // O tema que criamos no passo anterior
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

// Impede a splash screen de sumir antes de carregar o app
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  
  useEffect(() => {
    // Esconde a splash screen após o app montar
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider theme={{ ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: theme.colors.primary } }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Aqui garantimos que ele procure a pasta (panel) */}
        <Stack.Screen name="(panel)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}