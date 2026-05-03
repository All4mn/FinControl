import { useEffect, useState } from 'react';
import { createTransacao, getTransacoes } from '../services/transacaoService.js';
import { getContas } from '../services/contaService.js';
import { getCategorias } from '../services/categoriaService.js';
import { getMetodos } from '../services/metodoService.js';

export default function TransactionsPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [form, setForm] = useState({
    tipo: 'despesa',
    conta_id: '',
    categoria_id: '',
    metodo_id: '',
    descricao: '',
    valor: '',
    data: '',
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transacoesResp, contasResp, categoriasResp, metodosResp] = await Promise.all([
          getTransacoes(),
          getContas(),
          getCategorias(),
          getMetodos(),
        ]);
        setTransacoes(transacoesResp.dados);
        setContas(contasResp.dados);
        setCategorias(categoriasResp.dados);
        setMetodos(metodosResp.dados);
      } catch (err) {
        setErro(err.response?.data?.mensagem || 'Falha ao carregar dados');
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setSucesso('');

    try {
      await createTransacao({
        tipo: form.tipo,
        conta_id: Number(form.conta_id),
        categoria_id: Number(form.categoria_id) || null,
        metodo_id: Number(form.metodo_id) || null,
        descricao: form.descricao,
        valor: Number(form.valor),
        data: form.data,
      });

      setSucesso('Transação adicionada com sucesso');
      setForm({
        tipo: 'despesa',
        conta_id: '',
        categoria_id: '',
        metodo_id: '',
        descricao: '',
        valor: '',
        data: '',
      });

      const response = await getTransacoes();
      setTransacoes(response.dados);
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Falha ao criar transação');
    }
  };

  return (
    <main className="page-content">
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Nova transação</h2>
        </div>

        <div className="card form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Tipo
              <select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </select>
            </label>

            <label>
              Conta
              <select name="conta_id" value={form.conta_id} onChange={handleChange} required>
                <option value="">Selecione uma conta</option>
                {contas.map((conta) => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Categoria
              <select name="categoria_id" value={form.categoria_id} onChange={handleChange}>
                <option value="">Sem categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Método
              <select name="metodo_id" value={form.metodo_id} onChange={handleChange}>
                <option value="">Sem método</option>
                {metodos.map((metodo) => (
                  <option key={metodo.id} value={metodo.id}>
                    {metodo.nome}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Descrição
              <input name="descricao" value={form.descricao} onChange={handleChange} />
            </label>

            <label>
              Valor
              <input
                name="valor"
                type="number"
                min="0"
                step="0.01"
                value={form.valor}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Data
              <input name="data" type="date" value={form.data} onChange={handleChange} required />
            </label>

            {erro && <p className="form-error">{erro}</p>}
            {sucesso && <p className="form-success">{sucesso}</p>}

            <button type="submit">Salvar transação</button>
          </form>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Transações recentes</h2>
        </div>

        {transacoes.length === 0 ? (
          <p>Nenhuma transação encontrada.</p>
        ) : (
          <table className="table-list">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{new Date(transacao.data).toLocaleDateString()}</td>
                  <td>{transacao.tipo}</td>
                  <td>{transacao.descricao || '—'}</td>
                  <td>{transacao.categoria_nome || '—'}</td>
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
