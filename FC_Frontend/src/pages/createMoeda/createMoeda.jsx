import React from "react";
import Header from "../../components/componentesPadrao/header/Header";
import Footer from "../../components/componentesPadrao/footer/Footer";
import styles from "./createMoeda.module.css";
import { useCreateMoeda } from "./useCreateMoeda.js";

export default function CreateMoeda() {
  const { formData, loading, error, sucesso, handleChange, handleSubmit } = useCreateMoeda();

  return (
    <div className={styles.page}>
      <Header logado={true} />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Criar Moeda</h1>

          {error && <div className={styles.erro}>{error}</div>}
          {sucesso && <div className={styles.sucesso}>{sucesso}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              name="nome_moeda"
              placeholder="Nome da moeda"
              value={formData.nome_moeda}
              onChange={handleChange}
              className={styles.input}
            />
            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Processando..." : "Criar"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}