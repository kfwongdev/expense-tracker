import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" asChild>
        <Text className="mt-4 rounded bg-blue-500 p-4 text-white">
          Go to onboarding
        </Text>
      </Link>
      <Link href="/(auth)/sign-in" asChild>
        <Text className="mt-4 rounded bg-blue-500 p-4 text-white">
          Go to Sign in
        </Text>
      </Link>
      <Link href="/(auth)/sign-up" asChild>
        <Text className="mt-4 rounded bg-blue-500 p-4 text-white">
          Go to Sign up
        </Text>
      </Link>

      <Link href={{ pathname: "/subscriptions/[id]", params: { id: "spotify" } }}>
        Spotify Subscription
      </Link>

      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "Claude" },
        }}>
        Claude Max Subscription
      </Link>
    </View >
  );
}