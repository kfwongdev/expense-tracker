import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthHeader from "@/components/auth/AuthHeader";
import { getClerkErrorMessage, isClerkFieldError, isValidEmail } from "@/lib/utils";
import { useResendCooldown } from "@/lib/useResendCooldown";
import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSafeAreaView);

const SignUpScreen = () => {
    const { signUp, errors, fetchStatus } = useSignUp();
    const router = useRouter();
    const resend = useResendCooldown();

    const [step, setStep] = useState<"credentials" | "verify">("credentials");
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const isSubmitting = fetchStatus === "fetching";

    const emailError = emailAddress.length > 0 && !isValidEmail(emailAddress)
        ? "Enter a valid email address."
        : errors.fields.emailAddress?.message;

    const passwordError = errors.fields.password?.message;

    const confirmPasswordError = confirmPassword.length > 0 && confirmPassword !== password
        ? "Passwords do not match."
        : null;

    const canSubmit = useMemo(
        () =>
            isValidEmail(emailAddress) &&
            password.length > 0 &&
            confirmPassword === password &&
            !isSubmitting,
        [emailAddress, password, confirmPassword, isSubmitting]
    );

    const goToTabs = () => router.replace("/(tabs)");

    const finalizeSession = async () => {
        await signUp.finalize({
            navigate: ({ session }) => {
                if (session?.currentTask) return;
                goToTabs();
            },
        });
    };

    const handleSignUp = async () => {
        if (!canSubmit) return;
        setFormError(null);

        try {
            const { error } = await signUp.password({ emailAddress: emailAddress.trim(), password });
            if (error) {
                if (!isClerkFieldError(error)) setFormError(getClerkErrorMessage(error));
                return;
            }

            const sent = await signUp.verifications.sendEmailCode();
            if (sent.error) {
                setFormError(getClerkErrorMessage(sent.error));
                return;
            }

            resend.restart();
            setStep("verify");
        } catch (error) {
            setFormError(getClerkErrorMessage(error));
        }
    };

    const handleVerify = async () => {
        if (code.length === 0 || isSubmitting) return;
        setFormError(null);

        try {
            const { error } = await signUp.verifications.verifyEmailCode({ code });
            if (error) {
                setFormError(getClerkErrorMessage(error));
                return;
            }

            if (signUp.status === "complete") {
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
            await signUp.verifications.sendEmailCode();
            resend.restart();
        } catch (error) {
            setFormError(getClerkErrorMessage(error));
        }
    };

    const handleBack = async () => {
        setFormError(null);
        setCode("");
        await signUp.reset();
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
                                title="Create your account"
                                subtitle="Start tracking every subscription in one place"
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
                                        error={emailError}
                                    />

                                    <AuthField
                                        label="Password"
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Create a password"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoComplete="password-new"
                                        textContentType="newPassword"
                                        error={passwordError}
                                    />
                                    <AuthField
                                        label="Confirm password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder="Re-enter your password"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        autoComplete="password-new"
                                        textContentType="newPassword"
                                        error={confirmPasswordError}
                                    />

                                    <AuthButton
                                        label="Sign up"
                                        onPress={handleSignUp}
                                        disabled={!canSubmit}
                                        loading={isSubmitting}
                                    />
                                </View>
                            </View>

                            <View className="auth-link-row">
                                <Text className="auth-link-copy">Already have an account?</Text>
                                <Link href="/(auth)/sign-in">
                                    <Text className="auth-link">Sign in</Text>
                                </Link>
                            </View>

                            <View nativeID="clerk-captcha" />
                        </>
                    ) : (
                        <>
                            <AuthHeader
                                title="Check your inbox"
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
                                        label="Verify and continue"
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
                                    <Text className="auth-back-text">Use a different email</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpScreen;
