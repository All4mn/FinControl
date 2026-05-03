// =============================================================================
// src/pages/Cadastro.jsx
// Página de Cadastro do FinControl
// =============================================================================

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Cadastro() {
  const { registro, carregando, erro } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await registro(form);
    if (resultado?.sucesso) {
      setSucesso(true);
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>💰 FinControl</h1>
        <p style={styles.subtitulo}>Crie sua conta gratuita</p>

        {erro    && <div style={styles.erro}>{erro}</div>}
        {sucesso && <div style={styles.sucesso}>Conta criada! Redirecionando...</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nome completo</label>
          <input type="text"     name="nome"  value={form.nome}  onChange={handleChange} placeholder="João Silva"          required style={styles.input} />
          <label style={styles.label}>E-mail</label>
          <input type="email"    name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com"       required style={styles.input} />
          <label style={styles.label}>Senha</label>
          <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" required minLength={6} style={styles.input} />

          <button type="submit" disabled={carregando} style={styles.botao}>
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p style={styles.link}>
          Já tem conta? <a href="/login">Entrar</a>
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
  botao:     { background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '0.85rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  erro:      { background: '#450a0a', border: '1px solid #ef4444', borderRadius: 8, padding: '0.75rem', color: '#fca5a5', marginBottom: '1rem' },
  sucesso:   { background: '#052e16', border: '1px solid #22c55e', borderRadius: 8, padding: '0.75rem', color: '#86efac', marginBottom: '1rem' },
  link:      { color: '#94a3b8', textAlign: 'center', marginTop: '1.25rem' },
};
