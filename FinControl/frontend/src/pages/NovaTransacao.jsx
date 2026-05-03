// =============================================================================
// src/pages/NovaTransacao.jsx
// Formulário para registrar nova transação
// =============================================================================

import { useState, useEffect } from 'react';
import { transacaoService, categoriaService, contaService, metodoService } from '../services/api';

export default function NovaTransacao() {
  const [form, setForm] = useState({
    tipo: 'despesa', descricao: '', valor: '', data: new Date().toISOString().slice(0, 10),
    conta_id: '', categoria_id: '', metodo_id: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [contas, setContas]         = useState([]);
  const [metodos, setMetodos]       = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso]       = useState(false);
  const [erro, setErro]             = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resCat, resContas, resMet] = await Promise.all([
          categoriaService.listar(),
          contaService.listar(),
          metodoService.listar(),
        ]);
        setCategorias(resCat.data.dados   || []);
        setContas(resContas.data.dados    || []);
        setMetodos(resMet.data.dados      || []);
      } catch (err) {
        console.error('Erro ao carregar dados:', err.message);
      }
    };
    carregar();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      await transacaoService.criar({
        ...form,
        valor:       parseFloat(form.valor),
        conta_id:    form.conta_id    || null,
        categoria_id:form.categoria_id|| null,
        metodo_id:   form.metodo_id   || null,
      });
      setSucesso(true);
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar transação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <a href="/dashboard" style={styles.voltar}>← Voltar</a>
        <h1 style={styles.titulo}>Nova Transação</h1>

        {erro    && <div style={styles.erro}>{erro}</div>}
        {sucesso && <div style={styles.sucesso}>✅ Transação salva! Redirecionando...</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Tipo */}
          <div style={styles.tipoSwitch}>
            {['despesa', 'receita'].map((t) => (
              <button key={t} type="button"
                style={{ ...styles.tipoBotao, ...(form.tipo === t ? (t === 'receita' ? styles.ativo_receita : styles.ativo_despesa) : {}) }}
                onClick={() => setForm({ ...form, tipo: t })}>
                {t === 'receita' ? '📈 Receita' : '📉 Despesa'}
              </button>
            ))}
          </div>

          <label style={styles.label}>Descrição</label>
          <input name="descricao" value={form.descricao} onChange={handleChange} placeholder="Ex: Aluguel, Salário..." style={styles.input} />

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Valor (R$)</label>
              <input type="number" name="valor" value={form.valor} onChange={handleChange} placeholder="0,00" step="0.01" min="0.01" required style={styles.input} />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Data</label>
              <input type="date" name="data" value={form.data} onChange={handleChange} required style={styles.input} />
            </div>
          </div>

          <label style={styles.label}>Categoria</label>
          <select name="categoria_id" value={form.categoria_id} onChange={handleChange} style={styles.select}>
            <option value="">Selecione (opcional)</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}
          </select>

          <label style={styles.label}>Conta</label>
          <select name="conta_id" value={form.conta_id} onChange={handleChange} style={styles.select}>
            <option value="">Selecione (opcional)</option>
            {contas.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>

          <label style={styles.label}>Método de Pagamento</label>
          <select name="metodo_id" value={form.metodo_id} onChange={handleChange} style={styles.select}>
            <option value="">Selecione (opcional)</option>
            {metodos.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>

          <button type="submit" disabled={carregando} style={styles.botao}>
            {carregando ? 'Salvando...' : '💾 Salvar Transação'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container:     { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card:          { background: '#1e293b', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 560 },
  voltar:        { color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' },
  titulo:        { color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: '0.75rem 0 1.5rem' },
  form:          { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label:         { color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600 },
  input:         { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
  select:        { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem' },
  botao:         { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  erro:          { background: '#450a0a', border: '1px solid #ef4444', borderRadius: 8, padding: '0.75rem', color: '#fca5a5' },
  sucesso:       { background: '#052e16', border: '1px solid #22c55e', borderRadius: 8, padding: '0.75rem', color: '#86efac' },
  tipoSwitch:    { display: 'flex', gap: '0.5rem' },
  tipoBotao:     { flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' },
  ativo_receita: { background: '#052e16', border: '1px solid #22c55e', color: '#22c55e' },
  ativo_despesa: { background: '#450a0a', border: '1px solid #ef4444', color: '#ef4444' },
  row:           { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  col:           { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
};
