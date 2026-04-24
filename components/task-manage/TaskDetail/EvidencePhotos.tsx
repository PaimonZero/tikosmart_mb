import { Camera, Maximize2 } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ImageViewing from "react-native-image-viewing";



function PhotoSlot({ label, uris = [], onImagePress }: { label: string; uris?: string[]; onImagePress?: (index: number) => void }) {
    const hasImages = uris && uris.length > 0;

    const renderCollage = () => {
        if (!uris || uris.length === 0) return null;

        if (uris.length === 1) {
            return (
                <TouchableOpacity onPress={() => onImagePress?.(0)} activeOpacity={0.9} className="w-full h-full">
                    <Image source={{ uri: uris[0] }} className="w-full h-full" resizeMode="cover" />
                    <View className="absolute bottom-2 right-2 bg-black/40 rounded-full p-1.5">
                        <Maximize2 color="white" size={16} />
                    </View>
                </TouchableOpacity>
            );
        }

        if (uris.length === 2) {
            return (
                <View className="flex-row w-full h-full">
                    <TouchableOpacity onPress={() => onImagePress?.(0)} className="flex-1 border-r border-white">
                        <Image source={{ uri: uris[0] }} className="w-full h-full" resizeMode="cover" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onImagePress?.(1)} className="flex-1">
                        <Image source={{ uri: uris[1] }} className="w-full h-full" resizeMode="cover" />
                    </TouchableOpacity>
                </View>
            );
        }

        if (uris.length === 3) {
            return (
                <View className="flex-row w-full h-full">
                    <TouchableOpacity onPress={() => onImagePress?.(0)} className="flex-1 border-r border-white">
                        <Image source={{ uri: uris[0] }} className="w-full h-full" resizeMode="cover" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <TouchableOpacity onPress={() => onImagePress?.(1)} className="flex-1 border-b border-white">
                            <Image source={{ uri: uris[1] }} className="w-full h-full" resizeMode="cover" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onImagePress?.(2)} className="flex-1">
                            <Image source={{ uri: uris[2] }} className="w-full h-full" resizeMode="cover" />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return (
            <View className="w-full h-full flex-row flex-wrap">
                {uris.slice(0, 4).map((uri, idx) => {
                    const isLast = idx === 3 && uris.length > 4;
                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => onImagePress?.(idx)}
                            style={{ width: '50%', height: '50%' }}
                            className={`border-white ${idx % 2 === 0 ? 'border-r' : ''} ${idx < 2 ? 'border-b' : ''}`}
                        >
                            <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                            {isLast && (
                                <View className="absolute inset-0 bg-black/60 items-center justify-center">
                                    <Text className="text-white font-black text-lg">+{uris.length - 4}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    return (
        <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-2 font-medium text-center">{label}</Text>
            <View className="h-40 w-full rounded-2xl bg-gray-50 items-center justify-center border border-dashed border-gray-200 overflow-hidden">
                {hasImages ? renderCollage() : (
                    <>
                        <Camera color="#9ca3af" size={28} />
                        <Text className="text-xs text-gray-400 mt-2 font-medium">Chưa có ảnh</Text>
                    </>
                )}
            </View>
        </View>
    );
}

interface EvidencePhotosProps {
    preEvd?: string | string[];
    postEvd?: string | string[];
}

export default function EvidencePhotos({ preEvd, postEvd }: EvidencePhotosProps) {
    const [viewerVisible, setViewerVisible] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);
    const [activeImages, setActiveImages] = useState<{ uri: string }[]>([]);

    const preEvdUris = Array.isArray(preEvd) ? preEvd : typeof preEvd === 'string' ? [preEvd] : [];
    const postEvdUris = Array.isArray(postEvd) ? postEvd : typeof postEvd === 'string' ? [postEvd] : [];

    const openViewer = (group: 'pre' | 'post', index: number) => {
        const uris = group === 'pre' ? preEvdUris : postEvdUris;
        setActiveImages(uris.map((u) => ({ uri: u })));
        setViewerIndex(index);
        setViewerVisible(true);
    };

    return (
        <View className="mb-4">
            <View className="flex-row gap-2">
                <PhotoSlot
                    label="Trước khi soạn"
                    uris={preEvdUris}
                    onImagePress={(idx) => openViewer('pre', idx)}
                />
                <PhotoSlot
                    label="Sau khi soạn"
                    uris={postEvdUris}
                    onImagePress={(idx) => openViewer('post', idx)}
                />
            </View>

            <ImageViewing
                images={activeImages}
                imageIndex={viewerIndex}
                visible={viewerVisible}
                onRequestClose={() => setViewerVisible(false)}
                swipeToCloseEnabled
                doubleTapToZoomEnabled
            />
        </View>
    );
}
