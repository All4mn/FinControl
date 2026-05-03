// =============================================================================
// src/pages/Login.jsx
// Página de Login do FinControl
// =============================================================================

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, carregando, erro } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await login(form);
    if (resultado?.sucesso) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>💰 FinControl</h1>
        <p style={styles.subtitulo}>Faça login na sua conta</p>

        {erro && <div style={styles.erro}>{erro}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
            style={styles.input}
          />

          <label style={styles.label}>Senha</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="••••••••"
            required
            style={styles.input}
          />

          <button type="submit" disabled={carregando} style={styles.botao}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.link}>
          Não tem conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card:      { background: '#1e293b', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 400, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
  titulo:    { color: '#38bdf8', fontSize: '2rem', fontWeight: 800, marginBottom: 4 },
  subtitulo: { color: '#94a3b8', marginBottom: '1.5rem' },
  form:      { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label:     { color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600 },
  input:     { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem' },
  botao:     { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '0.85rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  erro:      { background: '#450a0a', border: '1px solid #ef4444', borderRadius: 8, padding: '0.75rem', color: '#fca5a5', marginBottom: '1rem' },
  link:      { color: '#94a3b8', textAlign: 'center', marginTop: '1.25rem' },
};
