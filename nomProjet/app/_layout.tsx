import { Stack } from 'expo-router';
import { Provider } from 'react-redux';

import { store } from '../store/store';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
