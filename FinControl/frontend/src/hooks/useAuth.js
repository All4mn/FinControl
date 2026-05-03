// =============================================================================
// src/hooks/useAuth.js
// Hook de autenticação
// =============================================================================

import { useState, useCallback } from 'react';
import { authService } from '../services/api';

export const useAuth = () => {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('fincontrol_usuario');
    return salvo ? JSON.parse(salvo) : null;
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const login = useCallback(async ({ email, senha }) => {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await authService.login({ email, senha });
      if (data.sucesso) {
        localStorage.setItem('fincontrol_token', data.token);
        localStorage.setItem('fincontrol_usuario_id', data.usuario.id);
        localStorage.setItem('fincontrol_usuario', JSON.stringify(data.usuario));
        setUsuario(data.usuario);
        return { sucesso: true };
      }
    } catch (err) {
      const mensagem = err.response?.data?.mensagem || 'Erro ao fazer login';
      setErro(mensagem);
      return { sucesso: false, mensagem };
    } finally {
      setCarregando(false);
    }
  }, []);

  const registro = useCallback(async ({ nome, email, senha }) => {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await authService.registro({ nome, email, senha });
      return { sucesso: data.sucesso };
    } catch (err) {
      const mensagem = err.response?.data?.mensagem || 'Erro ao registrar';
      setErro(mensagem);
      return { sucesso: false, mensagem };
    } finally {
      setCarregando(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fincontrol_token');
    localStorage.removeItem('fincontrol_usuario_id');
    localStorage.removeItem('fincontrol_usuario');
    setUsuario(null);
  }, []);

  return { usuario, carregando, erro, login, registro, logout };
};
