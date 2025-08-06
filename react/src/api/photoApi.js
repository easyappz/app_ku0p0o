import { instance } from './axios';

export const getNextPhoto = async (filters = {}) => {
  const { gender, minAge, maxAge } = filters;
  const params = {};
  if (gender) params.gender = gender;
  if (minAge) params.minAge = minAge;
  if (maxAge) params.maxAge = maxAge;
  
  const response = await instance.get('/api/photos/next', { params });
  return response.data;
};

export const ratePhoto = async (photoId, score) => {
  const response = await instance.post('/api/photos/rate', { photoId, score });
  return response.data;
};

export const getUserStats = async () => {
  const response = await instance.get('/api/stats');
  return response.data;
};

export const togglePhotoStatus = async (photoId, isActive) => {
  const response = await instance.post('/api/photos/status', { photoId, isActive });
  return response.data;
};

export const getPhotos = async (filters = {}) => {
  const { gender, minAge, maxAge } = filters;
  const params = {};
  if (gender) params.gender = gender;
  if (minAge) params.minAge = minAge;
  if (maxAge) params.maxAge = maxAge;
  
  const response = await instance.get('/api/photos', { params });
  return response.data;
};

export const uploadPhoto = async (data) => {
  const response = await instance.post('/api/photos/upload', data);
  return response.data;
};
