import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { DepartmentSelectModal } from "./DepartmentSelectModal";
import type { User, UserFormData } from "./types";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "./types";

interface UserFormBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: UserFormData) => Promise<void>;
    editingUser: User | null;
    isLoading: boolean;
}

export default function UserFormBottomSheet({
    isOpen,
    onClose,
    onSubmit,
    editingUser,
    isLoading,
}: UserFormBottomSheetProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);

    const [formData, setFormData] = useState<UserFormData>({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        role: "seller",
        status: "active",
        password: "",
        departmentId: "",
    });

    const [isDepartmentModalVisible, setIsDepartmentModalVisible] = useState(false);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState("");

    // Update form when editingUser changes
    useEffect(() => {
        if (editingUser) {
            setFormData({
                username: editingUser.username,
                fullName: editingUser.fullName,
                email: editingUser.email || "",
                phone: editingUser.phone || "",
                role: editingUser.role,
                status: editingUser.status || "active",
                password: "",
                departmentId: editingUser.departmentId || "",
            });

            // Set department name if available
            setSelectedDepartmentName(editingUser.departmentName || "");
        } else {
            setFormData({
                username: "",
                fullName: "",
                email: "",
                phone: "",
                role: "",
                status: "active",
                password: "",
                departmentId: "",
            });
            setSelectedDepartmentName(""); // Reset department name for create mode
        }
    }, [editingUser, isOpen]);

    // Handle bottom sheet open/close
    useEffect(() => {
        if (isOpen) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [isOpen]);

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                onClose();
            }
        },
        [onClose],
    );

    const handleSubmit = async () => {
        await onSubmit(formData);
    };

    const handleDepartmentSelect = (departmentId: string, departmentName: string) => {
        setFormData({ ...formData, departmentId: departmentId });
        setSelectedDepartmentName(departmentName);
        setIsDepartmentModalVisible(false);
    };

    // Render backdrop
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
            />
        ),
        [],
    );

    return (
        <>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
                backgroundStyle={{ backgroundColor: "#F9FAFB" }}
                handleIndicatorStyle={{ backgroundColor: "#D1D5DB" }}
                backdropComponent={renderBackdrop}
                style={{ zIndex: 9999 }}
            >
                <BottomSheetScrollView
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                            <Ionicons
                                name={editingUser ? "create-outline" : "person-add-outline"}
                                size={24}
                                color="#3B82F6"
                            />
                            <Text className="text-xl font-bold text-gray-900">
                                {editingUser
                                    ? "Chỉnh sửa thông tin người dùng"
                                    : "Thêm tài khoản mới"}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            className="w-8 h-8 items-center justify-center"
                        >
                            <Ionicons name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    {editingUser && (
                        <Text className="text-sm text-gray-600 mb-4">
                            Cập nhật thông tin người dùng. Các thay đổi sẽ có hiệu lực ngay lập
                            tức.
                        </Text>
                    )}

                    {!editingUser && (
                        <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="bulb" size={18} color="#F59E0B" />
                                <Text className="flex-1 text-xs text-yellow-800">
                                    <Text className="font-semibold">Lưu ý:</Text> Sau khi tạo thành
                                    công, người dùng sẽ nhận được email chứa link kích hoạt tài
                                    khoản và thiết lập mật khẩu. Link có hiệu lực trong 7 ngày.
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Email */}
                    <View className="mb-3">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            Email <Text className="text-red-500">*</Text>
                        </Text>
                        <View className="flex-row items-center bg-white rounded-xl px-3 py-1 border border-gray-200">
                            <Ionicons name="mail-outline" size={18} color="#6B7280" />
                            <TextInput
                                className="flex-1 ml-2 text-sm text-gray-900"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="example@tikovia.com"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Username and Full Name Row */}
                    <View className="flex-row gap-3 mb-3">
                        {/* Username */}
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                                Tên đăng nhập <Text className="text-red-500">*</Text>
                            </Text>
                            <View
                                className="flex-row items-center rounded-xl px-3 py-1 border"
                                style={{
                                    backgroundColor: editingUser ? "#F9FAFB" : "white",
                                    borderColor: "#E5E7EB",
                                }}
                            >
                                <Ionicons name="person-outline" size={18} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-2 text-sm text-gray-900"
                                    value={formData.username}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, username: text })
                                    }
                                    editable={!editingUser}
                                    placeholder="username123"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Full Name */}
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                                Họ và tên <Text className="text-red-500">*</Text>
                            </Text>
                            <View className="flex-row items-center bg-white rounded-xl px-3 py-1 border border-gray-200">
                                <Ionicons
                                    name="person-circle-outline"
                                    size={18}
                                    color="#6B7280"
                                />
                                <TextInput
                                    className="flex-1 ml-2 text-sm text-gray-900"
                                    value={formData.fullName}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, fullName: text })
                                    }
                                    placeholder="Nguyễn Văn A"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Phone */}
                    <View className="mb-3">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            Số điện thoại <Text className="text-red-500">*</Text>
                        </Text>
                        <View className="flex-row items-center bg-white rounded-xl px-3 py-1 border border-gray-200">
                            <Ionicons name="call-outline" size={18} color="#6B7280" />
                            <TextInput
                                className="flex-1 ml-2 text-sm text-gray-900"
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                keyboardType="phone-pad"
                                placeholder="0987654321"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {/* Role and Warehouse Row */}
                    <View className="flex-row gap-3 mb-3">
                        {/* Role */}
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                                Chức danh <Text className="text-red-500">*</Text>
                            </Text>
                            <View className="bg-white rounded-xl px-3 py-4 border border-gray-200">
                                <Text className="text-sm text-gray-900">
                                    {ROLE_OPTIONS.find((r) => r.value === formData.role)?.label ||
                                        "Chọn chức danh"}
                                </Text>
                            </View>
                        </View>

                        {/* Warehouse */}
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                                {editingUser ? "Cơ sở" : "Chọn cơ sở"}{" "}
                                <Text className="text-red-500">*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsDepartmentModalVisible(true)}
                                activeOpacity={0.7}
                                className="flex-row items-center bg-white rounded-xl px-3 py-3 border border-gray-200"
                            >
                                <Ionicons name="business-outline" size={18} color="#6B7280" />
                                <Text
                                    className="flex-1 ml-2 text-sm"
                                    style={{
                                        color: selectedDepartmentName ? "#111827" : "#9CA3AF",
                                    }}
                                >
                                    {selectedDepartmentName || "Tìm và chọn cơ sở"}
                                </Text>
                                <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Role Selection */}
                    <View className="mb-3">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            Chọn vai trò <Text className="text-red-500">*</Text>
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {ROLE_OPTIONS.map((role) => {
                                const isSelected = formData.role === role.value;
                                return (
                                    <TouchableOpacity
                                        key={role.value}
                                        onPress={() => setFormData({ ...formData, role: role.value })}
                                        activeOpacity={0.7}
                                        className="px-3 py-2 rounded-lg border-2"
                                        style={{
                                            backgroundColor: isSelected ? role.color + "20" : "white",
                                            borderColor: isSelected ? role.color : "#E5E7EB",
                                        }}
                                    >
                                        <Text
                                            className="text-xs font-semibold"
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

                    {/* Status (only for edit) */}
                    {editingUser && (
                        <View className="mb-4">
                            <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                                Trạng thái <Text className="text-red-500">*</Text>
                            </Text>
                            <View className="flex-row gap-2">
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
                                            className="flex-1 px-4 py-2.5 rounded-xl border-2"
                                            style={{
                                                backgroundColor: isSelected
                                                    ? status.color + "20"
                                                    : "white",
                                                borderColor: isSelected ? status.color : "#E5E7EB",
                                            }}
                                        >
                                            <View className="flex-row items-center justify-center gap-1.5">
                                                <View
                                                    className="w-2 h-2 rounded-full"
                                                    style={{
                                                        backgroundColor: isSelected
                                                            ? status.color
                                                            : "#9CA3AF",
                                                    }}
                                                />
                                                <Text
                                                    className="text-sm font-semibold"
                                                    style={{
                                                        color: isSelected ? status.color : "#6B7280",
                                                    }}
                                                >
                                                    {status.label}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View className="flex-row gap-3 mt-2 mb-4">
                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
                            disabled={isLoading}
                        >
                            <Text className="text-base font-bold text-gray-700">Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            activeOpacity={0.7}
                            className="flex-1 rounded-xl py-3 items-center"
                            style={{
                                backgroundColor: isLoading ? "#93C5FD" : "#3B82F6",
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-base font-bold text-white">
                                    {editingUser ? "Cập nhật" : "Tạo tài khoản"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>

            <DepartmentSelectModal
                visible={isDepartmentModalVisible}
                selectedDepartmentId={formData.departmentId || ""}
                onClose={() => setIsDepartmentModalVisible(false)}
                onSelect={handleDepartmentSelect}
            />
        </>
    );
}
