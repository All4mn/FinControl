import api from './api.js';

export const getContas = async () => {
  const response = await api.get('/contas');
  return response.data;
};
