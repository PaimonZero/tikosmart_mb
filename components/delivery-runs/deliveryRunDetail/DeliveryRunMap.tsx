import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

interface DeliveryRunMapProps {
    run: any;
}

// Removed MapMarkerCustom as custom views in react-native-maps Markers can cause blinking and performance issues on some devices.
// Re-added with tracksViewChanges hack.

// Memoized Custom Marker View
const MapMarkerCustom = React.memo(({ type, index, title, status }: { type: string, index?: number, title: string, status?: string }) => {
    const isOrigin = type === 'origin';

    // Status-based colors
    let bgColor = '#3B82F6'; // Default Blue
    if (isOrigin) {
        bgColor = '#2563EB'; // Deeper Blue for warehouse
    } else {
        if (status === 'completed') bgColor = '#10B981'; // Green
        if (status === 'cancelled') bgColor = '#EF4444'; // Red
        if (status === 'in_progress') bgColor = '#F59E0B'; // Orange/Amber
    }

    return (
        <View className="items-center">
            <View
                style={{
                    backgroundColor: bgColor,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                }}
                className={`rounded-full border-2 border-white items-center justify-center ${isOrigin ? 'w-10 h-10' : 'w-8 h-8'}`}
            >
                {isOrigin ? (
                    <Ionicons name="business" size={20} color="white" />
                ) : (
                    <Text className="text-white font-black text-xs">{index}</Text>
                )}
            </View>
        </View>
    );
});

// Wrapper to prevent Android flickering by disabling view tracking after initial render
const CustomMarkerWrapper = React.memo(({ marker }: { marker: any }) => {
    const [tracksViewChanges, setTracksViewChanges] = React.useState(true);

    // If marker status updates (e.g., from pending to completed), we need to re-enable tracking temporarily so the map updates the image
    React.useEffect(() => {
        setTracksViewChanges(true); // Ensure it's tracking because props changed
        const timer = setTimeout(() => {
            setTracksViewChanges(false); // Stop tracking after it renders
        }, 500); // 500ms is usually safe to guarantee the native render has happened
        return () => clearTimeout(timer);
    }, [marker.status, marker.index, marker.type]);

    return (
        <Marker
            coordinate={marker.coordinate}
            title={marker.title}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={tracksViewChanges}
            description={marker.type !== 'origin' ? `Đơn hàng số ${marker.index}` : undefined}
            style={{ zIndex: marker.type === 'origin' ? 1000 : 1 }} // Keep origin on top
        >
            <MapMarkerCustom
                type={marker.type}
                index={marker.index}
                title={marker.title}
                status={marker.status}
            />
        </Marker>
    );
});

export default function DeliveryRunMap({ run }: DeliveryRunMapProps) {
    const mapRef = useRef<MapView>(null);

    // 1. Parse route coordinates from GeoJSON or fallback to straight lines
    const routeCoordinates = useMemo(() => {
        // First try to parse run.routeGeometry
        if (run.routeGeometry) {
            try {
                const geometry = typeof run.routeGeometry === 'string'
                    ? JSON.parse(run.routeGeometry)
                    : run.routeGeometry;

                let coords = [];
                if (geometry.type === 'LineString' && Array.isArray(geometry.coordinates)) {
                    coords = geometry.coordinates;
                } else if (geometry.routes?.[0]?.geometry?.coordinates) {
                    coords = geometry.routes[0].geometry.coordinates;
                } else if (geometry.coordinates && Array.isArray(geometry.coordinates)) {
                    coords = geometry.coordinates;
                }

                if (coords.length > 0) {
                    return coords.map((coord: [number, number]) => ({
                        latitude: coord[1],
                        longitude: coord[0],
                    }));
                }
            } catch (e) {
                console.error('[DeliveryRunMap] Failed to parse route geometry:', e);
            }
        }

        // Fallback: Create straight lines between points if routeGeometry is missing/invalid
        const points = [];
        if (run.startLat && run.startLng) {
            points.push({ latitude: parseFloat(run.startLat), longitude: parseFloat(run.startLng) });
        }

        const sortedOrders = [...(run.orders || [])].sort((a, b) => (a.routeSeq ?? 0) - (b.routeSeq ?? 0));
        sortedOrders.forEach(order => {
            if (order.customer?.lat && order.customer?.lng) {
                points.push({
                    latitude: parseFloat(order.customer.lat),
                    longitude: parseFloat(order.customer.lng),
                });
            }
        });

        return points;
    }, [run.routeGeometry, run.orders, run.startLat, run.startLng]);

    // 2. Prepare markers
    const markers = useMemo(() => {
        const list: any[] = [];

        // Origin (Warehouse)
        if (run.startLat && run.startLng) {
            list.push({
                id: 'origin',
                coordinate: {
                    latitude: parseFloat(run.startLat),
                    longitude: parseFloat(run.startLng),
                },
                title: 'Kho hàng / Điểm bắt đầu',
                type: 'origin',
                index: 0,
                status: 'warehouse'
            });
        }

        // Orders
        if (run.orders && run.orders.length > 0) {
            run.orders.forEach((order: any, index: number) => {
                if (order.customer?.lat && order.customer?.lng) {
                    list.push({
                        id: order.id,
                        coordinate: {
                            latitude: parseFloat(order.customer.lat),
                            longitude: parseFloat(order.customer.lng),
                        },
                        title: `Điểm ${index + 1}: ${order.customer.name}`,
                        type: 'destination',
                        index: index + 1,
                        status: order.status,
                    });
                }
            });
        }

        return list;
    }, [run]);

    // 3. Auto-fit logic
    useEffect(() => {
        if (mapRef.current && routeCoordinates.length > 0) {
            // Give a small delay to ensure map is ready
            setTimeout(() => {
                mapRef.current?.fitToCoordinates(routeCoordinates, {
                    edgePadding: { top: 120, right: 60, bottom: 250, left: 60 },
                    animated: true,
                });
            }, 500);
        }
    }, [routeCoordinates]);

    if (routeCoordinates.length === 0 && markers.length === 0) {
        return (
            <View className="flex-1 bg-slate-100 items-center justify-center">
                <View className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <Text className="text-slate-400 font-bold uppercase text-[10px]">Bản đồ chưa sẵn sàng</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
            >
                {/* Route Polyline */}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#3B82F6"
                        strokeWidth={4}
                        lineCap="round"
                        lineJoin="round"
                    />
                )}

                {/* Markers */}
                {markers.map((marker) => (
                    <CustomMarkerWrapper key={marker.id} marker={marker} />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
