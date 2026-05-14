import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '900' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'DIY Electrician Academy' }} />
        <Stack.Screen name="topic/[id]" options={{ title: 'Topic' }} />
        <Stack.Screen name="curriculum" options={{ title: 'Curriculum' }} />
        <Stack.Screen name="completed" options={{ title: 'Transcript' }} />
        <Stack.Screen name="safety" options={{ title: 'Safety' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
