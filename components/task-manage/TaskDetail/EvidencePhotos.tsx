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
        <View>
            <Text className="text-sm text-gray-500 mb-2 font-semibold">{label}</Text>
            {uri ? (
                <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                    <View>
                        <Image source={{ uri }} className="h-80 w-full rounded-lg bg-gray-100" resizeMode="cover" />
                        <View className="absolute bottom-2 right-2 bg-black/40 rounded-full p-1.5">
                            <Maximize2 color="white" size={16} />
                        </View>
                    </View>
                </TouchableOpacity>
            ) : (
                <View className="h-80 w-full rounded-lg bg-gray-100 items-center justify-center border border-dashed border-gray-300">
                    <Camera color="#9ca3af" size={28} />
                    <Text className="text-xs text-gray-400 mt-2">Chưa có ảnh</Text>
                </View>
            )}
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
            <PhotoSlot
                label="Ảnh trước lấy:"
                uri={preEvd}
                onPress={preEvd ? () => openViewer(preEvd) : undefined}
            />
            <View className="mt-4">
                <PhotoSlot
                    label="Ảnh sau lấy:"
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
