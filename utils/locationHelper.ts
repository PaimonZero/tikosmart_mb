import * as Location from 'expo-location';

/**
 * Lấy vị trí GPS hiện tại của thiết bị với thời gian chờ giới hạn và cơ chế dự phòng.
 * Giúp ngăn ứng dụng React Native và System UI của Android bị đóng băng (ANR)
 * khi GPS bị khóa, đang bận hoặc phản hồi quá chậm.
 * 
 * @param timeoutMs Thời gian chờ tối đa bằng mili-giây trước khi kích hoạt dự phòng (mặc định 3000ms)
 * @param accuracy Độ chính xác vị trí yêu cầu (mặc định Location.Accuracy.Balanced)
 */
export async function getCurrentLocationWithTimeout(
  timeoutMs: number = 3000,
  accuracy: Location.Accuracy = Location.Accuracy.Balanced
): Promise<Location.LocationObject | null> {
  let timeoutHandle: any = null;

  // Promise sẽ reject sau khi hết thời gian chờ (timeout)
  const timeoutPromise = new Promise<null>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error('Yêu cầu định vị quá thời gian chờ (Timeout)'));
    }, timeoutMs);
  });

  try {
    console.log(`[LocationHelper] Đang yêu cầu vị trí với độ chính xác: ${accuracy}, timeout: ${timeoutMs}ms...`);
    
    // Đua (race) giữa hàm định vị thực tế và hàm timeout
    const location = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy }),
      timeoutPromise
    ]);
    
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    
    if (location) {
      console.log(`[LocationHelper] Lấy vị trí thành công từ GPS: ${location.coords.latitude}, ${location.coords.longitude}`);
    }
    return location;
  } catch (err: any) {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }
    console.warn(`[LocationHelper] getCurrentPositionAsync thất bại hoặc quá thời gian chờ (${err?.message || err}), đang chuyển sang getLastKnownPositionAsync dự phòng...`);
    
    try {
      // Dự phòng bằng cách lấy vị trí cuối cùng được ghi nhận từ hệ thống (cực nhanh, không chặn luồng)
      const lastKnown = await Location.getLastKnownPositionAsync({});
      if (lastKnown) {
        console.log(`[LocationHelper] Lấy vị trí dự phòng từ cache hệ thống thành công: ${lastKnown.coords.latitude}, ${lastKnown.coords.longitude}`);
        return lastKnown;
      } else {
        console.warn('[LocationHelper] Không tìm thấy vị trí lưu đệm (getLastKnownPositionAsync trả về null)');
      }
    } catch (fallbackErr) {
      console.error('[LocationHelper] Cả định vị trực tiếp và định vị dự phòng đều thất bại:', fallbackErr);
    }
    return null;
  }
}
