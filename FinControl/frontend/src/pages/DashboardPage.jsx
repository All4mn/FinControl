import { useEffect, useState } from 'react';
import { getResumo, getTransacoes } from '../services/transacaoService.js';

export default function DashboardPage() {
  const [resumo, setResumo] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const loadResumo = async () => {
      try {
        const response = await getResumo();
        setResumo(response.dados);
      } catch (err) {
        setErro(err.response?.data?.mensagem || 'Falha ao carregar resumo');
      }
    };

    const loadTransacoes = async () => {
      try {
        const response = await getTransacoes();
        setTransacoes(response.dados.slice(0, 5));
      } catch (err) {
        setErro(err.response?.data?.mensagem || 'Falha ao carregar transações');
      }
    };

    loadResumo();
    loadTransacoes();
  }, []);

  return (
    <main className="page-content">
      <section className="dashboard-overview">
        <div className="dashboard-card">
          <h3>Receitas</h3>
          <p>{resumo ? `R$ ${resumo.total_receitas ?? 0}` : '...'}</p>
        </div>

        <div className="dashboard-card">
          <h3>Despesas</h3>
          <p>{resumo ? `R$ ${resumo.total_despesas ?? 0}` : '...'}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total de transações</h3>
          <p>{resumo ? resumo.total_transacoes : '...'}</p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Últimas transações</h2>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        {transacoes.length === 0 ? (
          <p>Nenhuma transação encontrada.</p>
        ) : (
          <table className="table-list">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Conta</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{new Date(transacao.data).toLocaleDateString()}</td>
                  <td>{transacao.tipo}</td>
                  <td>{transacao.categoria_nome || 'Sem categoria'}</td>
                  <td>{transacao.conta_id}</td>
                  <td className={transacao.tipo === 'despesa' ? 'negative' : 'positive'}>
                    R$ {transacao.valor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
