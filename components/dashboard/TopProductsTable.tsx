import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from "react-native";
import DashboardService from "@/services/dashboardService";

interface Product {
    id: number;
    productName: string;
    skuCode: string;
    categoryName: string;
    totalSold: number;
    orderCount: number;
    imgUrl?: string;
}

export default function TopProductsTable() {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await DashboardService.getTopSellerProducts();
                if (res.success && Array.isArray(res.data)) {
                    setData(res.data.slice(0, 5));
                }
            } catch {
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Top sản phẩm bán chạy</Text>
                <View style={styles.center}><ActivityIndicator size="small" color="#1890ff" /></View>
            </View>
        );
    }

    if (!data.length) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>Top sản phẩm bán chạy</Text>
                <View style={styles.center}><Text style={styles.empty}>Không có dữ liệu</Text></View>
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: Product; index: number }) => (
        <View style={[styles.row, index % 2 === 0 && styles.rowEven]}>
            <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            {item.imgUrl ? (
                <Image source={{ uri: item.imgUrl }} style={styles.productImg} />
            ) : (
                <View style={[styles.productImg, styles.imgPlaceholder]}>
                    <Text style={styles.imgPlaceholderText}>N/A</Text>
                </View>
            )}
            <View style={styles.info}>
                <Text style={styles.productName} numberOfLines={1}>{item.productName}</Text>
                <Text style={styles.sku}>{item.skuCode} • {item.categoryName}</Text>
            </View>
            <View style={styles.stats}>
                <Text style={styles.statValue}>{item.totalSold}</Text>
                <Text style={styles.statLabel}>đã bán</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Top sản phẩm bán chạy</Text>
            <View style={styles.header}>
                <Text style={[styles.headerText, { flex: 1 }]}>Sản phẩm</Text>
                <Text style={[styles.headerText, { width: 60, textAlign: "center" }]}>Đã bán</Text>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    title: { fontSize: 15, fontWeight: "700", marginBottom: 12, color: "#1a1a2e" },
    center: { height: 100, justifyContent: "center", alignItems: "center" },
    empty: { color: "#999", fontSize: 13 },
    header: {
        flexDirection: "row",
        paddingHorizontal: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e8ecf1",
        marginBottom: 4,
    },
    headerText: { fontSize: 11, fontWeight: "600", color: "#8c8c8c", textTransform: "uppercase" },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    rowEven: { backgroundColor: "#f7f9fc" },
    rankBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#1890ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    rankText: { fontSize: 11, fontWeight: "700", color: "#fff" },
    productImg: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 10,
    },
    imgPlaceholder: {
        backgroundColor: "#e8ecf1",
        justifyContent: "center",
        alignItems: "center",
    },
    imgPlaceholderText: { fontSize: 9, color: "#999" },
    info: { flex: 1 },
    productName: { fontSize: 13, fontWeight: "600", color: "#1a1a2e" },
    sku: { fontSize: 11, color: "#8c8c8c", marginTop: 2 },
    stats: { width: 60, alignItems: "center" },
    statValue: { fontSize: 15, fontWeight: "700", color: "#1890ff" },
    statLabel: { fontSize: 9, color: "#8c8c8c" },
});
