import { instance } from './axios';

/**
 * Upload a photo
 * @param {Object} data - Photo data including base64 image
 * @returns {Promise<Object>} - Response with photo ID
 */
export const uploadPhoto = async (data) => {
  const response = await instance.post('/api/photos/upload', data);
  return response.data;
};

/**
 * Rate a photo
 * @param {Object} data - Photo ID and rating score
 * @returns {Promise<Object>} - Response with updated average score
 */
export const ratePhoto = async (data) => {
  const response = await instance.post('/api/photos/rate', data);
  return response.data;
};

/**
 * Get list of photos with optional filters
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Array>} - List of photos
 */
export const getPhotos = async (params = {}) => {
  const response = await instance.get('/api/photos', { params });
  return response.data;
};

/**
 * Get next photo for rating with filters
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - Next photo data
 */
export const getNextPhoto = async (params = {}) => {
  const response = await instance.get('/api/photos/next', { params });
  return response.data;
};

/**
 * Toggle photo active status for rating
 * @param {Object} data - Photo ID and active status
 * @returns {Promise<Object>} - Response with updated status
 */
export const togglePhotoStatus = async (data) => {
  const response = await instance.post('/api/photos/status', data);
  return response.data;
};