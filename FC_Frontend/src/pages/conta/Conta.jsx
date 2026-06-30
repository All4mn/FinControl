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
    "http://localhost:3000"
    // import.meta.env.VITE_BACKEND_RENDER_URL || "http://localhost:3000";
  const [usuario, setUsuario] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [conta, setConta] = React.useState(null);
  const [criando, setCriando] = React.useState(false);
  const [contaInfos, setContaInfos] = React.useState({
    id_usuario: "",
    id_moeda: "",
    nome_conta: "",
    saldo_conta: "",
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        console.log(API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/usuarios/me`, {
          withCredentials: true,
        });

        console.log(`${API_BASE_URL}/usuarios/me`);
        
        console.log(response);

        if (response.data.sucesso) {
          setUsuario(response.data.dados);
          setContaInfos((prev) => ({
            ...prev,
            id_usuario: response.data.dados.id_usuario,
          }));
          await fetchConta(response.data.dados.id_usuario);
        } else {
          // window.location.href = "/login";
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        // window.location.href = "/login";
      } finally {
        setCarregando(false);
      }
    };
    fetchUsuario();
  }, []);

  const fetchConta = async (idUsuario) => {
    try {
      // const response = await axios.get(`${API_BASE_URL}/contas/search/${usuario.id_usuario}`)
      const response = await axios.get(
        `http://localhost:3000/contas/search/${idUsuario}`,
      );
      if (!response) {
        throw new Error("falha em buscar conta");
      }

      setConta(response.data.dados);
      console.log(conta);
    } catch (error) {
      console.error(error);
    }
  };

  const postConta = async (e) => {
    e.preventDefault();
    console.log(contaInfos);
    try {
      console.log(contaInfos);
      const response = await axios.post(`${API_BASE_URL}/contas`, contaInfos);
      console.log(response);
      if (!response) {
        throw new Error("erro ao enviar dados");
      }

      // const reponse = await
    } catch (error) {
      console.error(error.message);
    } finally {
      fetchConta(usuario.id_usuario);
      setCriando(false);
    }
  };

  const archiveConta = async (id) => {
    try {
      console.log(id);
      const response = await axios.put(`http://localhost:3000/contas/arquivar/${id}`)
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
      const response = await axios.put(`http://localhost:3000/contas/desarquivar/${id}`)
      if(!response){
        throw new Error('erro ao arquivar a conta')
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
      const response = await axios.put(`http://localhost:3000/contas/${id}`,dados)
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
              onFechar={() => setCriando(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Conta;
