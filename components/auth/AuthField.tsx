import clsx from "clsx";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const AuthField = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    secureTextEntry,
    keyboardType,
    autoCapitalize = "sentences",
    autoComplete,
    textContentType,
    maxLength,
}: AuthFieldProps) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const isPasswordField = !!secureTextEntry;

    return (
        <View className="auth-field">
            <Text className="auth-label">{label}</Text>

            <View className="auth-input-row">
                <TextInput
                    className={clsx(
                        "auth-input",
                        isPasswordField && "auth-input-with-toggle",
                        error && "auth-input-error"
                    )}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(8, 17, 38, 0.4)"
                    secureTextEntry={isPasswordField && !isRevealed}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoComplete={autoComplete}
                    textContentType={textContentType}
                    maxLength={maxLength}
                    autoCorrect={false}
                    textAlignVertical="center"
                />

                {isPasswordField && (
                    <TouchableOpacity
                        className="auth-input-toggle"
                        onPress={() => setIsRevealed((current) => !current)}
                        hitSlop={8}
                    >
                        <Text className="auth-input-toggle-text">
                            {isRevealed ? "Hide" : "Show"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text className="auth-error">{error}</Text>}
        </View>
    );
};

export default AuthField;
