import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { store, persistor } from '../src/store/store';
import { LoadingSpinner } from '../src/components/ui/LoadingSpinner';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <Provider store={store}>
      <PersistGate 
        loading={<LoadingSpinner size="large" color="#FFD700" />} 
        persistor={persistor}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" backgroundColor="#0A0A0A" />
      </PersistGate>
    </Provider>
  );
}
