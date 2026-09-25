import SubscriptionCard from "@/components/SubscriptionCard";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { colors } from "@/constants/theme";
import { styled } from "nativewind";
import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    const [query, setQuery] = useState("");
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

    const filteredSubscriptions = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return HOME_SUBSCRIPTIONS;

        return HOME_SUBSCRIPTIONS.filter(({ name, category, plan }) =>
            [name, category, plan].some((field) => field?.toLowerCase().includes(normalizedQuery))
        );
    }, [query]);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="subs-title">Subscriptions</Text>

            {/* Kept outside the FlatList header so the input doesn't remount and lose focus on each keystroke */}
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search subscriptions"
                placeholderTextColor={colors.mutedForeground}
                className="subs-search"
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                returnKeyType="search"
            />

            <FlatList
                data={filteredSubscriptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => setExpandedSubscriptionId((currentId) => (
                            currentId === item.id ? null : item.id
                        ))}
                    />
                )}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                ListEmptyComponent={
                    <Text className="home-empty-state">
                        {query.trim() ? `No subscriptions match "${query.trim()}".` : "No subscriptions yet."}
                    </Text>
                }
                contentContainerClassName="pb-30"
            />
        </SafeAreaView>
    )
}

export default Subscriptions
