import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface KPICardProps {
    title: string;
    value?: number | string;
    icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    color?: string;
    customContent?: React.ReactNode;
}

export default function KPICard({
    title,
    value,
    icon,
    color = "#1890ff",
    customContent,
}: KPICardProps) {
    return (
        <View style={[styles.card, { borderLeftColor: color }]}>
            {customContent ? (
                customContent
            ) : (
                <View style={styles.row}>
                    {icon && (
                        <View style={[styles.iconWrapper, { backgroundColor: color + "20" }]}>
                            <MaterialCommunityIcons name={icon} size={22} color={color} />
                        </View>
                    )}

                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={2}>{title}</Text>
                        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#888",
        marginBottom: 4,
        fontSize: 11,
    },
    value: {
        fontSize: 22,
        fontWeight: "bold",
    },
});