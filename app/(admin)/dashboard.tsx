import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";

export default function AdminDashboard() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text className="text-2xl font-bold" style={styles.title}>
                    Admin Dashboard
                </Text>
                <Text className="text-lg" style={styles.subtitle}>
                    Chào mừng đến với trang quản trị
                </Text>
                <Button
                    mode="contained"
                    onPress={() => router.push("/(admin)/userManage")}
                    style={styles.button}
                    icon="account-group"
                >
                    Quản lý User
                </Button>
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
    button: {
        marginTop: 16,
    },
});
