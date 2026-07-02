import React from "react";
import styles from "./FormCarteira.module.css";

const FormCarteira = ({ formData, editId, loading, onChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.formRow}>
        <input
          type="text"
          name="nome_carteira"
          placeholder="Nome da carteira"
          value={formData.nome_carteira}
          onChange={onChange}
          className={styles.input}
          disabled={loading}
        />

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? "Salvando..." : editId ? "Atualizar carteira" : "Adicionar carteira"}
        </button>

        {editId && (
          <button type="button" className={styles.btnCancel} onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormCarteira;
