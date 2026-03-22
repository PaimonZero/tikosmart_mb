import apiClient from "./apiClient";

/**
 * Upload Image to R2 via Backend
 * @param uri Local file URI from ImagePicker
 * @returns Promise<{ url: string }>
 */
export const uploadImage = async (uri: string) => {
  const formData = new FormData();

  // Extract filename and type
  const filename = uri.split("/").pop() || "upload.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("file", {
    uri,
    name: filename,
    type,
  } as any);

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data; // Expected { url: "..." }
};

export const uploadWatermarkedImages = async (uris: string[], meta: any) => {
  const formData = new FormData();

  uris.forEach((uri) => {
    const filename = uri.split("/").pop() || "upload.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("files", {
      uri,
      name: filename,
      type,
    } as any);
  });

  formData.append("latitude", String(meta.latitude || ""));
  formData.append("longitude", String(meta.longitude || ""));
  formData.append("accuracy", String(meta.accuracy || ""));
  formData.append("address", meta.address || "");
  formData.append("capturedAt", meta.capturedAt || new Date().toISOString());
  formData.append("context", meta.context || "task-manage");
  formData.append("source", "camera");
  formData.append("deviceType", "mobile");

  const response = await apiClient.post("/upload/watermarked-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

