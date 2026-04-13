import * as Location from 'expo-location';
import { useCallback, useRef } from 'react';
import { LOCATION_TASK_NAME } from '@/utils/locationTask';
import { useDispatch } from 'react-redux';
import { updateShipperLocation } from '../store/deliveryRunsSlice';
import { emitShipperLocation } from '../utils/socketManager';
import { setActiveRunId, setActiveVehicleType } from '../utils/trackingPersistence';
import { AppDispatch } from '../store/store';

// --- TRACKING CONFIGURATION ---
const TRACKING_DISTANCE_INTERVAL = 30; // Ngưỡng khoảng cách tiêu chuẩn (meters)
const TRACKING_DEFERRED_UPDATES_INTERVAL = 60 * 2 * 1000; // Thời gian trễ tối thiểu (ms) — 2 phút
const TRACKING_DEFERRED_UPDATES_DISTANCE = 50; // Ngưỡng nhảy vọt (meters) — bỏ qua giới hạn thời gian
const FOREGROUND_RAW_DISTANCE = 10; // OS-level raw feed interval (meters) — thấp để JS throttle tự quyết
// ------------------------------

/**
 * Haversine: Tính khoảng cách (mét) giữa 2 tọa độ GPS.
 */
function getDistanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lng1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lng2)
  ) {
    return 0;
  }
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Hook to manage location tracking for a delivery run.
 * 
 * Uses a DUAL-PATH architecture:
 * - Path 1 (Foreground Watcher): watchPositionAsync → Smart Throttle → Redux dispatch + socket emit
 * - Path 2 (Background Task):    startLocationUpdatesAsync → socket emit only (app minimized/killed)
 * 
 * Smart Throttle Logic (consistent with Web version):
 * - Scenario 0: First broadcast → send immediately
 * - Scenario A: Slow movement   → send only if distance ≥ 30m AND time ≥ 2 minutes
 * - Scenario B: High-speed jump  → send immediately if distance ≥ 50m (bypass time limit)
 */
