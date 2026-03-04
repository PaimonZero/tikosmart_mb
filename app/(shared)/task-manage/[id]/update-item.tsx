import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Camera, Save, UploadCloud } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ImageSourceModal from "@/components/task-manage/TaskDetail/ImageSourceModal";
import { useTaskPermission } from "@/hooks/useTaskPermission";
import { useAppDispatch } from "@/store/hooks";
import { updateTaskItemByPicker } from "@/store/taskSlice";

type ImageType = "preEvd" | "postEvd" | null;

export default function UpdateTaskItemScreen() {
    const { id, itemId, preQtyParam, postQtyParam, preEvdParam, postEvdParam, productNameParam } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { canView } = useTaskPermission();

    const [postQty, setPostQty] = useState(postQtyParam ? String(postQtyParam) : "0");
    const [preEvd, setPreEvd] = useState<string | null>(preEvdParam ? String(preEvdParam) : null);
    const [postEvd, setPostEvd] = useState<string | null>(postEvdParam ? String(postEvdParam) : null);

    // File objects payload to pass to API
    const [preEvdFile, setPreEvdFile] = useState<any>(null);
    const [postEvdFile, setPostEvdFile] = useState<any>(null);

    const [isSaving, setIsSaving] = useState(false);

    // Bottom Sheet Control
    const [sheetVisible, setSheetVisible] = useState(false);
    const [targetImageType, setTargetImageType] = useState<ImageType>(null);

    // Initialize Local Settings
    useEffect(() => {
        // Here normally we might fetch fresh task data or just rely on passed params. 
        // For production, fetching the single item from redux or passing it through Context is safer.
        // For demo, we are relying on user input purely as state, then dispatching the thunk.
    }, [itemId]);

    const openImageSheet = (type: ImageType) => {
        setTargetImageType(type);
        setSheetVisible(true);
    };

    const processImageSelection = (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled && result.assets && result.assets[0]) {
            const asset = result.assets[0];
            const file = {
                uri: asset.uri,
                type: asset.mimeType || "image/jpeg",
                name: asset.fileName || "evidence.jpg",
            };

            if (targetImageType === "preEvd") {
                setPreEvd(asset.uri);
                setPreEvdFile(file);
            } else if (targetImageType === "postEvd") {
                setPostEvd(asset.uri);
                setPostEvdFile(file);
            }
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Lỗi", "Cần quyền truy cập máy ảnh để chụp ảnh.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });

        processImageSelection(result);
    };

    const pickFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Lỗi", "Cần quyền truy cập thư viện để chọn ảnh.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });

        processImageSelection(result);
    };

    const handleSave = async () => {
        if (!itemId || !id) return;
        setIsSaving(true);

        try {
            // Chuẩn bị FormData theo đúng config payload cho UpdateTaskItemData (nhận formData ở Backend)
            const formData = new FormData();
            formData.append("postQty", String(postQty));

            if (preEvdFile) {
                formData.append("preEvd", preEvdFile as any);
            }
            if (postEvdFile) {
                formData.append("postEvd", postEvdFile as any);
            }

            // Gọi đúng thunk updateTaskItemByPicker đã định nghĩa trong taskSlice.ts
            await dispatch(updateTaskItemByPicker({
                taskId: id as string,
                itemId: itemId as string,
                data: formData as any, // Ép kiểu vì data ban đầu định dạng interface là json nhưng axios/service sẽ xử lý formData
            })).unwrap();

            Alert.alert("Thành công", "Đã lưu cập nhật sản phẩm.", [
                { text: "OK", onPress: () => router.back() }
            ]);

        } catch (error: any) {
            Alert.alert("Lỗi", error?.message || "Lỗi lưu cập nhật.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!canView) return null;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
            <View className="px-4 py-3 flex-row items-center border-b border-gray-100 bg-white">
                <TouchableOpacity onPress={() => router.back()} disabled={isSaving} className="p-2 -ml-2">
                    <ArrowLeft size={24} color="#1f2937" />
                </TouchableOpacity>
                <Text className="text-lg font-bold ml-2">Cập nhật Sản phẩm</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
                <ScrollView className="flex-1 px-4 pt-4 pb-24" showsVerticalScrollIndicator={false}>

                    <Text className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-medium">Sản phẩm</Text>
                    <Text className="text-lg font-bold text-gray-900 leading-6 mb-6">
                        {productNameParam || "Sản phẩm đang được soạn... (Tải lại trang nếu không khớp)"}
                    </Text>

                    {/* Quantity Section */}
                    <Text className="text-base font-bold text-gray-900 mb-2">Số lượng soạn</Text>
                    <View className="flex-row bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                        <View className="flex-1 items-center border-r border-gray-200 px-2 justify-center">
                            <Text className="text-sm font-medium text-gray-500 mb-1">Cần lấy (Yêu cầu)</Text>
                            <Text className="text-2xl font-bold text-gray-800">{preQtyParam || 0}</Text>
                        </View>
                        <View className="flex-1 items-center px-4 justify-center">
                            <Text className="text-sm font-medium text-blue-600 mb-1">Đã lấy (Thực tế)</Text>
                            <TextInput
                                className="w-full text-center text-2xl font-bold text-blue-700 bg-white border border-blue-200 rounded-lg py-1 px-2"
                                value={postQty}
                                onChangeText={setPostQty}
                                keyboardType="numeric"
                                selectTextOnFocus
                            />
                        </View>
                    </View>

                    {/* Evidences Section */}
                    <Text className="text-base font-bold text-gray-900 mb-2 mt-2">Ảnh minh chứng</Text>

                    <View className="flex-row space-x-4 mb-8">
                        {/* Pre Evd */}
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500 font-medium mb-2 text-center">Trước khi soạn</Text>
                            <TouchableOpacity
                                onPress={() => openImageSheet("preEvd")}
                                className="h-40 w-full rounded-2xl bg-gray-100 items-center justify-center border border-dashed border-gray-300 overflow-hidden"
                            >
                                {preEvd ? (
                                    <>
                                        <Image source={{ uri: preEvd }} className="w-full h-full" resizeMode="cover" />
                                        <View className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full">
                                            <Camera color="white" size={16} />
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud color="#9ca3af" size={32} />
                                        <Text className="text-gray-500 font-medium mt-2">Tải ảnh lên</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Post Evd */}
                        <View className="flex-1">
                            <Text className="text-sm text-gray-500 font-medium mb-2 text-center">Sau khi soạn</Text>
                            <TouchableOpacity
                                onPress={() => openImageSheet("postEvd")}
                                className="h-40 w-full rounded-2xl bg-gray-100 items-center justify-center border border-dashed border-gray-300 overflow-hidden"
                            >
                                {postEvd ? (
                                    <>
                                        <Image source={{ uri: postEvd }} className="w-full h-full" resizeMode="cover" />
                                        <View className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full">
                                            <Camera color="white" size={16} />
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud color="#9ca3af" size={32} />
                                        <Text className="text-gray-500 font-medium mt-2">Tải ảnh lên</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Sticky Save Button */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-lg">
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isSaving}
                    className={`rounded-xl flex-row items-center justify-center py-4 ${isSaving ? 'bg-blue-400' : 'bg-blue-600'}`}
                >
                    <Save color="white" size={20} />
                    <Text className="text-white font-bold text-base ml-2">
                        {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet for Image Selection */}
            <ImageSourceModal
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                onPickFromLibrary={pickFromLibrary}
                onTakePhoto={takePhoto}
            />

        </SafeAreaView>
    );
}
