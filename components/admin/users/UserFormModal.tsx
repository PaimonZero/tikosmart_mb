import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { User, UserFormData } from "./types";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "./types";

interface UserFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: UserFormData) => Promise<void>;
    editingUser: User | null;
    isLoading: boolean;
}

export default function UserFormModal({
    visible,
    onClose,
    onSubmit,
    editingUser,
    isLoading,
}: UserFormModalProps) {
    const [formData, setFormData] = useState<UserFormData>({
        username: editingUser?.username || "",
        fullName: editingUser?.fullName || "",
        email: editingUser?.email || "",
        phone: editingUser?.phone || "",
        role: editingUser?.role || "seller",
        status: editingUser?.status || "active",
        password: "",
    });

    // Update form when editingUser changes
    React.useEffect(() => {
        if (editingUser) {
            setFormData({
                username: editingUser.username,
                fullName: editingUser.fullName,
                email: editingUser.email || "",
                phone: editingUser.phone || "",
                role: editingUser.role,
                status: editingUser.status || "active",
                password: "",
            });
        } else {
            setFormData({
                username: "",
                fullName: "",
                email: "",
                phone: "",
                role: "seller",
                status: "active",
                password: "",
            });
        }
    }, [editingUser, visible]);

    const handleSubmit = async () => {
        await onSubmit(formData);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    {/* Header */}
                    <View className="bg-white border-b border-gray-200 px-4 py-4 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            className="w-10 h-10 items-center justify-center -ml-2"
                        >
                            <Ionicons name="close" size={28} color="#374151" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-gray-900">
                            {editingUser ? "Sửa người dùng" : "Thêm người dùng"}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView
                        className="flex-1 px-4 py-4"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Username */}
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">
                                Username <Text className="text-red-500">*</Text>
                            </Text>
                            <View
                                className="flex-row items-center bg-white rounded-xl px-4 py-3 border-2"
                                style={{
                                    borderColor: editingUser ? "#E5E7EB" : "#D1D5DB",
                                    backgroundColor: editingUser ? "#F9FAFB" : "white",
                                }}
                            >
                                <Ionicons name="person-outline" size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-base text-gray-900"
                                    value={formData.username}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, username: text })
                                    }
                                    editable={!editingUser}
                                    placeholder="Nhập username"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                />
                            </View>
                            {editingUser && (
                                <Text className="text-xs text-gray-500 mt-1">
                                    Username không thể thay đổi
                                </Text>
                            )}
                        </View>

                        {/* Full Name */}
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">
                                Họ và tên <Text className="text-red-500">*</Text>
                            </Text>
                            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border-2 border-gray-200">
                                <Ionicons
                                    name="person-circle-outline"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    className="flex-1 ml-3 text-base text-gray-900"
                                    value={formData.fullName}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, fullName: text })
                                    }
                                    placeholder="Nhập họ và tên"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </Text>
                            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border-2 border-gray-200">
                                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-base text-gray-900"
                                    value={formData.email}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, email: text })
                                    }
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="Nhập email"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Phone */}
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">
                                Số điện thoại
                            </Text>
                            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border-2 border-gray-200">
                                <Ionicons name="call-outline" size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-base text-gray-900"
                                    value={formData.phone}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, phone: text })
                                    }
                                    keyboardType="phone-pad"
                                    placeholder="Nhập số điện thoại"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu{" "}
                                {!editingUser && <Text className="text-red-500">*</Text>}
                            </Text>
                            <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border-2 border-gray-200">
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color="#6B7280"
                                />
                                <TextInput
                                    className="flex-1 ml-3 text-base text-gray-900"
                                    value={formData.password}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, password: text })
                                    }
                                    secureTextEntry
                                    placeholder={
                                        editingUser ? "Để trống nếu không đổi" : "Nhập mật khẩu"
                                    }
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Role */}
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">
                                Vai trò <Text className="text-red-500">*</Text>
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                                {ROLE_OPTIONS.map((role) => {
                                    const isSelected = formData.role === role.value;
                                    return (
                                        <TouchableOpacity
                                            key={role.value}
                                            onPress={() =>
                                                setFormData({ ...formData, role: role.value })
                                            }
                                            activeOpacity={0.7}
                                            className="px-4 py-2.5 rounded-xl border-2"
                                            style={{
                                                backgroundColor: isSelected
                                                    ? role.color + "20"
                                                    : "white",
                                                borderColor: isSelected ? role.color : "#E5E7EB",
                                            }}
                                        >
                                            <Text
                                                className="text-sm font-semibold"
                                                style={{
                                                    color: isSelected ? role.color : "#6B7280",
                                                }}
                                            >
                                                {role.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Status */}
                        <View className="mb-6">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">
                                Trạng thái <Text className="text-red-500">*</Text>
                            </Text>
                            <View className="flex-row gap-3">
                                {STATUS_OPTIONS.map((status) => {
                                    const isSelected = formData.status === status.value;
                                    return (
                                        <TouchableOpacity
                                            key={status.value}
                                            onPress={() =>
                                                setFormData({
                                                    ...formData,
                                                    status: status.value,
                                                })
                                            }
                                            activeOpacity={0.7}
                                            className="flex-1 px-4 py-3 rounded-xl border-2"
                                            style={{
                                                backgroundColor: isSelected
                                                    ? status.color + "20"
                                                    : "white",
                                                borderColor: isSelected ? status.color : "#E5E7EB",
                                            }}
                                        >
                                            <Text
                                                className="text-sm font-semibold text-center"
                                                style={{
                                                    color: isSelected ? status.color : "#6B7280",
                                                }}
                                            >
                                                {status.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3 mb-6">
                            <TouchableOpacity
                                onPress={onClose}
                                activeOpacity={0.7}
                                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                                disabled={isLoading}
                            >
                                <Text className="text-base font-bold text-gray-700">Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                activeOpacity={0.7}
                                className="flex-1 rounded-xl py-4 items-center"
                                style={{
                                    backgroundColor: isLoading ? "#93C5FD" : "#3B82F6",
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-base font-bold text-white">
                                        {editingUser ? "Cập nhật" : "Tạo mới"}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}
