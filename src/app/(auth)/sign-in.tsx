import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthHeader from "@/components/auth/AuthHeader";
import { getClerkErrorMessage, isValidEmail } from "@/lib/utils";
import { useResendCooldown } from "@/lib/useResendCooldown";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const SignInScreen = () => {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();
    const resend = useResendCooldown();

    const [step, setStep] = useState<"credentials" | "verify">("credentials");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const isSubmitting = fetchStatus === "fetching";
    const canSubmit = useMemo(
        () => isValidEmail(emailAddress) && password.length > 0 && !isSubmitting,
        [emailAddress, password, isSubmitting]
    );

    const goToTabs = () => router.replace("/(tabs)");

    const finalizeSession = async () => {
        await signIn.finalize({
            navigate: ({ session }) => {
                if (session?.currentTask) return;
                goToTabs();
            },
        });
    };

    const handleSignIn = async () => {
        if (!canSubmit) return;
        setFormError(null);

        try {
            const { error } = await signIn.password({ emailAddress: emailAddress.trim(), password });
            if (error) {
                setFormError(getClerkErrorMessage(error));
                return;
            }

            if (signIn.status === "complete") {
                await finalizeSession();
            } else if (signIn.status === "needs_client_trust") {
                const emailCodeFactor = signIn.supportedSecondFactors?.find(
                    (factor) => factor.strategy === "email_code"
                );
                if (emailCodeFactor) {
                    await signIn.mfa.sendEmailCode();
                }
                resend.restart();
                setStep("verify");
            } else {
                setFormError("We couldn't sign you in. Please check your details and try again.");
            }
        } catch (error) {
            setFormError(getClerkErrorMessage(error));
        }
    };

    const handleVerify = async () => {
        if (code.length === 0 || isSubmitting) return;
        setFormError(null);

        try {
            const { error } = await signIn.mfa.verifyEmailCode({ code });
            if (error) {
                setFormError(getClerkErrorMessage(error));
                return;
            }

            if (signIn.status === "complete") {
                await finalizeSession();
            } else {
                setFormError("That code didn't work. Please try again.");
            }
        } catch (error) {
            setFormError(getClerkErrorMessage(error));
        }
    };

    const handleResend = async () => {
        if (!resend.canResend) return;
        setFormError(null);
        try {
            await signIn.mfa.sendEmailCode();
            resend.restart();
        } catch (error) {
            setFormError(getClerkErrorMessage(error));
        }
    };

    const handleBack = async () => {
        setFormError(null);
        setCode("");
        await signIn.reset();
        setStep("credentials");
    };

    return (
        <SafeAreaView className="auth-safe-area">
            <KeyboardAvoidingView
                className="auth-screen"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    className="auth-scroll"
                    contentContainerClassName="auth-content"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {step === "credentials" ? (
                        <>
                            <AuthHeader
                                title="Welcome back"
                                subtitle="Sign in to continue tracking your subscriptions"
                            />

                            <View className="auth-card">
                                <View className="auth-form">
                                    {formError && (
                                        <Text className="auth-form-error">{formError}</Text>
                                    )}

                                    <AuthField
                                        label="Email"
                                        value={emailAddress}
                                        onChangeText={setEmailAddress}
                                        placeholder="Enter your email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        textContentType="emailAddress"
                                        error={errors.fields.identifier?.message}
                                    />

                                    <AuthField
                                        label="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Enter your password"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        textContentType="password"
                                        error={errors.fields.password?.message}
                                    />

                                    <AuthButton
                                        label="Sign in"
                                        onPress={handleSignIn}
                                        disabled={!canSubmit}
                                        loading={isSubmitting}
                                    />
                                </View>
                            </View>

                            <View className="auth-link-row">
                                <Text className="auth-link-copy">New here?</Text>
                                <Link href="/(auth)/sign-up">
                                    <Text className="auth-link">Create an account</Text>
                                </Link>
                            </View>
                        </>
                    ) : (
                        <>
                            <AuthHeader
                                title="Verify it's you"
                                subtitle={`Enter the code we sent to ${emailAddress}`}
                            />

                            <View className="auth-card">
                                <View className="auth-form">
                                    {formError && (
                                        <Text className="auth-form-error">{formError}</Text>
                                    )}

                                    <AuthField
                                        label="Verification code"
                                        value={code}
                                        onChangeText={setCode}
                                        placeholder="000000"
                                        keyboardType="numeric"
                                        maxLength={6}
                                        error={errors.fields.code?.message}
                                    />

                                    <AuthButton
                                        label="Verify"
                                        onPress={handleVerify}
                                        disabled={code.length === 0}
                                        loading={isSubmitting}
                                    />
                                </View>
                            </View>

                            <View className="auth-resend-row">
                                <Text className="auth-link-copy">Didn&apos;t get a code?</Text>
                                <TouchableOpacity onPress={handleResend} disabled={!resend.canResend}>
                                    <Text
                                        className={
                                            resend.canResend
                                                ? "auth-resend-text"
                                                : "auth-resend-text auth-resend-text-disabled"
                                        }
                                    >
                                        {resend.canResend ? "Resend" : `Resend (${resend.secondsLeft}s)`}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="auth-back-row">
                                <TouchableOpacity onPress={handleBack}>
                                    <Text className="auth-back-text">Use a different account</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignInScreen;
