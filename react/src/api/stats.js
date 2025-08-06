import { instance } from './axios';

/**
 * Get user rating statistics
 * @returns {Promise<Object>} - User statistics
 */
export const getStats = async () => {
  const response = await instance.get('/api/stats');
  return response.data;
};