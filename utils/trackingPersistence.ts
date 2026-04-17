import AsyncStorage from '@react-native-async-storage/async-storage';

const RUN_ID_KEY = 'tikosmart_active_run_id';
const VEHICLE_TYPE_KEY = 'tikosmart_active_vehicle_type';

export const setActiveRunId = async (id: string | null) => {
  if (id) {
    await AsyncStorage.setItem(RUN_ID_KEY, id);
  } else {
    await AsyncStorage.removeItem(RUN_ID_KEY);
  }
};

export const getActiveRunId = async () => {
  return await AsyncStorage.getItem(RUN_ID_KEY);
};

export const setActiveVehicleType = async (type: string | null) => {
  if (type) {
    await AsyncStorage.setItem(VEHICLE_TYPE_KEY, type);
  } else {
    await AsyncStorage.removeItem(VEHICLE_TYPE_KEY);
  }
};

export const getActiveVehicleType = async () => {
  return await AsyncStorage.getItem(VEHICLE_TYPE_KEY);
};
