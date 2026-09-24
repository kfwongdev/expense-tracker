import clsx from "clsx";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { colors } from "@/constants/theme";

const AuthButton = ({ label, onPress, loading, disabled }: AuthButtonProps) => {
    const isDisabled = !!disabled || !!loading;

    return (
        <TouchableOpacity
            className={clsx("auth-button", isDisabled && "auth-button-disabled")}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.85}
        >
            {loading ? (
                <ActivityIndicator color={colors.primary} />
            ) : (
                <Text className="auth-button-text">{label}</Text>
            )}
        </TouchableOpacity>
    );
};

export default AuthButton;
