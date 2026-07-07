import React from "react";
import styles from "./FormMoeda.module.css";

export default function FormMoeda({ formData, carregando, erro, sucesso, handleChange, handleSubmit }) {
  return (
    <section className={styles.cardForm}>
      <h1 className={styles.titulo}>Criar moeda</h1>

      {erro && <div className={styles.erro}>{erro}</div>}
      {sucesso && <div className={styles.sucesso}>{sucesso}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="nome_moeda"
          placeholder="Ex: Dólar Americano"
          value={formData.nome_moeda}
          onChange={handleChange}
          autoComplete="off"
          className={styles.input}
        />
        <button type="submit" disabled={carregando} className={styles.btn}>
          {carregando ? <span className={styles.spinner} /> : "Adicionar Moeda"}
        </button>
      </form>
    </section>
  );
}