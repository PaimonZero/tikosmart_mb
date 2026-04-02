import * as TaskManager from 'expo-task-manager';
import { emitShipperLocation } from './socketManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TRACKING';

const RUN_ID_KEY = 'tikosmart_active_run_id';
const VEHICLE_TYPE_KEY = 'tikosmart_active_vehicle_type';

/**
 * Task definition for background location tracking
 */
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error('[LocationTask] Background task error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    if (locations && locations.length > 0) {
      const location = locations[0];
      const { latitude, longitude } = location.coords;

      try {
        // Read the current run ID and vehicle type from AsyncStorage
        const runId = await AsyncStorage.getItem(RUN_ID_KEY);
        const vehicle_type = await AsyncStorage.getItem(VEHICLE_TYPE_KEY);
        
        if (runId) {
          // Emit location via global socket
          emitShipperLocation({
            runId,
            lat: latitude,
            lng: longitude,
            // @ts-ignore - we'll handle vehicle_type in the backend or on receiver side
            vehicle_type: vehicle_type || undefined,
            timestamp: new Date().toISOString()
          });
          
          // console.log(`[LocationTask] Emitted background update for run ${runId}: ${latitude}, ${longitude}`);
        }
      } catch (err) {
        console.error('[LocationTask] Failed to get runId or emit location:', err);
      }
    }
  }
});