export const useLocationTracking = (runId: string | number | null, vehicle_type?: string) => {
  
  const dispatch = useDispatch<AppDispatch>();
  const foregroundSubRef = useRef<Location.LocationSubscription | null>(null);

  // Track last emitted state for smart throttle (mirrors Web's lastStateRef)
  const lastEmitStateRef = useRef<{ time: number; lat: number | null; lng: number | null }>({
    time: 0,
    lat: null,
    lng: null,
  });
  
  const startTracking = useCallback(async () => {
    if (!runId) return;

    // Reset throttle state for fresh tracking session
    lastEmitStateRef.current = { time: 0, lat: null, lng: null };

    try {
      // 0. Check Location Services
      const isServiceEnabled = await Location.hasServicesEnabledAsync();
      if (!isServiceEnabled) {
          console.error('[Tracking] Location services are disabled');
          throw new Error('Dịch vụ vị trí (GPS) đang bị tắt. Vui lòng bật GPS để tiếp tục.');
      }

      // 1. Request Foreground Permissions
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        console.warn('[Tracking] Foreground location permission denied');
        throw new Error('Ứng dụng cần quyền Truy cập Vị trí để hoạt động.');
      }

      // 2. Request Background Permissions (Always Allow)
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== 'granted') {
        console.warn('[Tracking] Background location permission denied. Tracking will only work in foreground.');
      }

      // 3. Store metadata for task
      await setActiveRunId(runId.toString());
      if (vehicle_type) {
        await setActiveVehicleType(vehicle_type);
      }

      // 4. Start Background Tracking (handles app minimized/killed — emits via socket only)
      if (bgStatus === 'granted') {
        const isTaskRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (isTaskRunning) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.High,
          distanceInterval: TRACKING_DISTANCE_INTERVAL,
          deferredUpdatesInterval: TRACKING_DEFERRED_UPDATES_INTERVAL,
          deferredUpdatesDistance: TRACKING_DEFERRED_UPDATES_DISTANCE,
          foregroundService: {
            notificationTitle: 'Đang theo dõi vị trí giao hàng',
            notificationBody: 'Tikosmart đang cập nhật vị trí của bạn để đảm bảo lộ trình chính xác.',
            notificationColor: '#3B82F6',
          },
          pausesUpdatesAutomatically: true,
        });
      }

      // 5. Start Foreground Watcher with Smart Throttle
      //    OS fires raw updates every ~10m, then our JS logic decides whether to emit.
      //    This matches the Web version's 3-scenario throttle for consistent behavior.
      if (foregroundSubRef.current) {
        foregroundSubRef.current.remove();
        foregroundSubRef.current = null;
      }

      foregroundSubRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: FOREGROUND_RAW_DISTANCE, // Low threshold — let JS throttle decide
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const now = Date.now();

          const lastState = lastEmitStateRef.current;
          const timeElapsed = now - lastState.time;
          const distanceMoved = getDistanceInMeters(
            lastState.lat ?? 0,
            lastState.lng ?? 0,
            latitude,
            longitude
          );

          // --- Smart Throttle Logic (consistent with useWebLocationTracking.js) ---
          const isFirstBroadcast = !lastState.time;
          const isTimePassed = timeElapsed >= TRACKING_DEFERRED_UPDATES_INTERVAL;
          const isDistancePassed = distanceMoved >= TRACKING_DISTANCE_INTERVAL;
          const isDistanceLeaped = distanceMoved >= TRACKING_DEFERRED_UPDATES_DISTANCE;

          // Scenario 0: First broadcast → send immediately
          // Scenario A: Slow movement   → distance ≥ 30m AND time ≥ 2 min
          // Scenario B: High-speed jump  → distance ≥ 50m (bypass time limit)
          const shouldEmit =
            isFirstBroadcast ||
            (isTimePassed && isDistancePassed) ||
            isDistanceLeaped;

          if (shouldEmit) {
            const locationData = {
              runId,
              lat: latitude,
              lng: longitude,
              vehicle_type: vehicle_type,
              timestamp: new Date().toISOString()
            };

            // Instant local update (Shipper sees marker move immediately)
            dispatch(updateShipperLocation(locationData));

            // Also notify server so Admin/other viewers see the update
            emitShipperLocation(locationData);

            // Update throttle checkpoint
            lastEmitStateRef.current = { time: now, lat: latitude, lng: longitude };
          }
        }
      );

      // 6. Initial Force Update (Try-catch riêng để không làm chết flow tracking nếu chỉ lỗi lấy tọa độ tức thời)
      try {
        const currentPos = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.High,
        });
        
        const locationData = {
          runId,
          lat: currentPos.coords.latitude,
          lng: currentPos.coords.longitude,
          vehicle_type: vehicle_type,
          timestamp: new Date().toISOString()
        };

        emitShipperLocation(locationData);
        dispatch(updateShipperLocation(locationData));

        // Seed the throttle state so the foreground watcher doesn't double-fire
        lastEmitStateRef.current = {
          time: Date.now(),
          lat: currentPos.coords.latitude,
          lng: currentPos.coords.longitude,
        };
      } catch (posErr) {
        console.warn('[Tracking] Initial position update failed, but background task is registered:', posErr);
      }

      // console.log('[Tracking] Location tracking started for run:', runId);
    } catch (err: any) {
      console.error('[Tracking] Error starting location tracking:', err);
      throw err; // Re-throw để UI component (nếu cần) có thể bắt được và hiển thị popup
    }
  }, [runId, vehicle_type]);

  const stopTracking = useCallback(async () => {
    try {
      // Stop foreground watcher first
      if (foregroundSubRef.current) {
        foregroundSubRef.current.remove();
        foregroundSubRef.current = null;
      }

      const hasLocationUpdates = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (hasLocationUpdates) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
      await setActiveRunId(null);
      await setActiveVehicleType(null);
      // console.log('[Tracking] Location tracking stopped');
    } catch (err: any) {
      // Slient fail for TaskNotFoundException or similar
      if (err.message?.includes('Task not found')) {
        console.warn('[Tracking] Ignore stop tracking error: Task not found');
      } else {
        console.error('[Tracking] Error stopping location tracking:', err);
      }
    }
  }, []);

  const forceUpdate = useCallback(async () => {
    if (!runId) return;
    try {
      const currentPos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const locationData = {
        runId,
        lat: currentPos.coords.latitude,
        lng: currentPos.coords.longitude,
        vehicle_type: vehicle_type,
        timestamp: new Date().toISOString()
      };

      emitShipperLocation(locationData);
      dispatch(updateShipperLocation(locationData));
    } catch (err) {
      console.error('[Tracking] Force update failed:', err);
    }
  }, [runId, vehicle_type]);

  return { startTracking, stopTracking, forceUpdate };
};

