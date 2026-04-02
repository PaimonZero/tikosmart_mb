import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useCallback, useEffect } from 'react';
import { LOCATION_TASK_NAME } from '../utils/locationTask';
import { useDispatch } from 'react-redux';
import { updateShipperLocation } from '../store/deliveryRunsSlice';
import { emitShipperLocation } from '../utils/socketManager';
import { setActiveRunId, setActiveVehicleType } from '../utils/trackingPersistence';
import { AppDispatch } from '../store/store';

/**
 * Hook to manage location tracking for a delivery run
 */
export const useLocationTracking = (runId: string | number | null, vehicle_type?: string) => {
  
  const dispatch = useDispatch<AppDispatch>();
  
  const startTracking = useCallback(async () => {
    if (!runId) return;

    try {
      // 1. Request Foreground Permissions
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== 'granted') {
        console.warn('[Tracking] Foreground location permission denied');
        return;
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

      // 4. Start Background Tracking (Actually handles both foreground and background)
      const isTaskRunning = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (isTaskRunning) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 15, // 15 meters
        deferredUpdatesInterval: 60 * 1000, // 1 minute
        deferredUpdatesDistance: 50, // 50 meters
        foregroundService: {
          notificationTitle: 'Đang theo dõi vị trí giao hàng',
          notificationBody: 'Tikosmart đang cập nhật vị trí của bạn để đảm bảo lộ trình chính xác.',
          notificationColor: '#3B82F6',
        },
        pausesUpdatesAutomatically: true,
      });

      // 5. Initial Force Update
      const currentPos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const locationData = {
        runId,
        lat: currentPos.coords.latitude,
        lng: currentPos.coords.longitude,
        // @ts-ignore
        vehicle_type: vehicle_type,
        timestamp: new Date().toISOString()
      };

      emitShipperLocation(locationData);
      dispatch(updateShipperLocation(locationData));

      // console.log('[Tracking] Location tracking started for run:', runId);
    } catch (err) {
      console.error('[Tracking] Error starting location tracking:', err);
    }
  }, [runId, vehicle_type]);

  const stopTracking = useCallback(async () => {
    try {
      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (isTaskRegistered) {
        // Double check with Location module
        const hasLocationUpdates = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (hasLocationUpdates) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }
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
      const currentPos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const locationData = {
        runId,
        lat: currentPos.coords.latitude,
        lng: currentPos.coords.longitude,
        // @ts-ignore
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
