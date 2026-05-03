import { useEffect, useState } from 'react';
import { getContas } from '../services/contaService.js';

export default function ContasPage() {
  const [contas, setContas] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const loadContas = async () => {
      try {
        const response = await getContas();
        setContas(response.dados);
      } catch (err) {
        setErro(err.response?.data?.mensagem || 'Falha ao carregar contas');
      }
    };

    loadContas();
  }, []);

  return (
    <main className="page-content">
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Contas</h2>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        {contas.length === 0 ? (
          <p>Nenhuma conta encontrada.</p>
        ) : (
          <table className="table-list">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.nome}</td>
                  <td>{conta.tipo}</td>
                  <td>R$ {conta.saldo_atual ?? conta.saldo_inicial}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
