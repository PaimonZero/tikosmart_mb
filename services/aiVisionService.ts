import apiClient from "./apiClient";

const AI_TIMEOUT = 120000;

export const verifyPickingImages = (imageUrls: string[]) => {
  return apiClient.post("/ai-vision/verify-image", { imageUrls }, { timeout: AI_TIMEOUT });
};
