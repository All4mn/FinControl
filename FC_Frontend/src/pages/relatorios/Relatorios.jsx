import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import { dataTransacaoParaDataLocal } from "../../utils/dataTransacao.js";
import { calcularSaldoAcumulado, filtrarTransacoesDasContas } from "../../utils/relatorioFinanceiro.js";
import styles from "./Relatorios.module.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const CORES = ["#197149", "#ed806b", "#3983ba", "#e5a936", "#38a6a0", "#b45f91", "#839b43", "#d36c43"];

const moedaParaCodigo = (nome) => {
  const valor = String(nome || "").toLowerCase();
  if (valor.includes("euro")) return "EUR";
  if (valor.includes("dólar") || valor.includes("dolar") || valor.includes("usd")) return "USD";
  if (valor.includes("real") || valor.includes("brl")) return "BRL";
  return "BRL";
};

const formatarMoeda = (valor, moeda) => new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: moedaParaCodigo(moeda),
  maximumFractionDigits: 0,
}).format(Number(valor) || 0);

export default function Relatorios() {
  const anoAtual = new Date().getFullYear();
  const [usuario, setUsuario] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth());
  const [moedaSelecionada, setMoedaSelecionada] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const respostaUsuario = await axios.get(`${API_BASE_URL}/usuarios/me`, { withCredentials: true });
        if (!respostaUsuario.data.sucesso) {
          window.location.href = "/login";
          return;
        }
        const dadosUsuario = respostaUsuario.data.dados;
        setUsuario(dadosUsuario);
        const [respostaContas, respostaTransacoes] = await Promise.all([
          axios.get(`${API_BASE_URL}/contas/search/${dadosUsuario.id_usuario}`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/transacoes`, { withCredentials: true }),
        ]);
        setTransacoes(filtrarTransacoesDasContas(
          respostaTransacoes.data.dados,
          respostaContas.data.dados,
        ));
      } catch (falha) {
        if (falha.response?.status === 401) {
          window.location.href = "/login";
          return;
        }
        setErro(falha.response?.data?.mensagem || "Não foi possível carregar os relatórios.");
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const moedas = useMemo(
    () => [...new Set(transacoes.map((transacao) => transacao.nome_moeda || "Real"))],
    [transacoes],
  );
  const moeda = moedas.includes(moedaSelecionada) ? moedaSelecionada : moedas[0] || "Real";

  const anos = useMemo(() => {
    const anosDados = transacoes.map((transacao) => dataTransacaoParaDataLocal(transacao.data).getFullYear()).filter(Number.isFinite);
    const primeiroAno = Math.min(2020, ...anosDados);
    return Array.from({ length: Math.max(1, anoAtual - primeiroAno + 1) }, (_, indice) => primeiroAno + indice);
  }, [anoAtual, transacoes]);

  const mesesDoAno = useMemo(() => MESES.map((nome, mes) => {
    const doMes = transacoes.filter((transacao) => {
      const data = dataTransacaoParaDataLocal(transacao.data);
      return data.getFullYear() === anoSelecionado
        && data.getMonth() === mes
        && transacao.quitado
        && (transacao.nome_moeda || "Real") === moeda;
    });
    const entradas = doMes.reduce((total, transacao) => total + (transacao.entrada ? Number(transacao.valor) || 0 : 0), 0);
    const saidas = doMes.reduce((total, transacao) => total + (!transacao.entrada ? Number(transacao.valor) || 0 : 0), 0);
    return { nome, mes, entradas, saidas, saldo: entradas - saidas, quantidade: doMes.length };
  }), [anoSelecionado, moeda, transacoes]);

  const despesas = useMemo(() => {
    const agrupadas = new Map();
    transacoes.forEach((transacao) => {
      const data = dataTransacaoParaDataLocal(transacao.data);
      if (transacao.entrada || !transacao.quitado || data.getFullYear() !== anoSelecionado || data.getMonth() !== mesSelecionado
        || (transacao.nome_moeda || "Real") !== moeda) return;
      const categoria = transacao.nome_categoria || "Sem categoria";
      agrupadas.set(categoria, (agrupadas.get(categoria) || 0) + (Number(transacao.valor) || 0));
    });
    const lista = [...agrupadas.entries()].map(([categoria, valor]) => ({ categoria, valor })).sort((a, b) => b.valor - a.valor);
    const total = lista.reduce((soma, item) => soma + item.valor, 0);
    const resultado = lista.reduce((acumulado, item, indice) => {
      const percentual = total ? (item.valor / total) * 100 : 0;
      const inicio = acumulado.percentual;
      return {
        percentual: inicio + percentual,
        lista: [...acumulado.lista, {
          ...item,
          percentual,
          cor: CORES[indice % CORES.length],
          inicio,
          fim: inicio + percentual,
        }],
      };
    }, { percentual: 0, lista: [] });
    return { lista: resultado.lista, total };
  }, [anoSelecionado, mesSelecionado, moeda, transacoes]);

  const pontosLinha = useMemo(() => {
    const hoje = new Date();
    const pontos = mesesDoAno.map((item, indice) => {
      const fimMes = new Date(anoSelecionado, item.mes + 1, 0, 23, 59, 59, 999);
      if (fimMes > hoje) {
        return { ...item, x: 56 + indice * (608 / 11), saldo: null };
      }
      return {
        ...item,
        x: 56 + indice * (608 / 11),
        saldo: calcularSaldoAcumulado(transacoes, moeda, fimMes),
      };
    });
    const valores = pontos.map((item) => item.saldo).filter((valor) => valor !== null);
    const menor = Math.min(0, ...valores);
    const maior = Math.max(0, ...valores);
    const amplitude = maior - menor || 1;
    return pontos.map((item) => ({
      ...item,
      y: item.saldo === null ? null : 210 - ((item.saldo - menor) / amplitude) * 174,
    }));
  }, [anoSelecionado, mesesDoAno, moeda, transacoes]);

  if (carregando) {
    return <div className={styles.page}><Header usuario={usuario} logado={true} /><main className={styles.main}><p className={styles.estado}>Carregando relatórios...</p></main><Footer /></div>;
  }

  return (
    <div className={styles.page}>
      <Header usuario={usuario} logado={true} />
      <main className={styles.main}>
        <header className={styles.topo}>
          <div>
            <p className={styles.sobretitulo}>FINANÇAS / ANÁLISES</p>
            <h1>Relatórios</h1>
            <p className={styles.subtitulo}>Acompanhe seus resultados e entenda para onde vai o seu dinheiro.</p>
          </div>
          <label className={styles.seletorMoeda}>
            <span>Moeda</span>
            <select value={moeda} onChange={(evento) => setMoedaSelecionada(evento.target.value)}>
              {(moedas.length ? moedas : ["Real"]).map((item) => <option key={item} value={item}>{moedaParaCodigo(item)}</option>)}
            </select>
          </label>
        </header>

        {erro && <p className={styles.erro} role="alert">{erro}</p>}

        <section className={styles.secaoMeses} aria-label={`Resumo mensal de ${anoSelecionado}`}>
          <div className={styles.secaoTopo}>
            <div>
              <p className={styles.sobretitulo}>DESEMPENHO ANUAL</p>
              <h2>Relatório mensal</h2>
            </div>
            <div className={styles.anos} role="group" aria-label="Selecionar ano">
              {anos.map((ano) => (
                <button key={ano} type="button" className={ano === anoSelecionado ? styles.anoAtivo : ""} onClick={() => setAnoSelecionado(ano)} aria-pressed={ano === anoSelecionado}>{ano}</button>
              ))}
            </div>
          </div>

          <div className={styles.gradeMeses}>
            {mesesDoAno.map((item) => {
              const estado = !item.quantidade ? styles.mesSemDados : item.saldo > 0 ? styles.mesPositivo : item.saldo < 0 ? styles.mesNegativo : styles.mesNeutro;
              return (
                <button type="button" key={item.mes} className={`${styles.mesCard} ${estado} ${mesSelecionado === item.mes ? styles.mesSelecionado : ""}`} onClick={() => setMesSelecionado(item.mes)} aria-pressed={mesSelecionado === item.mes}>
                  <span className={styles.mesNome}>{item.nome}</span>
                  <strong>{item.quantidade ? formatarMoeda(item.saldo, moeda) : "—"}</strong>
                  <span className={styles.mesDetalhe}>{item.quantidade ? `${item.quantidade} ${item.quantidade === 1 ? "movimentação" : "movimentações"}` : "Sem dados"}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.legendaMeses} aria-label="Legenda">
            <span><i className={styles.legendaPositiva} /> Saldo positivo</span>
            <span><i className={styles.legendaNegativa} /> Saldo negativo</span>
            <span><i className={styles.legendaNeutra} /> Sem variação</span>
            <span><i className={styles.legendaVazia} /> Sem dados</span>
          </div>
        </section>

        <section className={styles.resumoMes} aria-label={`Resumo de ${MESES[mesSelecionado]} de ${anoSelecionado}`}>
          <div><span><ArrowDownLeft size={16} /> Entradas quitadas</span><strong>{formatarMoeda(mesesDoAno[mesSelecionado].entradas, moeda)}</strong></div>
          <div><span><ArrowUpRight size={16} /> Saídas pagas</span><strong>{formatarMoeda(mesesDoAno[mesSelecionado].saidas, moeda)}</strong></div>
          <div><span>Resultado do mês</span><strong>{formatarMoeda(mesesDoAno[mesSelecionado].saldo, moeda)}</strong></div>
        </section>

        <section className={styles.secaoGraficos} aria-label="Gráficos do relatório">
          <article className={styles.graficoPainel}>
            <div className={styles.graficoCabecalho}>
              <div><h2>Saldo acumulado pelas transações</h2><p>Soma das movimentações quitadas até o fim do mês; não inclui saldo inicial não registrado como transação.</p></div>
            </div>
            <div className={styles.linhaRolagem}>
              <svg className={styles.graficoLinha} viewBox="0 0 720 260" role="img" aria-label={`Saldo acumulado pelas transações em ${moedaParaCodigo(moeda)} durante ${anoSelecionado}`}>
                {[36, 94, 152, 210].map((y) => <line key={y} x1="42" x2="684" y1={y} y2={y} className={styles.linhaGrade} />)}
                <polyline points={pontosLinha.filter((ponto) => ponto.y !== null).map((ponto) => `${ponto.x},${ponto.y}`).join(" ")} className={styles.linhaDados} />
                {pontosLinha.map((ponto) => <g key={ponto.mes}>{ponto.y !== null && <circle cx={ponto.x} cy={ponto.y} r="4" className={styles.pontoDados} />}<text x={ponto.x} y="244" textAnchor="middle" className={styles.rotuloEixo}>{ponto.nome}</text></g>)}
              </svg>
            </div>
          </article>

          <article className={styles.graficoPainel}>
            <div className={styles.graficoCabecalho}>
              <div><h2>Gastos por categoria</h2><p>Despesas em {MESES[mesSelecionado]} de {anoSelecionado}.</p></div>
            </div>
            {despesas.lista.length ? (
              <div className={styles.donutLayout}>
                <div className={styles.donut} role="img" aria-label={despesas.lista.map((fatia) => `${fatia.categoria}: ${fatia.percentual.toFixed(1)}%`).join(", ")} style={{ background: `conic-gradient(${despesas.lista.map((fatia) => `${fatia.cor} ${fatia.inicio}% ${fatia.fim}%`).join(", ")})` }}>
                  <div className={styles.donutCentro}><span>{MESES[mesSelecionado].toLowerCase()} {String(anoSelecionado).slice(-2)}</span><strong>{formatarMoeda(despesas.total, moeda)}</strong></div>
                </div>
                <ul className={styles.legendaDonut}>
                  {despesas.lista.map((fatia) => <li key={fatia.categoria}><span className={styles.amostraCor} style={{ backgroundColor: fatia.cor }} /><span className={styles.nomeCategoria}>{fatia.categoria}</span><strong>{fatia.percentual.toFixed(0)}%</strong></li>)}
                </ul>
              </div>
            ) : <div className={styles.graficoVazio}>Nenhuma despesa registrada neste mês.</div>}
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
