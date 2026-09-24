import { icons } from "@/constants/icons";
import { Image, Text, View } from "react-native";

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
    return (
        <View className="auth-brand-block">
            <View className="auth-logo-wrap">
                <Image source={icons.logo} className="auth-logo-mark" />
                <View>
                    <Text className="auth-wordmark">Expense Tracker</Text>
                    <Text className="auth-wordmark-sub">Subscription Tracker</Text>
                </View>
            </View>

            <Text className="auth-title">{title}</Text>
            <Text className="auth-subtitle">{subtitle}</Text>
        </View>
    );
};

export default AuthHeader;
