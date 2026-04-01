import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Camera, Eye, Save, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";

// import ImageSourceModal from "@/components/task-manage/TaskDetail/ImageSourceModal";
import { useTaskPermission } from "@/hooks/useTaskPermission";
import { taskSignal } from "@/services/taskSignal";
import { uploadWatermarkedImages } from "@/services/uploadImageService";
import { useAppDispatch } from "@/store/hooks";
import { updateTaskItemByPicker } from "@/store/taskSlice";
import { toast } from "sonner-native";

type ImageType = "preEvd" | "postEvd" | null;

export default function UpdateTaskItemScreen() {
    const { id, itemId, preQtyParam, postQtyParam, preEvdParam, postEvdParam, productNameParam } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { canView } = useTaskPermission();

    const [postQty, setPostQty] = useState(postQtyParam ? String(postQtyParam) : "0");

    const parseEvdParam = (param: any): { uri: string, meta: any }[] => {
        if (!param) return [];
        let uris: string[] = [];
        if (typeof param === 'string') {
            if (param.startsWith('[') && param.endsWith(']')) {
                try { uris = JSON.parse(param); } catch { uris = [param]; }
            } else if (param.includes(',')) {
                uris = param.split(',').filter(Boolean);
            } else {
                uris = [param];
            }
        } else if (Array.isArray(param)) {
            uris = param;
        } else {
            uris = [param];
        }
        return uris.map(u => ({ uri: u, meta: null }));
    };

    const [preEvd, setPreEvd] = useState<{ uri: string, meta: any }[]>(parseEvdParam(preEvdParam));
    const [postEvd, setPostEvd] = useState<{ uri: string, meta: any }[]>(parseEvdParam(postEvdParam));

    const [isSaving, setIsSaving] = useState(false);

    const [currentMeta, setCurrentMeta] = useState({ capturedAt: "", latitude: "", longitude: "", accuracy: "", address: "" });

    useEffect(() => {
        (async () => {
            try {
                const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
                const meta = {
                    capturedAt: new Date().toISOString(),
                    latitude: "",
                    longitude: "",
                    accuracy: "",
                    address: ""
                };

                if (locStatus === 'granted') {
                    const location = await Location.getLastKnownPositionAsync();
                    if (location) {
                        meta.latitude = String(location.coords.latitude);
                        meta.longitude = String(location.coords.longitude);
                        meta.accuracy = String(location.coords.accuracy);

                        const addressRes = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
                        if (addressRes && addressRes[0]) {
                            const { streetNumber, street, district, city } = addressRes[0];
                            meta.address = `${streetNumber ? streetNumber + " " : ""}${street || ""}, ${district || ""}, ${city || ""}`;
                        }
                    }
                }
                setCurrentMeta(meta);
            } catch (err) {
                console.warn("Location caching error:", err);
            }
        })();
    }, []);

    // Image Viewer Control
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerImages, setViewerImages] = useState<{ uri: string }[]>([]);

    const handleViewImage = (uri: string) => {
        setViewerImages([{ uri }]);
        setViewerVisible(true);
    };

    const takePhoto = async (type: "preEvd" | "postEvd") => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            toast.error("Lỗi", { description: "Cần quyền truy cập máy ảnh để chụp ảnh." });
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            cameraType: ImagePicker.CameraType.back,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const asset = result.assets[0];
            const meta = { ...currentMeta, capturedAt: new Date().toISOString() };

            if (type === "preEvd") {
                setPreEvd(prev => [...prev, { uri: asset.uri, meta }]);
            } else {
                setPostEvd(prev => [...prev, { uri: asset.uri, meta }]);
            }
        }
    };

    const removeImage = (type: "preEvd" | "postEvd", index: number) => {
        if (type === "preEvd") {
            setPreEvd(prev => prev.filter((_, i) => i !== index));
        } else {
            setPostEvd(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        if (!itemId || !id) return;
        setIsSaving(true);

        try {
            const uploadList = async (items: { uri: string, meta: any }[]) => {
                const localItems = items.filter(
                    (i) => i.uri.startsWith("file://") || i.uri.startsWith("content://")
                );
                const remoteUris = items
                    .filter((i) => !i.uri.startsWith("file://") && !i.uri.startsWith("content://"))
                    .map((i) => i.uri);

                if (localItems.length > 0) {
                    const urisToUpload = localItems.map((i) => i.uri);
                    const baseMeta = localItems[0].meta || {}; // Use first location as reference
                    const uploadRes = await uploadWatermarkedImages(urisToUpload, baseMeta);
                    if (uploadRes?.urls) {
                        return [...remoteUris, ...uploadRes.urls];
                    }
                }
                return [...remoteUris];
            };

            const finalPreEvdUris = await uploadList(preEvd);
            const finalPostEvdUris = await uploadList(postEvd);

            const payload: any = {
                postQty: Number(postQty),
                preEvd: finalPreEvdUris,
                postEvd: finalPostEvdUris,
            };

            await dispatch(updateTaskItemByPicker({
                taskId: id as string,
                itemId: itemId as string,
                data: payload,
            })).unwrap();

            toast.success("Thành công", { description: "Đã lưu cập nhật sản phẩm.", duration: 2000 });
            taskSignal.shouldRefresh = true;
            router.back();

        } catch (error: any) {
            toast.error("Lỗi", { description: error?.message || "Lỗi lưu cập nhật.", duration: 2000 });
        } finally {
            setIsSaving(false);
        }
    };

    if (!canView) return null;

    const renderImageList = (type: "preEvd" | "postEvd", items: { uri: string, meta: any }[]) => {
        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                {items.map((item, idx) => (
                    <View key={idx} className="h-40 w-40 rounded-2xl bg-gray-100 overflow-hidden mr-3">
                        <TouchableOpacity onPress={() => handleViewImage(item.uri)} className="w-full h-full" activeOpacity={0.9}>
                            <Image source={{ uri: item.uri }} className="w-full h-full" resizeMode="cover" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => removeImage(type, idx)}
                            className="absolute top-1 right-1 bg-red-500 p-1.5 rounded-full"
                        >
                            <X color="white" size={20} />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity
                    onPress={() => takePhoto(type)}
                    disabled={isSaving}
                    className="h-40 w-40 rounded-2xl bg-gray-50 items-center justify-center border border-dashed border-gray-300"
                >
                    <Camera color="#6b7280" size={28} />
                    <Text className="text-gray-500 font-medium mt-1 text-xs">Chụp ảnh</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    };

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
                    <Text className="text-base font-bold text-gray-900 mb-4 mt-2">Ảnh minh chứng</Text>

                    {/* Pre Evd */}
                    <View className="mb-6">
                        <Text className="text-sm text-gray-500 font-medium mb-2">Trước khi soạn</Text>
                        {renderImageList("preEvd", preEvd)}
                    </View>

                    {/* Post Evd */}
                    <View className="mb-6">
                        <Text className="text-sm text-gray-500 font-medium mb-2">Sau khi soạn</Text>
                        {renderImageList("postEvd", postEvd)}
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

            <ImageViewing
                images={viewerImages}
                imageIndex={0}
                visible={viewerVisible}
                onRequestClose={() => setViewerVisible(false)}
            />
        </SafeAreaView>
    );
}
