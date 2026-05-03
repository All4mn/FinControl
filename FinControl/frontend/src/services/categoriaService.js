import api from './api.js';

export const getCategorias = async () => {
  const response = await api.get('/categorias');
  return response.data;
};
