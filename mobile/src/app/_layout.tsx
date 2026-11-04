import { Stack } from 'expo-router';
import { DatabaseProvider } from '../db/provider';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="index" />
      </Stack>
    </DatabaseProvider>
  );
}