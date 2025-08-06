import { instance } from './axios';

/**
 * Register a new user
 * @param {Object} data - User registration data
 * @returns {Promise<Object>} - Response with token and user data
 */
export const register = async (data) => {
  const response = await instance.post('/api/register', data);
  return response.data;
};

/**
 * Login a user
 * @param {Object} data - User login data
 * @returns {Promise<Object>} - Response with token and user data
 */
export const login = async (data) => {
  const response = await instance.post('/api/login', data);
  return response.data;
};

/**
 * Request password reset
 * @param {Object} data - Email for password reset
 * @returns {Promise<Object>} - Response with message and reset token
 */
export const requestPasswordReset = async (data) => {
  const response = await instance.post('/api/request-password-reset', data);
  return response.data;
};

/**
 * Reset password
 * @param {Object} data - Token and new password
 * @returns {Promise<Object>} - Response with success message
 */
export const resetPassword = async (data) => {
  const response = await instance.post('/api/reset-password', data);
  return response.data;
};