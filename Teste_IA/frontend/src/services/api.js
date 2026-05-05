// =============================================================================
// src/services/api.js
// Instância do Axios configurada para a API do FinControl
// =============================================================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Interceptor de Requisição ────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fincontrol_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Envia usuario_id no header (remover ao implementar JWT completo)
    const usuarioId = localStorage.getItem('fincontrol_usuario_id');
    if (usuarioId) {
      config.headers['x-usuario-id'] = usuarioId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Interceptor de Resposta ──────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fincontrol_token');
      localStorage.removeItem('fincontrol_usuario_id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Serviços por recurso ─────────────────────────────────────────────────────

export const authService = {
  login:    (dados) => api.post('/auth/login', dados),
  registro: (dados) => api.post('/auth/registro', dados),
  me:       ()      => api.get('/auth/me'),
};

export const contaService = {
  listar:       ()       => api.get('/contas'),
  buscar:       (id)     => api.get(`/contas/${id}`),
  criar:        (dados)  => api.post('/contas', dados),
  atualizar:    (id, d)  => api.put(`/contas/${id}`, d),
  deletar:      (id)     => api.delete(`/contas/${id}`),
};

export const transacaoService = {
  listar:   (params) => api.get('/transacoes', { params }),
  buscar:   (id)     => api.get(`/transacoes/${id}`),
  criar:    (dados)  => api.post('/transacoes', dados),
  atualizar:(id, d)  => api.put(`/transacoes/${id}`, d),
  deletar:  (id)     => api.delete(`/transacoes/${id}`),
  resumo:   ()       => api.get('/transacoes/resumo'),
};

export const categoriaService = {
  listar:   ()       => api.get('/categorias'),
  criar:    (dados)  => api.post('/categorias', dados),
  atualizar:(id, d)  => api.put(`/categorias/${id}`, d),
  deletar:  (id)     => api.delete(`/categorias/${id}`),
};

export const metodoService = {
  listar: () => api.get('/metodos'),
  criar:  (d) => api.post('/metodos', d),
};

export default api;
