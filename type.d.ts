import type { ImageSourcePropType } from "react-native";

declare global {
    interface AppTab {
        name: string;
        title: string;
        icon: ImageSourcePropType;
    }

    interface TabIconProps {
        focused: boolean;
        icon: ImageSourcePropType;
    }

    interface Subscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        plan?: string;
        category?: string;
        paymentMethod?: string;
        status?: string;
        startDate?: string;
        price: number;
        currency?: string;
        billing: string;
        renewalDate?: string;
        color?: string;
    }

    interface SubscriptionCardProps extends Omit<Subscription, "id"> {
        expanded: boolean;
        onPress: () => void;
        onCancelPress?: () => void;
        isCancelling?: boolean;
    }

    interface UpcomingSubscription {
        id: string;
        icon: ImageSourcePropType;
        name: string;
        price: number;
        currency?: string;
        daysLeft: number;
    }

    interface UpcomingSubscriptionCardProps
        extends Omit<UpcomingSubscription, "id"> {}

    interface ListHeadingProps {
        title: string;
    }

    interface AuthHeaderProps {
        title: string;
        subtitle: string;
    }

    interface AuthFieldProps {
        label: string;
        value: string;
        onChangeText: (value: string) => void;
        placeholder: string;
        error?: string | null;
        secureTextEntry?: boolean;
        keyboardType?: import("react-native").KeyboardTypeOptions;
        autoCapitalize?: import("react-native").TextInputProps["autoCapitalize"];
        autoComplete?: import("react-native").TextInputProps["autoComplete"];
        textContentType?: import("react-native").TextInputProps["textContentType"];
        maxLength?: number;
    }

    interface AuthButtonProps {
        label: string;
        onPress: () => void;
        loading?: boolean;
        disabled?: boolean;
    }
}

export { };
