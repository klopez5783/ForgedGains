import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="sign-in" options={{headerShown: false}} />
        <Stack.Screen name="sign-up" options={{headerShown: false}} />
        <Stack.Screen name="resetPassword" options={{headerShown: false}} />
      </Stack>
      <StatusBar
        backGroundColor="#161622"
        style="light"
      />
    </>
  );
}