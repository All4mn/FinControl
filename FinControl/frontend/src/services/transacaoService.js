import api from './api.js';

export const getResumo = async () => {
  const response = await api.get('/transacoes/resumo');
  return response.data;
};

export const getTransacoes = async (params = {}) => {
  const response = await api.get('/transacoes', { params });
  return response.data;
};

export const createTransacao = async (payload) => {
  const response = await api.post('/transacoes', payload);
  return response.data;
};
