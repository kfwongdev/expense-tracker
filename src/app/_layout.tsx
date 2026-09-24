import '@/global.css';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file');
}

function AuthGate({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasHiddenSplash = useRef(false);
  const appIsReady = fontsLoaded && isLoaded;

  useEffect(() => {
    if (!appIsReady) return;

    if (!hasHiddenSplash.current) {
      hasHiddenSplash.current = true;
      SplashScreen.hideAsync();
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }
  }, [appIsReady, isSignedIn, segments, router]);

  if (!appIsReady) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('@/assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('@/assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('@/assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('@/assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('@/assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('@/assets/fonts/PlusJakartaSans-Light.ttf')
  })

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AuthGate fontsLoaded={fontsLoaded} />
    </ClerkProvider>
  );
}
