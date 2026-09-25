import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Frequency = "Monthly" | "Yearly";

const FREQUENCIES: Frequency[] = ["Monthly", "Yearly"];

const CATEGORY_COLORS = {
    Entertainment: "#f7c6c7",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    Design: "#f5c542",
    Productivity: "#b8e8d0",
    Cloud: "#c9e4f5",
    Music: "#f9d8b8",
    Other: "#e5e1d3",
} as const;

type Category = keyof typeof CATEGORY_COLORS;

const CATEGORIES = Object.keys(CATEGORY_COLORS) as Category[];

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (subscription: Subscription) => void;
}

// decimal-pad shows a comma instead of a dot in some locales
const parsePrice = (value: string): number => Number(value.trim().replace(",", "."));

const CreateSubscriptionModal = ({ visible, onClose, onCreate }: CreateSubscriptionModalProps) => {
    const insets = useSafeAreaInsets();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [frequency, setFrequency] = useState<Frequency>("Monthly");
    const [category, setCategory] = useState<Category>("Other");

    const parsedPrice = parsePrice(price);
    const canSubmit = name.trim().length > 0 && Number.isFinite(parsedPrice) && parsedPrice > 0;

    const resetForm = () => {
        setName("");
        setPrice("");
        setFrequency("Monthly");
        setCategory("Other");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = () => {
        if (!canSubmit) return;

        const trimmedName = name.trim();
        const startDate = dayjs();

        onCreate({
            id: `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${startDate.valueOf()}`,
            icon: icons.wallet,
            name: trimmedName,
            price: Math.round(parsedPrice * 100) / 100,
            currency: "USD",
            frequency,
            billing: frequency,
            category,
            status: "active",
            startDate: startDate.toISOString(),
            renewalDate: startDate.add(1, frequency === "Monthly" ? "month" : "year").toISOString(),
            color: CATEGORY_COLORS[category],
        });

        handleClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View className="modal-overlay">
                    <Pressable
                        className="absolute inset-0"
                        onPress={handleClose}
                        accessibilityLabel="Dismiss"
                    />

                    <View className="modal-container" style={{ paddingBottom: insets.bottom }}>
                        <View className="modal-header">
                            <Text className="modal-title">New Subscription</Text>
                            <Pressable
                                className="modal-close"
                                onPress={handleClose}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityLabel="Close"
                            >
                                <Text className="modal-close-text">✕</Text>
                            </Pressable>
                        </View>

                        <ScrollView
                            contentContainerClassName="modal-body"
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <AuthField
                                label="Name"
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. Netflix"
                                autoCapitalize="words"
                            />

                            <AuthField
                                label="Price"
                                value={price}
                                onChangeText={setPrice}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                            />

                            <View className="auth-field">
                                <Text className="auth-label">Frequency</Text>
                                <View className="picker-row">
                                    {FREQUENCIES.map((option) => {
                                        const isActive = frequency === option;
                                        return (
                                            <Pressable
                                                key={option}
                                                className={clsx("picker-option", isActive && "picker-option-active")}
                                                onPress={() => setFrequency(option)}
                                                accessibilityRole="button"
                                                accessibilityState={{ selected: isActive }}
                                            >
                                                <Text className={clsx("picker-option-text", isActive && "picker-option-text-active")}>
                                                    {option}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <View className="auth-field">
                                <Text className="auth-label">Category</Text>
                                <View className="category-scroll">
                                    {CATEGORIES.map((option) => {
                                        const isActive = category === option;
                                        return (
                                            <Pressable
                                                key={option}
                                                className={clsx("category-chip", isActive && "category-chip-active")}
                                                onPress={() => setCategory(option)}
                                                accessibilityRole="button"
                                                accessibilityState={{ selected: isActive }}
                                            >
                                                <Text className={clsx("category-chip-text", isActive && "category-chip-text-active")}>
                                                    {option}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>

                            <AuthButton
                                label="Add Subscription"
                                onPress={handleSubmit}
                                disabled={!canSubmit}
                            />
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default CreateSubscriptionModal;
