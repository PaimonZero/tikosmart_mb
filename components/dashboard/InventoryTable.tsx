import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import DashboardService from "@/services/dashboardService";

interface ProductModel {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  status: string;
  receivedDate: string;
}

export default function InventoryTable() {
  const [data, setData] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DashboardService.getProductInStock();
        if (response && Array.isArray(response)) {
          setData(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to load inventory data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Tồn kho sản phẩm</Text>
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#1890ff" />
        </View>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ProductModel }) => {
    let statusColor = "#d9d9d9";
    let statusText = item.status || "N/A";
    
    if (statusText.toLowerCase() === "active" || statusText.toLowerCase() === "đang bán") {
      statusColor = "#52c41a";
      statusText = "Đang bán";
    } else if (statusText.toLowerCase() === "inactive" || statusText.toLowerCase() === "ngừng bán") {
      statusColor = "#ff4d4f";
      statusText = "Ngừng bán";
    } else if (statusText.toLowerCase() === "warning" || statusText.toLowerCase() === "cảnh báo") {
      statusColor = "#faad14";
      statusText = "Cảnh báo";
    }

    return (
      <View style={styles.row}>
        <View style={styles.colName}>
          <Text style={styles.nameText} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.categoryText}>{item.category} • SKU: {item.sku}</Text>
        </View>
        <View style={styles.colStock}>
          <Text style={styles.stockText}>{item.stock?.toLocaleString("vi-VN")}</Text>
        </View>
        <View style={styles.colStatus}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tồn kho sản phẩm</Text>
      
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, styles.colName]}>Sản phẩm</Text>
        <Text style={[styles.headerText, styles.colStock]}>Tồn kho</Text>
        <Text style={[styles.headerText, styles.colStatus]}>Trạng thái</Text>
      </View>

      {data.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Không có dữ liệu</Text>
        </View>
      ) : (
        <FlatList
          data={data.slice(0, 10)}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a2e",
  },
  center: {
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    color: "#999",
  },
  headerRow: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8c8c8c",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  colName: {
    flex: 3,
    paddingRight: 8,
  },
  colStock: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 8,
  },
  colStatus: {
    flex: 1.2,
    alignItems: "flex-end",
  },
  nameText: {
    fontSize: 13,
    color: "#262626",
    fontWeight: "500",
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 11,
    color: "#8c8c8c",
  },
  stockText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1677ff",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#f5f5f5",
  },
});
