import { useEffect, useRef, useCallback } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { updateShipperLocation } from "@/store/deliveryRunsSlice";
import { emitShipperLocation, socket } from "@/utils/socketManager";
import { LOCATION_TASK_NAME } from "@/utils/locationTask";
import {
  setActiveRunId,
  setActiveVehicleType,
} from "@/utils/trackingPersistence";
import { getListDeliveryRuns } from "@/services/deliveryRunsService";

// --- TRACKING CONFIGURATION (consistent with useWebLocationTracking.js) ---
const TRACKING_DISTANCE_INTERVAL = 30; // Ngưỡng khoảng cách tiêu chuẩn (meters)
const TRACKING_DEFERRED_UPDATES_INTERVAL = 60 * 2 * 1000; // Thời gian trễ tối thiểu — 2 phút
const TRACKING_DEFERRED_UPDATES_DISTANCE = 50; // Ngưỡng nhảy vọt (meters) — bỏ qua giới hạn thời gian
const FOREGROUND_RAW_DISTANCE = 10; // OS-level raw feed interval (meters)
// --------------------------------------------------------------------------

/**
 * Haversine: Tính khoảng cách (mét) giữa 2 tọa độ GPS.
 */
function getDistanceInMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  if (!lat1 || !lng1 || !lat2 || !lng2) return 0;
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Global tracking hook — mounted at root layout level.
 *
 * Automatically starts GPS tracking when a shipper has an active (in_progress)
 * delivery run, WITHOUT requiring the detail screen to be open.
 *
 * Architecture:
 * - On login (shipper/sup_shipper): fetch active run via API
 * - If found: start background task + foreground watcher with 3-scenario throttle
 * - Re-checks when: socket `delivery_runs_updated`, AppState returns to foreground
 * - Stops when: no active run, user logs out, or role is not shipper
 */
