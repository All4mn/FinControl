import api from './api.js';

export const getMetodos = async () => {
  const response = await api.get('/metodos');
  return response.data;
};
