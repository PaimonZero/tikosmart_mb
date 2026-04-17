import apiClient from "./apiClient";

export const getListUsers = (params: any) => {
   const { q, role, limit = 10, offset = 0 } = params;

  return apiClient.get("/users", {
    params: {
      q: q || undefined,
      role: role || undefined,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
};

export const getUserById = (userId: string) => {
  return apiClient.get(`/users/${userId}`);
};

export const createUser = (userData: any) => {
  return apiClient.post("/users", userData);
};

export const updateUser = (userId: string, userData: any) => {
  return apiClient.put(`/users/${userId}`, userData);
};

export const updateUserStatus = (userId: string, status: string) => {
  return apiClient.put(`/users/${userId}`, { status });
};