const useGlobalTracking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => (state.auth as any).user);
  const isAuthenticated = useSelector(
    (state: RootState) => (state.auth as any).isAuthenticated,
  );
  const hasFetchedProfile = useSelector(
    (state: RootState) => (state.auth as any).hasFetchedProfile,
  );

  // Tracking state refs (avoid re-renders)
  const foregroundSubRef = useRef<Location.LocationSubscription | null>(null);
  const activeRunIdRef = useRef<string | null>(null);
  const activeVehicleRef = useRef<string | undefined>(undefined);
  const lastEmitRef = useRef<{
    time: number;
    lat: number | null;
    lng: number | null;
  }>({
    time: 0,
    lat: null,
    lng: null,
  });
  const isCheckingRef = useRef(false);

  const isShipper = user?.role === "shipper" || user?.role === "sup_shipper";
  const isReady = isAuthenticated && hasFetchedProfile && isShipper;

  // ── Stop all tracking ──
  const stopAllTracking = useCallback(async () => {
    try {
      // 1. Stop foreground watcher
      if (foregroundSubRef.current) {
        foregroundSubRef.current.remove();
        foregroundSubRef.current = null;
      }

      // 2. Stop background task
      const hasTask =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (hasTask) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      // 3. Clear persistence
      await setActiveRunId(null);
      await setActiveVehicleType(null);

      // 4. Reset refs
      activeRunIdRef.current = null;
      activeVehicleRef.current = undefined;
      lastEmitRef.current = { time: 0, lat: null, lng: null };
    } catch (err: any) {
      if (!err.message?.includes("Task not found")) {
        console.error("[GlobalTracking] Stop error:", err);
      }
    }
  }, []);

  // ── Start tracking for a specific run ──
  const startTrackingForRun = useCallback(
    async (runId: string, vehicleType?: string) => {
      try {
        // Check GPS services
        const isServiceEnabled = await Location.hasServicesEnabledAsync();
        if (!isServiceEnabled) {
          console.warn("[GlobalTracking] GPS disabled, skipping auto-track");
          return;
        }

        // Request permissions (non-blocking — don't throw if denied)
        const { status: fgStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (fgStatus !== "granted") {
          console.warn("[GlobalTracking] Foreground permission denied");
          return;
        }

        await Location.requestBackgroundPermissionsAsync();

        // Store metadata for background task
        await setActiveRunId(runId);
        if (vehicleType) await setActiveVehicleType(vehicleType);
        activeRunIdRef.current = runId;
        activeVehicleRef.current = vehicleType;
        lastEmitRef.current = { time: 0, lat: null, lng: null };

        // ── Background Task (app killed/minimized — socket emit only) ──
        const isTaskRunning =
          await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (isTaskRunning)
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: TRACKING_DISTANCE_INTERVAL,
          deferredUpdatesInterval: TRACKING_DEFERRED_UPDATES_INTERVAL,
          deferredUpdatesDistance: TRACKING_DEFERRED_UPDATES_DISTANCE,
          foregroundService: {
            notificationTitle: "Đang theo dõi vị trí giao hàng",
            notificationBody: "Tikosmart đang cập nhật vị trí của bạn.",
            notificationColor: "#3B82F6",
          },
          pausesUpdatesAutomatically: true,
        });

        // ── Foreground Watcher (instant local Redux + socket emit) ──
        if (foregroundSubRef.current) {
          foregroundSubRef.current.remove();
          foregroundSubRef.current = null;
        }

        foregroundSubRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: FOREGROUND_RAW_DISTANCE,
          },
          (location) => {
            const { latitude, longitude } = location.coords;
            const now = Date.now();

            const last = lastEmitRef.current;
            const timeElapsed = now - last.time;
            const dist = getDistanceInMeters(
              last.lat ?? 0,
              last.lng ?? 0,
              latitude,
              longitude,
            );

            // Smart Throttle (3 scenarios — consistent with Web)
            const isFirst = !last.time;
            const shouldEmit =
              isFirst ||
              (timeElapsed >= TRACKING_DEFERRED_UPDATES_INTERVAL &&
                dist >= TRACKING_DISTANCE_INTERVAL) ||
              dist >= TRACKING_DEFERRED_UPDATES_DISTANCE;

            if (shouldEmit) {
              const data = {
                runId: activeRunIdRef.current,
                lat: latitude,
                lng: longitude,
                vehicle_type: activeVehicleRef.current,
                timestamp: new Date().toISOString(),
              };

              // Local Redux update (Shipper's own truck marker)
              dispatch(updateShipperLocation(data));
              // Server update (Admin and other viewers)
              emitShipperLocation(data as any);

              lastEmitRef.current = {
                time: now,
                lat: latitude,
                lng: longitude,
              };
            }
          },
        );

        // ── Initial Force Update ──
        try {
          const pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const data = {
            runId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            vehicle_type: vehicleType,
            timestamp: new Date().toISOString(),
          };
          dispatch(updateShipperLocation(data));
          emitShipperLocation(data);
          lastEmitRef.current = {
            time: Date.now(),
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
        } catch (posErr) {
          console.warn("[GlobalTracking] Initial position failed:", posErr);
        }

        console.log(
          `[GlobalTracking] ✅ Auto-started tracking for run ${runId}`,
        );
      } catch (err: any) {
        console.error("[GlobalTracking] Start error:", err.message);
      }
    },
    [dispatch],
  );

  // ── Check API for active run & sync tracking state ──
  const checkAndSync = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      if (!isReady || !user?.id) {
        if (activeRunIdRef.current) await stopAllTracking();
        return;
      }

      const response = await getListDeliveryRuns({
        shipperId: user.id,
        status: "in_progress",
        limit: 1,
        offset: 0,
      });

      const runs = response.data?.data || [];

      if (runs.length > 0) {
        const run = runs[0];
        // Only restart if the run changed (avoid redundant restarts)
        if (activeRunIdRef.current !== String(run.id)) {
          await stopAllTracking();
          await startTrackingForRun(
            String(run.id),
            run.vehicle_type || run.vehicleType,
          );
        }
      } else {
        // No active run → stop tracking
        if (activeRunIdRef.current) {
          console.log(
            "[GlobalTracking] No active run found, stopping tracking",
          );
          await stopAllTracking();
        }
      }
    } catch (err) {
      console.warn("[GlobalTracking] Check failed:", err);
    } finally {
      isCheckingRef.current = false;
    }
  }, [isReady, user?.id, stopAllTracking, startTrackingForRun]);

  // ── Main Effect: mount/unmount lifecycle ──
  useEffect(() => {
    if (!isReady) {
      stopAllTracking();
      return;
    }

    // Initial check on mount
    checkAndSync();

    // Re-check when delivery run status changes (start/complete/cancel)
    const handleRunUpdated = () => {
      checkAndSync();
    };
    socket.on("delivery_runs_updated", handleRunUpdated);

    // Re-check when app returns to foreground
    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkAndSync();
      }
    });

    return () => {
      socket.off("delivery_runs_updated", handleRunUpdated);
      appStateSub.remove();
    };
  }, [isReady, checkAndSync, stopAllTracking]);

  // Ensure cleanup on final unmount (logout, app close)
  useEffect(() => {
    return () => {
      stopAllTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useGlobalTracking;
