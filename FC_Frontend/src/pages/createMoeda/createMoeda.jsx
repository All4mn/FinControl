
import React from "react";
import HeaderLogged from "../../components/componentesPadrao/headerLogged/HeaderLogged";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./CreateMoeda.module.css";
import { useCreateMoeda } from "./useCreateMoeda";

export default function CreateMoeda() {
  const { formData, carregando, erro, sucesso, handleChange, handleSubmit } = useCreateMoeda();

  return (
    <div className={styles.page}>
      <HeaderLogged usuario={null} />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Criar Moeda</h1>

          {erro && <div className={styles.erro}>{erro}</div>}
          {sucesso && <div className={styles.sucesso}>{sucesso}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="nome_moeda"
              placeholder="Nome da moeda"
              value={formData.nome_moeda}
              onChange={handleChange}
              autoComplete="off"
              aria-label="Nome da moeda"
              className={styles.input}
            />
            <button type="submit" disabled={carregando} className={styles.btn}>
              {carregando ? <span className={styles.spinner} /> : "Enviar"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}