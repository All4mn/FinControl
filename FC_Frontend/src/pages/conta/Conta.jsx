import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./Conta.module.css";
import Header from "../../components/componentesPadrao/headerLogged/HeaderLogged.jsx";
import Footer from "../../components/componentesPadrao/footer/Footer.jsx";
import FormularioConta from "../../components/componentesPadrao/formularioConta/FormularioConta.jsx";

import TableConta from "../../components/componentesPadrao/tableConta/TableConta.jsx";
const Conta = () => {
  const API_BASE_URL =
    // "http://localhost:3000"
    import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";
  const [usuario, setUsuario] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [conta, setConta] = React.useState(null);
  const [moeda, setMoeda] = React.useState([])
  const [criando, setCriando] = React.useState(false);
  const [salvandoConta, setSalvandoConta] = React.useState(false);
  const [erroConta, setErroConta] = React.useState("");
  const [erroMoeda, setErroMoeda] = React.useState("");
  const [contaInfos, setContaInfos] = React.useState({
    id_usuario: "",
    id_moeda: "",
    nome_conta: "",
    saldo_conta: "",
  });

  const fetchConta = async (idUsuario) => {
    try {
      // const response = await axios.get(`${API_BASE_URL}/contas/search/${usuario.id_usuario}`)
      const response = await axios.get(
        `${API_BASE_URL}/contas/search/${idUsuario}`
      );
      if (!response) {
        console.log("sem contas")
        throw new Error("erro ao buscar contas");
      }

      setConta(response.data.dados);
      console.log(conta);
    } catch {
      return
    }
  };

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
        { withCredentials: true },
      );
      const contaCriada = resposta.data.dados;
      setConta((anterior) => [
        ...(anterior || []).filter((item) => item.id_conta !== contaCriada.id_conta),
        contaCriada,
      ]);
      try {
        await fetchConta(usuario.id_usuario);
      } catch {
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
        error.response?.data?.mensagem ||
          error.response?.data?.message ||
          "Não foi possível criar a conta. Verifique se o servidor e o banco estão disponíveis.",
      );
    } finally {
      setSalvandoConta(false);
    }
  };

  const archiveConta = async (id) => {
    try {
      console.log(id);
      const response = await axios.put(
        `${API_BASE_URL}/contas/arquivar/${id}`,
      );
      if(!response){
        throw new Error('erro ao arquivar a conta')
      }
    } catch (error) {
        console.log(error.message)
    }finally{
      fetchConta(usuario.id_usuario)
    }
  };

  const desarchiveConta = async (id) => {
    try {
      console.log(id);
      const response = await axios.put(
        `${API_BASE_URL}/contas/desarquivar/${id}`,
      );
      if(!response){
        throw new Error('erro ao desarquivar a conta')
      }
    } catch (error) {
        console.log(error.message)
    }finally{
      fetchConta(usuario.id_usuario)
    }
  }

  const updateConta = async (nome, id) => {
    try {
      const dados = {
        "nome_conta":nome
      }
      console.log(nome, id);
      const response = await axios.put(
        `${API_BASE_URL}/contas/${id}`,
        dados
      );
      if(!response){
        throw new Error("Nao deu pra atualizar")
      }
      console.log(response)
    } catch (error) {
      console.log(error.message);
      
    } finally{
      fetchConta(usuario.id_usuario)
    }
  }

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        const [resultadoUsuario, resultadoMoedas] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/usuarios/me`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/moedas`, { withCredentials: true }),
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
          const respostaContas = await axios.get(
            `${API_BASE_URL}/contas/search/${usuarioAtual.id_usuario}`,
            { withCredentials: true },
          );
          setConta(respostaContas.data.dados || []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados da conta:", err);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosIniciais();
  }, [API_BASE_URL]);

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
