import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { Truck } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

interface DeliveryRunMapProps {
    run: any;
}

interface EdgeIndicatorState {
    visible: boolean;
    x: number;
    y: number;
    distanceMeters: number;
}

const EARTH_RADIUS_METERS = 6371000;

const toRadians = (deg: number) => (deg * Math.PI) / 180;

const haversineDistanceMeters = (
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
) => {
    const dLat = toRadians(to.latitude - from.latitude);
    const dLng = toRadians(to.longitude - from.longitude);
    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_METERS * c;
};

const formatDistanceLabel = (meters: number) => {
    if (!Number.isFinite(meters) || meters <= 0) return '--';
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
};

// Removed MapMarkerCustom as custom views in react-native-maps Markers can cause blinking and performance issues on some devices.
// Re-added with tracksViewChanges hack.

// Memoized Custom Marker View
const MapMarkerCustom = React.memo(({ type, index, status }: { type: string, index?: number, status?: string }) => {
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
MapMarkerCustom.displayName = 'MapMarkerCustom';

// Wrapper to prevent Android flickering by disabling view tracking after initial render
const CustomMarkerWrapper = React.memo(function CustomMarkerWrapper({ marker }: { marker: any }) {
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
                status={marker.status}
            />
        </Marker>
    );
});

const ShipperMarker = React.memo(function ShipperMarker({ coordinate, vehicleType }: { coordinate: { latitude: number, longitude: number }, vehicleType?: string }) {
    const [tracksViewChanges, setTracksViewChanges] = React.useState(true);

    React.useEffect(() => {
        setTracksViewChanges(true);
        const timer = setTimeout(() => setTracksViewChanges(false), 200);
        return () => clearTimeout(timer);
    }, [coordinate.latitude, coordinate.longitude, vehicleType]);

    return (
        <Marker
            coordinate={coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={2000}
            tracksViewChanges={tracksViewChanges}
            title="Vị trí của bạn"
        >
            <View className="items-center justify-center">
                <View
                    style={{
                        backgroundColor: '#3B82F6',
                        width: 38,
                        height: 38,
                        borderRadius: 19,
                        borderWidth: 3,
                        borderColor: 'white',
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4,
                        shadowRadius: 5,
                        elevation: 10,
                    }}
                    className="items-center justify-center"
                >
                    <Truck size={22} color="white" />
                </View>
                <View
                    style={{
                        width: 0,
                        height: 0,
                        backgroundColor: "transparent",
                        borderStyle: "solid",
                        borderLeftWidth: 6,
                        borderRightWidth: 6,
                        borderBottomWidth: 10,
                        borderLeftColor: "transparent",
                        borderRightColor: "transparent",
                        borderBottomColor: "#3B82F6",
                        transform: [{ rotate: "180deg" }],
                        marginTop: -2
                    }}
                />
            </View>
        </Marker>
    );
});

export default function DeliveryRunMap({ run }: DeliveryRunMapProps) {
    const mapRef = useRef<MapView>(null);
    const lastAutoFitSignatureRef = useRef<string>('');
    const shipperLocation = useSelector((state: RootState) => state.deliveryRuns.shipperLocation);
    const insets = useSafeAreaInsets();
    const { height, width } = useWindowDimensions();
    const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
    const [edgeIndicator, setEdgeIndicator] = useState<EdgeIndicatorState>({
        visible: false,
        x: 0,
        y: 0,
        distanceMeters: 0,
    });

    const mapPadding = useMemo(() => ({
        top: insets.top + 80, // Header space
        right: 16,
        bottom: height * 0.2 + insets.bottom + 20, // Bottom sheet 20% snap point
        left: 16
    }), [insets.top, insets.bottom, height]);

    const handleCenterLocation = () => {
        if (shipperLocation && shipperLocation.lat && shipperLocation.lng && shipperLocation.lat !== 0 && shipperLocation.lng !== 0) {
            mapRef.current?.animateToRegion({
                latitude: parseFloat(shipperLocation.lat as any),
                longitude: parseFloat(shipperLocation.lng as any),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);
        } else {
            // Fallback to user device's location if shipper position isn't available yet or tracking is not initialized
            // Note: This relies on native my-location if bounds are known, but React Native Maps requires position logic
            // Since we have user tracking, shipperLocation should mostly be valid.
        }
    };

    const updateTruckEdgeIndicator = useCallback(async () => {
        if (!mapRef.current) return;

        const isActiveRun = run.status === 'in_progress' || run.status === 'assigned';
        if (!isActiveRun || !shipperLocation || !shipperLocation.lat || !shipperLocation.lng) {
            setEdgeIndicator(prev => (prev.visible ? { ...prev, visible: false } : prev));
            return;
        }

        const lat = parseFloat(shipperLocation.lat as any);
        const lng = parseFloat(shipperLocation.lng as any);
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) {
            setEdgeIndicator(prev => (prev.visible ? { ...prev, visible: false } : prev));
            return;
        }

        try {
            const point = await mapRef.current.pointForCoordinate({ latitude: lat, longitude: lng });

            const safeLeft = 16;
            const safeRight = width - 16;
            const safeTop = insets.top + 92;
            const safeBottom = height - mapPadding.bottom - 16;

            const outside =
                point.x < safeLeft ||
                point.x > safeRight ||
                point.y < safeTop ||
                point.y > safeBottom;

            if (!outside) {
                setEdgeIndicator(prev => (prev.visible ? { ...prev, visible: false } : prev));
                return;
            }

            const clampedX = Math.min(Math.max(point.x, safeLeft), safeRight);
            const clampedY = Math.min(Math.max(point.y, safeTop), safeBottom);
            const distanceMeters = currentRegion
                ? haversineDistanceMeters(
                    { latitude: currentRegion.latitude, longitude: currentRegion.longitude },
                    { latitude: lat, longitude: lng }
                )
                : 0;

            setEdgeIndicator({
                visible: true,
                x: clampedX,
                y: clampedY,
                distanceMeters,
            });
        } catch {
            // Ignore temporary conversion errors while map is mounting/animating.
        }
    }, [run.status, shipperLocation, width, insets.top, height, mapPadding.bottom, currentRegion]);

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
                    const parsedPoints = coords.map((coord: [number, number]) => ({
                        latitude: coord[1],
                        longitude: coord[0],
                    }));
                    return parsedPoints;
                }
            } catch (e) {
                console.error('[DeliveryRunMap] Failed to parse route geometry:', e);
            }
        }


        // Fallback: Create straight lines between points if routeGeometry is missing/invalid
        const points = [];

        // 1. Start from defined start position
        if (run.startLat && run.startLng) {
            points.push({ latitude: parseFloat(run.startLat), longitude: parseFloat(run.startLng) });
        }

        // 2. MUST include Warehouse if it's different from start position
        const warehouseLat = run.warehouseLat || run.warehouse?.[0]?.lat;
        const warehouseLng = run.warehouseLng || run.warehouse?.[0]?.lng;
        if (warehouseLat && warehouseLng) {
            const wLat = parseFloat(warehouseLat);
            const wLng = parseFloat(warehouseLng);

            // Only add if not too close to start point to avoid redundant points (compare both lat and lng)
            const isDifferentPoint = points.length === 0 ||
                Math.abs(points[0].latitude - wLat) > 0.0001 ||
                Math.abs(points[0].longitude - wLng) > 0.0001;

            if (isDifferentPoint) {
                points.push({ latitude: wLat, longitude: wLng });
            }
        }

        // 3. Add orders in sequence
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
    }, [run.routeGeometry, run.orders, run.startLat, run.startLng, run.warehouseLat, run.warehouseLng, run.warehouse]);

    // 1.5. Guide line from Shipper to the start of the official route
    const leaderLineCoords = useMemo(() => {
        if (!shipperLocation || run.status === 'completed' || routeCoordinates.length === 0) return null;

        const firstPoint = routeCoordinates[0];
        const shipperLat = parseFloat(shipperLocation.lat as any);
        const shipperLng = parseFloat(shipperLocation.lng as any);

        // Calculate distance crude improvement: 
        // If leader line is > 10km, it's likely a data mismatch or they are WAY off course.
        // Don't show it to avoid "cross-sea" artifacts.
        const latDiff = Math.abs(shipperLat - firstPoint.latitude);
        const lngDiff = Math.abs(shipperLng - firstPoint.longitude);
        if (latDiff > 0.1 || lngDiff > 0.1) return null; // approx > 10km

        return [
            { latitude: shipperLat, longitude: shipperLng },
            firstPoint
        ];
    }, [shipperLocation, run.status, routeCoordinates]);

    // 2. Prepare markers
    const markers = useMemo(() => {
        const list: any[] = [];

        // Origin (Warehouse) - Use warehouse coordinates from department
        const warehouseLat = run.warehouseLat || run.startLat;
        const warehouseLng = run.warehouseLng || run.startLng;

        if (warehouseLat && warehouseLng) {
            list.push({
                id: 'origin',
                coordinate: {
                    latitude: parseFloat(warehouseLat),
                    longitude: parseFloat(warehouseLng),
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
        if (!mapRef.current || routeCoordinates.length === 0) return;

        // Only auto-fit when route topology changes; do not re-fit on live shipper location updates.
        const signature = JSON.stringify(routeCoordinates);
        if (signature === lastAutoFitSignatureRef.current) return;
        lastAutoFitSignatureRef.current = signature;

        const timeoutId = setTimeout(() => {
            mapRef.current?.fitToCoordinates(routeCoordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [routeCoordinates]);

    useEffect(() => {
        void updateTruckEdgeIndicator();
    }, [updateTruckEdgeIndicator]);

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
                mapPadding={mapPadding}
                onRegionChangeComplete={(region) => {
                    setCurrentRegion(region);
                    void updateTruckEdgeIndicator();
                }}
                // showsUserLocation={true}
                // showsMyLocationButton={true}
                showsCompass={true}
                toolbarEnabled={false}
            >
                {/* Leader Line (Shipper to Route Start) */}
                {leaderLineCoords && (
                    <Polyline
                        coordinates={leaderLineCoords}
                        strokeColor="#3B82F6"
                        strokeWidth={2}
                        lineDashPattern={[2, 5]}
                    />
                )}

                {/* Route Polyline (Warehouse to Orders) */}
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

                {/* Shipper Marker — visible for active runs with valid coords */}
                {shipperLocation && (run.status === 'in_progress' || run.status === 'assigned') &&
                    shipperLocation.lat !== 0 && shipperLocation.lng !== 0 && (
                        <ShipperMarker
                            coordinate={{
                                latitude: parseFloat(shipperLocation.lat as any),
                                longitude: parseFloat(shipperLocation.lng as any)
                            }}
                            vehicleType={shipperLocation.vehicle_type}
                        />
                    )}
            </MapView>

            {edgeIndicator.visible && (
                <View
                    pointerEvents="box-none"
                    className="absolute"
                    style={{
                        left: edgeIndicator.x - (edgeIndicator.x > width - 120 ? 126 : 18),
                        top: edgeIndicator.y - 18,
                        flexDirection: edgeIndicator.x > width - 120 ? 'row-reverse' : 'row',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        className="items-center justify-center"
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#1D4ED8',
                            borderWidth: 2,
                            borderColor: 'white',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 8,
                        }}
                        onPress={handleCenterLocation}
                        activeOpacity={0.85}
                    >
                        <Truck size={18} color="white" />
                    </TouchableOpacity>

                    <View
                        className="bg-white rounded-full border border-slate-200"
                        style={{
                            marginHorizontal: 6,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 3,
                            elevation: 3,
                        }}
                    >
                        <Text className="text-[11px] font-bold text-slate-700">
                            {formatDistanceLabel(edgeIndicator.distanceMeters)}
                        </Text>
                    </View>
                </View>
            )}

            <TouchableOpacity
                className="absolute bg-white rounded-full items-center justify-center border border-slate-200"
                style={{
                    width: 45,
                    height: 45,
                    right: 12,
                    bottom: mapPadding.bottom, // Use computed padding to stay exactly above the bottom sheet
                }}
                onPress={handleCenterLocation}
            >
                <Ionicons name="locate" size={25} color="black" />
            </TouchableOpacity>
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
