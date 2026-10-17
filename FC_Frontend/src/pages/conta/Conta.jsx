import React from "react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import styles from "./Conta.module.css";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import FormularioConta from "../../components/componentesPadrao/formularioConta/FormularioConta.jsx";

import TableConta from "../../components/componentesPadrao/tableConta/TableConta.jsx";
const Conta = () => {
  const API_BASE_URL = import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [conta, setConta] = React.useState(null);
  const [moeda, setMoeda] = React.useState([]);
  const [criando, setCriando] = React.useState(false);
  const [salvandoConta, setSalvandoConta] = React.useState(false);
  const [erroConta, setErroConta] = React.useState("");
  const [erroMoeda, setErroMoeda] = React.useState("");
  const [erroLista, setErroLista] = React.useState("");
  const [contaInfos, setContaInfos] = React.useState({
    id_usuario: "",
    id_moeda: "",
    nome_conta: "",
    saldo_conta: "",
  });

  // O handler global responde { status, message }; os controllers, { sucesso,
  // mensagem }. Lemos os dois.
  const mensagemDoErro = (error, padrao) =>
    error?.response?.data?.mensagem || error?.response?.data?.message || padrao;

  // Retorna false em falha: o chamador precisa distinguir "não achei" de
  // "a requisição falhou".
  const fetchConta = useCallback(async (idUsuario) => {
    if (!idUsuario) {
      setErroLista("Não foi possível identificar o usuário. Atualize a página.");
      return false;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/contas/search/${idUsuario}`,
        { withCredentials: true, timeout: 20000 },
      );
      setConta(response.data.dados || []);
      setErroLista("");
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        // "Usuario sem conta" é o estado inicial esperado, não uma falha.
        setConta([]);
        setErroLista("");
        return true;
      }
      console.error("Erro ao buscar contas:", error);
      setErroLista(mensagemDoErro(error, "Não foi possível carregar as contas. Verifique a conexão com o servidor."));
      return false;
    }
  }, [API_BASE_URL]);


  const postConta = async (e) => {
    e.preventDefault();
    setErroConta("");
    if (!moeda.length) {
      setErroConta("Não há moedas disponíveis. Verifique o banco de dados e tente novamente.");
      return;
    }
    setSalvandoConta(true);
    try {
      const resposta = await axios.post(
        `${API_BASE_URL}/contas`,
        contaInfos,
        { withCredentials: true, timeout: 20000 },
      );
      const contaCriada = resposta.data.dados;
      setConta((anterior) => [
        ...(anterior || []).filter((item) => item.id_conta !== contaCriada.id_conta),
        contaCriada,
      ]);
      // O aviso só aparece porque fetchConta sinaliza a falha; antes o catch
      // engolia o erro e isto era código morto.
      const atualizou = await fetchConta(usuario?.id_usuario);
      if (!atualizou) {
        setErroConta("Conta criada, mas não foi possível atualizar a lista. Atualize a página.");
      }
      setContaInfos((anterior) => ({
        ...anterior,
        id_moeda: "",
        nome_conta: "",
        saldo_conta: "",
      }));
      setCriando(false);
    } catch (error) {
      setErroConta(
        mensagemDoErro(error, "Não foi possível criar a conta. Verifique se o servidor e o banco estão disponíveis."),
      );
    } finally {
      setSalvandoConta(false);
    }
  };

const archiveConta = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/contas/arquivar/${id}`,
        {},
        { withCredentials: true, timeout: 20000 },
      );
      setErroLista("");
    } catch (error) {
      console.error("Erro ao arquivar a conta:", error);
      setErroLista(mensagemDoErro(error, "Não foi possível arquivar a conta."));
    } finally {
      await fetchConta(usuario?.id_usuario);
    }
  };

  const desarchiveConta = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/contas/desarquivar/${id}`,
        {},
        { withCredentials: true, timeout: 20000 },
      );
      setErroLista("");
    } catch (error) {
      console.error("Erro ao desarquivar a conta:", error);
      setErroLista(mensagemDoErro(error, "Não foi possível reativar a conta."));
    } finally {
      await fetchConta(usuario?.id_usuario);
    }
  };

  const updateConta = async (nome, id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/contas/${id}`,
        { nome_conta: nome },
        { withCredentials: true, timeout: 20000 },
      );
      setErroLista("");
    } catch (error) {
      console.error("Erro ao atualizar a conta:", error);
      setErroLista(mensagemDoErro(error, "Não foi possível atualizar o nome da conta."));
    } finally {
      await fetchConta(usuario?.id_usuario);
    }
  };


  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resultadoUsuario, resultadoMoedas] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/usuarios/me`, { withCredentials: true, timeout: 20000 }),
          axios.get(`${API_BASE_URL}/moedas`, { withCredentials: true, timeout: 20000 }),
        ]);
        if (resultadoMoedas.status === "fulfilled") {
          const moedasDisponiveis = resultadoMoedas.value.data.dados || [];
          setMoeda(moedasDisponiveis);
          setErroMoeda(
            moedasDisponiveis.length
              ? ""
              : "Nenhuma moeda está cadastrada. Cadastre uma moeda antes de criar uma conta.",
          );
        } else {
          setErroMoeda("Não foi possível carregar as moedas. Verifique se o servidor e o banco estão disponíveis.");
        }

        if (resultadoUsuario.status === "rejected") throw resultadoUsuario.reason;
        const respostaUsuario = resultadoUsuario.value;
        const usuarioAtual = respostaUsuario.data.dados;

        if (respostaUsuario.data.sucesso && usuarioAtual) {
          setUsuario(usuarioAtual);
          setContaInfos((prev) => ({
            ...prev,
            id_usuario: usuarioAtual.id_usuario,
          }));
          // fetchConta já trata 404 e falha de rede.
          await fetchConta(usuarioAtual.id_usuario);
        }
      } catch (err) {
        console.error("Erro ao carregar dados da conta:", err);
        if (err.response?.status === 401) {
          window.location.href = "/login";
          return;
        }
        setErroLista(
          mensagemDoErro(err, "Não foi possível carregar seus dados. Verifique a conexão com o servidor."),
        );
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosIniciais();
  }, [API_BASE_URL, fetchConta]);

  if (carregando) {
    return (
      <div className={styles.dashboard}>
        <Header usuario={null} logado={true} />
        <main className={styles.main}>
          <p>Carregando informações do usuário...</p>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className={styles.conta_window}>
      <Header usuario={usuario} logado={true} />

      <main className={styles.main}>
        {erroLista && (
          <p role="alert">
            {erroLista}
          </p>
        )}

        <div className={styles.lista_contas}>
          <TableConta 
            conta={conta}
            archiveConta={archiveConta}
            desarchiveConta={desarchiveConta}
            updateConta={updateConta}
          />
        </div>

        <button className={styles.btn_criar} onClick={() => setCriando(true)}>
          + Criar conta
        </button>
      </main>

      <Footer />

      {/* Overlay + modal — fora do main para cobrir tudo */}
      {criando && (
        <div className={styles.overlay} onClick={() => setCriando(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <FormularioConta
              postConta={postConta}
              setContaInfos={setContaInfos}
              contaInfos={contaInfos}
              moeda={moeda}
              carregando={salvandoConta}
              erro={erroConta || erroMoeda}
              onFechar={() => setCriando(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Conta;
