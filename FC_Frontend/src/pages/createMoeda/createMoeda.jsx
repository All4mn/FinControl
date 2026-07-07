import React from "react";
import HeaderLogged from "../../components/componentesPadrao/headerLogged/HeaderLogged";
import Footer from "../../components/componentesPadrao/footer/Footer";
import FormMoeda from "../../components/componentesPadrao/formMoeda/FormMoeda";
import TableMoeda from "../../components/componentesPadrao/tableMoeda/TableMoeda";
import styles from "./createMoeda.module.css";
import { useCreateMoeda } from "./useCreateMoeda";

export default function CreateMoeda() {
  const {
    formData, carregando, erro, sucesso, handleChange, handleSubmit,
    moedas, carregandoLista, erroLista,
    editandoId, editandoValor, salvando, iniciarEdicao, cancelarEdicao, handleEditChange, salvarEdicao,
    deletandoId, deletarMoeda,
  } = useCreateMoeda();

  return (
    <div className={styles.page}>
      <HeaderLogged usuario={null} />
      
      <main className={styles.main}>
        {/* Formulário Modularizado */}
        <FormMoeda 
          formData={formData}
          carregando={carregando}
          erro={erro}
          sucesso={sucesso}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        {/* Listagem Modularizada */}
        <TableMoeda 
          moedas={moedas}
          carregandoLista={carregandoLista}
          erroLista={erroLista}
          editandoId={editandoId}
          editandoValor={editandoValor}
          salvando={salvando}
          iniciarEdicao={iniciarEdicao}
          cancelarEdicao={cancelarEdicao}
          handleEditChange={handleEditChange}
          salvarEdicao={salvarEdicao}
          deletandoId={deletandoId}
          deletarMoeda={deletarMoeda}
        />
      </main>
      
      <Footer />
    </div>
  );
}