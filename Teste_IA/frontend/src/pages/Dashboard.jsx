// =============================================================================
// src/pages/Dashboard.jsx
// Dashboard principal do FinControl
// =============================================================================

import { useState, useEffect } from 'react';
import { transacaoService, contaService } from '../services/api';

export default function Dashboard() {
  const [resumo, setResumo]         = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas]         = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resResumo, resTrans, resContas] = await Promise.all([
          transacaoService.resumo(),
          transacaoService.listar({ limit: 5 }),
          contaService.listar(),
        ]);
        setResumo(resResumo.data.dados);
        setTransacoes(resTrans.data.dados || []);
        setContas(resContas.data.dados || []);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err.message);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  if (carregando) return <div style={styles.loading}>⏳ Carregando dados...</div>;

  const saldo = (resumo?.total_receitas || 0) - (resumo?.total_despesas || 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>💰 FinControl</h1>
        <nav style={styles.nav}>
          <a href="/nova-transacao" style={styles.navLink}>+ Nova Transação</a>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={styles.btnLogout}>Sair</button>
        </nav>
      </header>

      {/* Cards de resumo */}
      <div style={styles.cards}>
        <div style={{ ...styles.card, borderTop: '3px solid #22c55e' }}>
          <p style={styles.cardLabel}>Total Receitas</p>
          <p style={{ ...styles.cardValor, color: '#22c55e' }}>{fmt(resumo?.total_receitas)}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '3px solid #ef4444' }}>
          <p style={styles.cardLabel}>Total Despesas</p>
          <p style={{ ...styles.cardValor, color: '#ef4444' }}>{fmt(resumo?.total_despesas)}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '3px solid #38bdf8' }}>
          <p style={styles.cardLabel}>Saldo</p>
          <p style={{ ...styles.cardValor, color: saldo >= 0 ? '#22c55e' : '#ef4444' }}>{fmt(saldo)}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '3px solid #a78bfa' }}>
          <p style={styles.cardLabel}>Transações</p>
          <p style={{ ...styles.cardValor, color: '#a78bfa' }}>{resumo?.total_transacoes || 0}</p>
        </div>
      </div>

      {/* Últimas transações */}
      <div style={styles.secao}>
        <h2 style={styles.secaoTitulo}>Últimas Transações</h2>
        {transacoes.length === 0 ? (
          <p style={styles.vazio}>Nenhuma transação registrada ainda.</p>
        ) : (
          <div style={styles.lista}>
            {transacoes.map((t) => (
              <div key={t.id} style={styles.item}>
                <div>
                  <p style={styles.itemDesc}>{t.descricao || 'Sem descrição'}</p>
                  <p style={styles.itemData}>{new Date(t.data).toLocaleDateString('pt-BR')} · {t.categoria_nome || 'Sem categoria'}</p>
                </div>
                <p style={{ ...styles.itemValor, color: t.tipo === 'receita' ? '#22c55e' : '#ef4444' }}>
                  {t.tipo === 'receita' ? '+' : '-'}{fmt(t.valor)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contas */}
      <div style={styles.secao}>
        <h2 style={styles.secaoTitulo}>Minhas Contas ({contas.length})</h2>
        {contas.length === 0 ? (
          <p style={styles.vazio}>Nenhuma conta cadastrada.</p>
        ) : (
          <div style={styles.contasGrid}>
            {contas.map((c) => (
              <div key={c.id} style={styles.contaCard}>
                <p style={styles.contaNome}>{c.nome}</p>
                <p style={styles.contaTipo}>{c.tipo}</p>
                <p style={styles.contaSaldo}>{fmt(c.saldo_atual)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container:   { minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' },
  loading:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8', fontSize: '1.25rem' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155' },
  titulo:      { color: '#38bdf8', fontSize: '1.5rem', fontWeight: 800, margin: 0 },
  nav:         { display: 'flex', gap: '1rem', alignItems: 'center' },
  navLink:     { color: '#38bdf8', textDecoration: 'none', fontWeight: 600, background: '#0f172a', padding: '0.5rem 1rem', borderRadius: 8 },
  btnLogout:   { background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer' },
  cards:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '2rem' },
  card:        { background: '#1e293b', borderRadius: 12, padding: '1.5rem' },
  cardLabel:   { color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 0.5rem' },
  cardValor:   { fontSize: '1.75rem', fontWeight: 800, margin: 0 },
  secao:       { padding: '0 2rem 2rem' },
  secaoTitulo: { color: '#e2e8f0', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' },
  vazio:       { color: '#475569', fontStyle: 'italic' },
  lista:       { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  item:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', borderRadius: 10, padding: '1rem 1.25rem' },
  itemDesc:    { color: '#e2e8f0', fontWeight: 600, margin: 0 },
  itemData:    { color: '#64748b', fontSize: '0.8rem', margin: '0.25rem 0 0' },
  itemValor:   { fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  contasGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },
  contaCard:   { background: '#1e293b', borderRadius: 10, padding: '1.25rem', borderLeft: '3px solid #3b82f6' },
  contaNome:   { color: '#e2e8f0', fontWeight: 700, margin: '0 0 0.25rem' },
  contaTipo:   { color: '#64748b', fontSize: '0.8rem', margin: '0 0 0.75rem', textTransform: 'capitalize' },
  contaSaldo:  { color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem', margin: 0 },
};
