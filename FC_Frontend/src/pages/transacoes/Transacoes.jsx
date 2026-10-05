import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Archive, ArrowDownLeft, ArrowUpRight, Pencil, Plus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import styles from "./Transacoes.module.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

const moedaParaCodigo = (nome) => {
  const valor = String(nome || "").toLowerCase();
  if (valor.includes("euro")) return "EUR";
  if (valor.includes("dólar") || valor.includes("dolar") || valor.includes("usd")) return "USD";
  if (valor.includes("real") || valor.includes("brl")) return "BRL";
  return "BRL";
};

const formatarMoeda = (valor, moeda) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: moedaParaCodigo(moeda),
  }).format(Number(valor) || 0);

const metodosUnicos = (metodos, idSelecionado) => {
  const porNome = new Map();
  metodos.forEach((metodo) => {
    const nomeNormalizado = String(metodo.nome_metodo || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("pt-BR");
    const existente = porNome.get(nomeNormalizado);
    if (!existente || String(metodo.id_metodo) === String(idSelecionado)) {
      porNome.set(nomeNormalizado, metodo);
    }
  });
  return [...porNome.values()];
};

const dataLocal = (data = new Date()) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

const formInicial = () => ({
  descricao: "",
  valor: "",
  data: dataLocal(),
  id_conta: "",
  id_categoria: "",
  id_metodo: "",
  entrada: false,
  quitado: true,
});

export default function Transacoes() {
  const [usuario, setUsuario] = useState(null);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [falhaCarregamento, setFalhaCarregamento] = useState(false);
  const [formAberto, setFormAberto] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState(null);
  const [form, setForm] = useState(formInicial);
  const [tipoFiltro, setTipoFiltro] = useState("todas");
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  const carregarTransacoes = async (idsContasPermitidas) => {
    const resposta = await axios.get(`${API_BASE_URL}/transacoes`, { withCredentials: true });
    const permitidas = new Set(idsContasPermitidas.map(Number));
    const transacoesDoUsuario = (resposta.data.dados || []).filter((transacao) =>
      permitidas.has(Number(transacao.id_conta)),
    );
    setTransacoes(transacoesDoUsuario);
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setTransacoes([]);
        setContas([]);
        const respostaUsuario = await axios.get(`${API_BASE_URL}/usuarios/me`, { withCredentials: true });
        if (!respostaUsuario.data.sucesso) {
          window.location.href = "/login";
          return;
        }

        const dadosUsuario = respostaUsuario.data.dados;
        setUsuario(dadosUsuario);
        const [respostaContas, respostaCategorias, respostaMetodos] = await Promise.all([
          axios.get(`${API_BASE_URL}/contas/search/${dadosUsuario.id_usuario}`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/categorias`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/metodos`, { withCredentials: true }),
        ]);

        const contasDoUsuario = respostaContas.data.dados || [];
        setContas(contasDoUsuario);
        setCategorias(respostaCategorias.data.dados || []);
        setMetodos(respostaMetodos.data.dados || []);
        await carregarTransacoes(contasDoUsuario.map((conta) => conta.id_conta));
      } catch (falha) {
        setTransacoes([]);
        if (falha.response?.status === 401) {
          window.location.href = "/login";
          return;
        }
        setFalhaCarregamento(true);
        setErro(falha.response?.data?.mensagem || "Não foi possível carregar as transações.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const transacoesFiltradas = useMemo(() => {
    const consulta = busca.trim().toLocaleLowerCase("pt-BR");
    return transacoes.filter((transacao) => {
      const correspondeTipo = tipoFiltro === "todas" || transacao.entrada === (tipoFiltro === "entradas");
      const correspondeBusca = !consulta || [
        transacao.descricao,
        transacao.nome_conta,
        transacao.nome_categoria,
        transacao.nome_metodo,
      ].some((valor) => String(valor || "").toLocaleLowerCase("pt-BR").includes(consulta));
      return correspondeTipo && correspondeBusca;
    });
  }, [busca, tipoFiltro, transacoes]);

  const resumo = useMemo(() => {
    const agora = new Date();
    const doMes = transacoes.filter((transacao) => {
      const data = new Date(transacao.data);
      return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
    });
    const totais = new Map();

    doMes.forEach((transacao) => {
      const moeda = transacao.nome_moeda || "Real";
      const total = totais.get(moeda) || { entradas: 0, saidas: 0 };
      const valor = Number(transacao.valor) || 0;
      if (transacao.entrada) total.entradas += valor;
      else total.saidas += valor;
      totais.set(moeda, total);
    });

    return [...totais.entries()].map(([moeda, valores]) => ({ moeda, ...valores }));
  }, [transacoes]);

  const abrirNovo = () => {
    setErro("");
    setTransacaoEditando(null);
    setForm({ ...formInicial(), id_conta: contas[0] ? String(contas[0].id_conta) : "" });
    setFormAberto(true);
  };

  const abrirEdicao = (transacao) => {
    setErro("");
    setTransacaoEditando(transacao);
    setForm({
      descricao: transacao.descricao || "",
      valor: String(transacao.valor || ""),
      data: dataLocal(new Date(transacao.data)),
      id_conta: String(transacao.id_conta || ""),
      id_categoria: transacao.id_categoria ? String(transacao.id_categoria) : "",
      id_metodo: transacao.id_metodo ? String(transacao.id_metodo) : "",
      entrada: Boolean(transacao.entrada),
      quitado: Boolean(transacao.quitado),
    });
    setFormAberto(true);
  };

  const fecharForm = () => {
    setFormAberto(false);
    setTransacaoEditando(null);
    setErro("");
  };

  const alterarCampo = (evento) => {
    const { name, value, checked, type } = evento.target;
    setForm((anterior) => ({ ...anterior, [name]: type === "checkbox" ? checked : value }));
  };

  const salvarTransacao = async (evento) => {
    evento.preventDefault();
    setSalvando(true);
    setErro("");
    const dados = {
      id_conta: Number(form.id_conta),
      id_categoria: form.id_categoria ? Number(form.id_categoria) : null,
      id_metodo: form.id_metodo ? Number(form.id_metodo) : null,
      id_carteira: null,
      valor: Number(form.valor),
      descricao: form.descricao.trim(),
      quitado: form.quitado,
      arquivado: false,
      data: `${form.data}T12:00:00`,
      entrada: form.entrada,
    };

    try {
      const carteiraResposta = await axios.get(
        `${API_BASE_URL}/carteiras/usuario/${usuario.id_usuario}`,
        { withCredentials: true },
      );
      dados.id_carteira = carteiraResposta.data.dados?.id_carteira || null;
      if (transacaoEditando) {
        await axios.put(`${API_BASE_URL}/transacoes/${transacaoEditando.id_transacao}`, dados, { withCredentials: true });
      } else {
        await axios.post(`${API_BASE_URL}/transacoes`, dados, { withCredentials: true });
      }
      await carregarTransacoes(contas.map((conta) => conta.id_conta));
      fecharForm();
    } catch (falha) {
      setErro(
        falha.response?.data?.mensagem ||
          falha.response?.data?.message ||
          "Não foi possível salvar a transação. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const arquivarTransacao = async (transacao) => {
    const confirmar = window.confirm(`Arquivar a transação “${transacao.descricao}”?`);
    if (!confirmar) return;
    try {
      await axios.put(`${API_BASE_URL}/transacoes/${transacao.id_transacao}/archive`, {}, { withCredentials: true });
      await carregarTransacoes(contas.map((conta) => conta.id_conta));
    } catch (falha) {
      setErro(falha.response?.data?.mensagem || "Não foi possível arquivar a transação.");
    }
  };

  if (carregando) {
    return (
      <div className={styles.page}>
        <Header usuario={usuario} logado={true} />
        <main className={styles.main}><p className={styles.estado}>Carregando transações...</p></main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header usuario={usuario} logado={true} />
      <main className={styles.main}>
        <div className={styles.topo}>
          <div>
            <p className={styles.sobretitulo}>FINANÇAS / MOVIMENTAÇÕES</p>
            <h1>Transações</h1>
            <p className={styles.subtitulo}>Acompanhe o que entra e sai das suas contas.</p>
          </div>
          <button className={styles.botaoPrimario} onClick={abrirNovo} disabled={!contas.length}>
            <Plus size={18} aria-hidden="true" /> Nova transação
          </button>
        </div>

        {erro && <p className={styles.erro} role="alert">{erro}</p>}

        <section className={styles.listaSection}>
          <div className={styles.listaTopo}>
            <h2>Movimentações</h2>
            <div className={styles.controles}>
              <div className={styles.filtros} role="group" aria-label="Filtrar por tipo">
                {[["todas", "Todas"], ["entradas", "Receitas"], ["saidas", "Despesas"]].map(([valor, rotulo]) => (
                  <button key={valor} className={tipoFiltro === valor ? styles.filtroAtivo : ""} onClick={() => setTipoFiltro(valor)}>{rotulo}</button>
                ))}
              </div>
              <label className={styles.busca}>
                <Search size={17} aria-hidden="true" />
                <input value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder="Buscar movimentação" aria-label="Buscar movimentação" />
              </label>
            </div>
          </div>

          {falhaCarregamento ? (
            <div className={styles.vazio}>
              <h3>Não foi possível conectar ao FinControl</h3>
              <p>Confira se o servidor está disponível e atualize a página.</p>
            </div>
          ) : !contas.length ? (
            <div className={styles.vazio}>
              <h3>Adicione uma conta para começar</h3>
              <p>As transações precisam estar vinculadas a uma das suas contas.</p>
              <Link to="/dashboard/conta" className={styles.linkAcao}>Criar conta</Link>
            </div>
          ) : transacoesFiltradas.length ? (
            <div className={styles.tabelaRolagem}>
              <table className={styles.tabela}>
                <thead><tr><th>Data</th><th className={styles.valorCabecalho}>Valor</th><th>Descrição</th><th>Método</th><th>Quitado</th><th>Categoria</th><th>Conta</th><th><span className={styles.somenteLeitor}>Ações</span></th></tr></thead>
                <tbody>
                  {transacoesFiltradas.map((transacao) => (
                    <tr key={transacao.id_transacao}>
                      <td>{new Intl.DateTimeFormat("pt-BR").format(new Date(transacao.data))}</td>
                      <td className={`${styles.valor} ${transacao.entrada ? styles.valorEntrada : styles.valorSaida}`}>
                        {transacao.entrada ? "+ " : "− "}{formatarMoeda(transacao.valor, transacao.nome_moeda)}
                      </td>
                      <td><span className={styles.descricao}>{transacao.descricao}</span></td>
                      <td>{transacao.nome_metodo || metodos.find((metodo) => String(metodo.id_metodo) === String(transacao.id_metodo))?.nome_metodo || "Sem método"}</td>
                      <td><span className={transacao.quitado ? styles.statusPago : styles.statusPendente}>{transacao.quitado ? "Concluída" : "Pendente"}</span></td>
                      <td>{transacao.nome_categoria || categorias.find((categoria) => String(categoria.id_categoria) === String(transacao.id_categoria))?.nome_categoria || "Sem categoria"}</td>
                      <td>{transacao.nome_conta}</td>
                      <td>
                        <div className={styles.acoesLinha}>
                          <button type="button" onClick={() => abrirEdicao(transacao)} aria-label={`Editar ${transacao.descricao}`} title="Editar"><Pencil size={16} /></button>
                          <button type="button" onClick={() => arquivarTransacao(transacao)} aria-label={`Arquivar ${transacao.descricao}`} title="Arquivar"><Archive size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.vazio}>
              <h3>{transacoes.length ? "Nenhuma transação encontrada" : "Sua atividade começa aqui"}</h3>
              <p>{transacoes.length ? "Tente alterar a busca ou o filtro." : "Registre sua primeira receita ou despesa."}</p>
              {!transacoes.length && <button className={styles.linkAcao} onClick={abrirNovo}>Registrar transação</button>}
            </div>
          )}
        </section>

        {formAberto && (
          <section className={styles.formSection}>
            <div className={styles.formTopo}>
              <h2>{transacaoEditando ? "Editar transação" : "Nova transação"}</h2>
              <button className={styles.botaoFechar} type="button" onClick={fecharForm} aria-label="Fechar formulário"><X size={19} /></button>
            </div>
            <form className={styles.formulario} onSubmit={salvarTransacao}>
              <fieldset className={styles.tipoControle}>
                <legend>Tipo</legend>
                <label className={form.entrada ? styles.tipoAtivoEntrada : ""}>
                  <input type="radio" name="entrada" checked={form.entrada} onChange={() => setForm((anterior) => ({ ...anterior, entrada: true }))} />
                  <ArrowDownLeft size={17} /> Receita
                </label>
                <label className={!form.entrada ? styles.tipoAtivoSaida : ""}>
                  <input type="radio" name="entrada" checked={!form.entrada} onChange={() => setForm((anterior) => ({ ...anterior, entrada: false }))} />
                  <ArrowUpRight size={17} /> Despesa
                </label>
              </fieldset>

              <label className={styles.campo}>
                <span>Descrição</span>
                <input name="descricao" value={form.descricao} onChange={alterarCampo} placeholder="Ex.: Mercado, salário..." maxLength="180" required />
              </label>
              <label className={styles.campo}>
                <span>Valor</span>
                <input name="valor" type="number" min="0.01" step="0.01" value={form.valor} onChange={alterarCampo} placeholder="0,00" required />
              </label>
              <label className={styles.campo}>
                <span>Conta</span>
                <select name="id_conta" value={form.id_conta} onChange={alterarCampo} required>
                  <option value="">Selecione uma conta</option>
                  {contas.map((conta) => <option key={conta.id_conta} value={conta.id_conta}>{conta.nome_conta}{conta.moeda ? ` · ${conta.moeda}` : ""}</option>)}
                </select>
              </label>
              <label className={styles.campo}>
                <span>Data</span>
                <input name="data" type="date" value={form.data} onChange={alterarCampo} required />
              </label>
              <label className={styles.campo}>
                <span>Categoria</span>
                <select name="id_categoria" value={form.id_categoria} onChange={alterarCampo}>
                  <option value="">Sem categoria</option>
                  {categorias.map((categoria) => <option key={categoria.id_categoria} value={categoria.id_categoria}>{categoria.nome_categoria}</option>)}
                </select>
              </label>
              <label className={styles.campo}>
                <span>Método</span>
                <select name="id_metodo" value={form.id_metodo} onChange={alterarCampo}>
                  <option value="">Sem método</option>
                  {metodosUnicos(metodos, form.id_metodo).map((metodo) => <option key={metodo.id_metodo} value={metodo.id_metodo}>{metodo.nome_metodo}</option>)}
                </select>
              </label>
              <label className={styles.checkboxCampo}>
                <input name="quitado" type="checkbox" checked={form.quitado} onChange={alterarCampo} />
                <span>Já foi recebido ou pago</span>
              </label>
              <div className={styles.acoesForm}>
                <button className={styles.botaoSecundario} type="button" onClick={fecharForm}>Cancelar</button>
                <button className={styles.botaoPrimario} type="submit" disabled={salvando || !contas.length}>
                  {salvando ? "Salvando..." : "Salvar transação"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className={styles.resumo} aria-label="Resumo do mês">
          <article className={styles.resumoItem}>
            <span className={styles.resumoRotulo}><ArrowDownLeft size={16} /> Entradas no mês</span>
            {resumo.length ? resumo.map((linha) => (
              <strong className={styles.resumoValor} key={`entrada-${linha.moeda}`}>{moedaParaCodigo(linha.moeda)} {formatarMoeda(linha.entradas, linha.moeda)}</strong>
            )) : <strong className={styles.resumoValor}>{formatarMoeda(0, "Real")}</strong>}
          </article>
          <article className={styles.resumoItem}>
            <span className={styles.resumoRotulo}><ArrowUpRight size={16} /> Saídas no mês</span>
            {resumo.length ? resumo.map((linha) => (
              <strong className={styles.resumoValor} key={`saida-${linha.moeda}`}>{moedaParaCodigo(linha.moeda)} {formatarMoeda(linha.saidas, linha.moeda)}</strong>
            )) : <strong className={styles.resumoValor}>{formatarMoeda(0, "Real")}</strong>}
          </article>
          <article className={`${styles.resumoItem} ${styles.resumoSaldo}`}>
            <span className={styles.resumoRotulo}>Movimentações registradas</span>
            <strong className={styles.resumoValor}>{transacoes.length}</strong>
            <span className={styles.resumoNota}>no período completo</span>
          </article>
        </section>

      </main>
      <Footer />
    </div>
  );
}