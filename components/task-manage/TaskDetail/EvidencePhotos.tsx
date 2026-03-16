import { Camera, Maximize2 } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ImageViewing from "react-native-image-viewing";

interface EvidencePhotosProps {
    preEvd?: string;
    postEvd?: string;
}

function PhotoSlot({ label, uri, onPress }: { label: string; uri?: string; onPress?: () => void }) {
    return (
        <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-2 font-medium text-center">{label}</Text>
            <View className="h-40 w-full rounded-2xl bg-gray-50 items-center justify-center border border-dashed border-gray-200 overflow-hidden">
                {uri ? (
                    <TouchableOpacity onPress={onPress} activeOpacity={0.9} className="w-full h-full">
                        <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                        <View className="absolute bottom-2 right-2 bg-black/40 rounded-full p-1.5">
                            <Maximize2 color="white" size={16} />
                        </View>
                    </TouchableOpacity>
                ) : (
                    <>
                        <Camera color="#9ca3af" size={28} />
                        <Text className="text-xs text-gray-400 mt-2 font-medium">Chưa có ảnh</Text>
                    </>
                )}
            </View>
        </View>
    );
}

export default function EvidencePhotos({ preEvd, postEvd }: EvidencePhotosProps) {
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    // Build the image array only from those that exist
    const images = [
        preEvd ? { uri: preEvd } : null,
        postEvd ? { uri: postEvd } : null,
    ].filter(Boolean) as { uri: string }[];

    const openViewer = (uri: string) => {
        const idx = images.findIndex((img) => img.uri === uri);
        setViewerIndex(idx >= 0 ? idx : 0);
        setViewerVisible(true);
    };

    return (
        <View className="mb-4">
            <View className="flex-row gap-2">
                <PhotoSlot
                    label="Trước khi soạn"
                    uri={preEvd}
                    onPress={preEvd ? () => openViewer(preEvd) : undefined}
                />
                <PhotoSlot
                    label="Sau khi soạn"
                    uri={postEvd}
                    onPress={postEvd ? () => openViewer(postEvd) : undefined}
                />
            </View>

            <ImageViewing
                images={images}
                imageIndex={viewerIndex}
                visible={viewerVisible}
                onRequestClose={() => setViewerVisible(false)}
                swipeToCloseEnabled
                doubleTapToZoomEnabled
            />
        </View>
    );
}
