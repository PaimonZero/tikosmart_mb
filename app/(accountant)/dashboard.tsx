import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function AccountantDashboard() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="headlineMedium" style={styles.title}>
                    Accountant Dashboard
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                    Chào mừng đến với trang kế toán
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        marginBottom: 24,
        textAlign: "center",
        color: "#666",
    },
});
