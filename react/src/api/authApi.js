import { instance } from './axios';

export const register = async (data) => {
  const response = await instance.post('/api/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await instance.post('/api/login', data);
  return response.data;
};

export const requestPasswordReset = async (data) => {
  const response = await instance.post('/api/request-password-reset', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await instance.post('/api/reset-password', data);
  return response.data;
};
