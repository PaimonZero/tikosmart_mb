import apiClient from '@/services/apiClient';

export const registerUser = (payload: any) => apiClient.post('/auth/register', payload);

export const loginUser = ({ emailOrUsername, password }: { emailOrUsername: string; password: string }) =>
  apiClient.post('/auth/login', { emailOrUsername, password });

export const logoutUser = () => apiClient.post('/auth/logout');

export const forgotPassword = (email: string) => apiClient.post('/auth/forgot-password', { email });

export const resetPassword = (token: string, newPassword: string) =>
  apiClient.post(`/auth/reset-password/${token}`, { newPassword });

export const checkResetToken = (token: string) => apiClient.get(`/auth/check-reset-token/${token}`);

export const validateResetToken = (token: string) =>
  apiClient.get(`/auth/reset-password/validate/${token}`);

export const getUserProfile = () => apiClient.get('/users/current');

export const updateUserProfile = (data: any) => apiClient.put('/users/current', data);

export const changePassword = (data: any) => apiClient.put('/users/current/password', data);
