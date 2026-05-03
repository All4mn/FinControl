import api from './api.js';

export const login = async (payload) => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};

export const register = async (payload) => {
  const response = await api.post('/auth/registro', payload);
  return response.data;
};

export const fetchMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
