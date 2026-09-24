import AuthButton from "@/components/auth/AuthButton";
import { getClerkErrorMessage } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { useState } from "react";
import { Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const settings = () => {
    const { signOut } = useAuth();
    const { user } = useUser();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignOut = async () => {
        setError(null);
        setIsSigningOut(true);
        try {
            // AuthGate in the root layout redirects to sign-in once the session ends
            await signOut();
        } catch (err) {
            setError(getClerkErrorMessage(err));
            setIsSigningOut(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-2xl font-sans-bold">Settings</Text>

            <View className="mt-6 gap-4">
                {user?.primaryEmailAddress && (
                    <Text className="font-sans-medium">
                        Signed in as {user.primaryEmailAddress.emailAddress}
                    </Text>
                )}

                {error && <Text className="auth-form-error">{error}</Text>}

                <AuthButton label="Log out" onPress={handleSignOut} loading={isSigningOut} />
            </View>
        </SafeAreaView >
    )
}

export default settings
