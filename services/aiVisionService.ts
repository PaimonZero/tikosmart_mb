import apiClient from "./apiClient";

const AI_TIMEOUT = 120000;

export const verifyPickingImages = (imageUrls: string[], type: 'picking' | 'delivery' = 'picking', locationParams: any = {}) => {
  return apiClient.post("/ai-vision/verify-image", { imageUrls, context: type, ...locationParams }, { timeout: AI_TIMEOUT });
};
