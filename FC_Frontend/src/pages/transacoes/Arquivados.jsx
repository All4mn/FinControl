import { useEffect, useState } from "react";
import axios from "axios";
import { ArchiveRestore } from "lucide-react";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import { dataTransacaoParaDataLocal } from "../../utils/dataTransacao.js";
import styles from "./Transacoes.module.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";

const codigoMoeda = (nome) => {
  const valor = String(nome || "").toLowerCase();
  if (valor.includes("euro")) return "EUR";
  if (valor.includes("dólar") || valor.includes("dolar") || valor.includes("usd")) return "USD";
  return "BRL";
};

const formatarMoeda = (valor, moeda) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: codigoMoeda(moeda),
  }).format(Number(valor) || 0);

export default function Arquivados() {
  const [usuario, setUsuario] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarArquivadas = async () => {
    const resposta = await axios.get(`${API_BASE_URL}/transacoes/arquivadas`, { withCredentials: true });
    setTransacoes(resposta.data.dados || []);
  };

  useEffect(() => {
    const carregar = async () => {
      try {
        const respostaUsuario = await axios.get(`${API_BASE_URL}/usuarios/me`, { withCredentials: true });
        if (!respostaUsuario.data.sucesso) {
          window.location.href = "/login";
          return;
        }
        setUsuario(respostaUsuario.data.dados);
        await carregarArquivadas();
      } catch (falha) {
        if (falha.response?.status === 401) {
          window.location.href = "/login";
          return;
        }
        setErro(falha.response?.data?.mensagem || "Não foi possível carregar os arquivados.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const restaurar = async (transacao) => {
    try {
      await axios.put(`${API_BASE_URL}/transacoes/${transacao.id_transacao}/restore`, {}, { withCredentials: true });
      await carregarArquivadas();
    } catch (falha) {
      setErro(falha.response?.data?.mensagem || "Não foi possível restaurar a movimentação.");
    }
  };

  return (
    <div className={styles.page}>
      <Header usuario={usuario} logado={true} />
      <main className={styles.main}>
        <div className={styles.topo}>
          <div>
            <p className={styles.sobretitulo}>FINANÇAS / MOVIMENTAÇÕES</p>
            <h1>Arquivados</h1>
            <p className={styles.subtitulo}>Movimentações removidas da lista principal.</p>
          </div>
        </div>

        {erro && <p className={styles.erro} role="alert">{erro}</p>}

        <section className={styles.listaSection}>
          <div className={styles.listaTopo}><h2>Movimentações arquivadas</h2></div>
          {carregando ? (
            <p className={styles.estado}>Carregando arquivados...</p>
          ) : transacoes.length ? (
            <div className={styles.tabelaRolagem}>
              <table className={styles.tabela}>
                <thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th><th>Conta</th><th>Ação</th></tr></thead>
                <tbody>
                  {transacoes.map((transacao) => (
                    <tr key={transacao.id_transacao}>
                      <td>{new Intl.DateTimeFormat("pt-BR").format(dataTransacaoParaDataLocal(transacao.data))}</td>
                      <td><span className={styles.descricao}>{transacao.descricao}</span></td>
                      <td>{transacao.entrada ? "Receita" : "Despesa"}</td>
                      <td className={`${styles.valor} ${transacao.entrada ? styles.valorEntrada : styles.valorSaida}`}>
                        {formatarMoeda(transacao.valor, transacao.nome_moeda)}
                      </td>
                      <td>{transacao.nome_conta}</td>
                      <td>
                        <button className={styles.botaoRestaurar} type="button" onClick={() => restaurar(transacao)} aria-label={`Restaurar ${transacao.descricao}`} title="Restaurar movimentação">
                          <ArchiveRestore size={17} aria-hidden="true" /> Restaurar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.vazio}>
              <h3>Nenhuma movimentação arquivada</h3>
              <p>Movimentações arquivadas aparecerão aqui.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}